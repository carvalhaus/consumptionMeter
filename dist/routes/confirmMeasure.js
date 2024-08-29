"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmMeasure = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const applicationSchemas_1 = require("../schemas/applicationSchemas");
const router = (0, express_1.Router)();
exports.confirmMeasure = router;
router.patch('/confirm', async (req, res, next) => {
    try {
        const parsedBody = applicationSchemas_1.confirmMeasureSchema.parse(req.body);
        const { confirmed_value, measure_uuid } = parsedBody;
        const confirmedValue = await prisma_1.prisma.measurement.findUnique({
            where: {
                measure_uuid: measure_uuid,
            },
            select: {
                measure_value: true,
                has_confirmed: true,
            },
        });
        if (!confirmedValue) {
            return res.status(404).json({
                error_code: 'MEASURE_NOT_FOUND',
                error_description: 'Leitura do mês já realizada',
            });
        }
        if (confirmedValue.has_confirmed === true) {
            return res.status(409).json({
                error_code: 'CONFIRMATION_DUPLICATE',
                error_description: 'Leitura do mês já realizada',
            });
        }
        if (confirmedValue.measure_value === confirmed_value) {
            await prisma_1.prisma.measurement.update({
                where: {
                    measure_uuid: measure_uuid,
                },
                data: {
                    has_confirmed: true,
                },
            });
            res.status(200).json({ success: true });
        }
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
