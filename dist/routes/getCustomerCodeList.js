"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomerCodeList = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
const applicationSchemas_1 = require("../schemas/applicationSchemas");
const router = (0, express_1.Router)();
exports.getCustomerCodeList = router;
router.get('/:customer_code/list', async (req, res) => {
    try {
        const parsedParams = applicationSchemas_1.customerCodeSchema.parse(req.params);
        const parsedQuery = applicationSchemas_1.measureTypeSchema.parse(req.query);
        const { customer_code } = parsedParams;
        const { measure_type } = parsedQuery;
        if (measure_type && !['WATER', 'GAS'].includes(measure_type)) {
            res.status(400).json({
                error_code: 'INVALID_TYPE',
                error_description: 'Tipo de medição não permitida',
            });
        }
        if (measure_type) {
            const measurementExists = await prisma_1.prisma.measurement.findFirst({
                where: {
                    customer_code: customer_code,
                    measure_type: measure_type,
                },
            });
            if (!measurementExists) {
                return res.status(404).json({
                    error_code: 'MEASURES_NOT_FOUND',
                    error_description: `Nenhuma leitura encontrada`,
                });
            }
        }
        const customerCode = await prisma_1.prisma.customer.findUnique({
            where: {
                customer_code: customer_code,
            },
            select: {
                customer_code: true,
                measures: {
                    where: {
                        ...(measure_type ? { measure_type: measure_type } : {}),
                    },
                    select: {
                        measure_uuid: true,
                        measure_datetime: true,
                        measure_type: true,
                        has_confirmed: true,
                        image_url: true,
                        measure_value: true,
                    },
                },
            },
        });
        if (!customerCode) {
            return res.status(404).json({
                error_code: 'MEASURES_NOT_FOUND',
                error_description: 'Nenhuma leitura encontrada',
            });
        }
        res.status(200).json(customerCode);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({
                error_code: 'INVALID_TYPE',
                error_description: 'Tipo de medição não permitida',
            });
        }
    }
});
