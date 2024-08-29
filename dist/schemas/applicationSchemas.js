"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmMeasureSchema = exports.measureTypeSchema = exports.customerCodeSchema = exports.uploadImageSchema = void 0;
const js_base64_1 = require("js-base64");
const zod_1 = require("zod");
const MEASURE_TYPES = ['WATER', 'GAS'];
exports.uploadImageSchema = zod_1.z.object({
    image: zod_1.z.string().refine(js_base64_1.Base64.isValid),
    customer_code: zod_1.z.string(),
    measure_datetime: zod_1.z.coerce.date(),
    measure_type: zod_1.z.enum(MEASURE_TYPES),
});
exports.customerCodeSchema = zod_1.z.object({
    customer_code: zod_1.z.string(),
});
exports.measureTypeSchema = zod_1.z.object({
    measure_type: zod_1.z.enum(MEASURE_TYPES).optional(),
});
exports.confirmMeasureSchema = zod_1.z.object({
    measure_uuid: zod_1.z.string(),
    confirmed_value: zod_1.z.number().int(),
});
