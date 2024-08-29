"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const js_base64_1 = require("js-base64");
const zod_1 = require("zod");
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const vision_pro_1 = require("../lib/vision-pro");
const getImageExtensionFromBase64_1 = require("../lib/getImageExtensionFromBase64");
const MEASURE_TYPES = ['WATER', 'GAS'];
const uploadImageSchema = zod_1.z.object({
    image: zod_1.z.string().refine(js_base64_1.Base64.isValid),
    customer_code: zod_1.z.string(),
    measure_datetime: zod_1.z.coerce.date(),
    measure_type: zod_1.z.enum(MEASURE_TYPES),
});
const router = (0, express_1.Router)();
exports.uploadImage = router;
router.post('/upload', async (req, res, next) => {
    try {
        const parsedBody = uploadImageSchema.parse(req.body);
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
        let mimeType;
        mimeType = (0, getImageExtensionFromBase64_1.getImageMimeTypeFromBase64)(image);
        let result;
        result = await (0, vision_pro_1.readMeter)(image, mimeType);
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
        res.status(200).json({
            image_url: upload.image_url,
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
