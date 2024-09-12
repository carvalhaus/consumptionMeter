"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const zod_1 = require("zod");
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const vision_pro_1 = require("../lib/vision-pro");
const getImageMimeTypeFromBase64_1 = require("../lib/getImageMimeTypeFromBase64");
const tokens_1 = require("../lib/tokens");
const applicationSchemas_1 = require("../schemas/applicationSchemas");
const router = (0, express_1.Router)();
exports.uploadImage = router;
router.post('/upload', async (req, res) => {
    try {
        const parsedBody = applicationSchemas_1.uploadImageSchema.parse(req.body);
        const { image, customer_code, measure_datetime, measure_type } = parsedBody;
        const existingMeasurement = await prisma_1.prisma.measurement.findFirst({
            where: {
                measure_datetime: measure_datetime,
            },
        });
        if (existingMeasurement !== null) {
            return res.status(409).json({
                error_code: 'DOUBLE_REPORT',
                error_description: 'Leitura do mês já realizada',
            });
        }
        const mimeType = (0, getImageMimeTypeFromBase64_1.getImageMimeTypeFromBase64)(image);
        const result = await (0, vision_pro_1.readMeter)(image, mimeType);
        const measure_value = parseInt(result, 10);
        console.log(measure_value);
        await prisma_1.prisma.customer.upsert({
            where: { customer_code },
            update: {},
            create: { customer_code },
        });
        const upload = await prisma_1.prisma.measurement.create({
            data: {
                customer_code,
                measure_datetime,
                measure_type,
                image,
                measure_value,
            },
        });
        const token = upload.measure_uuid;
        const expirationTime = Date.now() + 10 * 60 * 1000; // Expira após 10 minutos
        tokens_1.tokens.set(token, expirationTime.toString());
        res.status(200).json({
            image_url: `http://localhost:3000/view-temp-page/${token}`,
            measure_value: upload.measure_value,
            measure_uuid: upload.measure_uuid,
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({
                error_code: 'INVALID_DATA',
                error_description: error.errors,
            });
        }
    }
});
