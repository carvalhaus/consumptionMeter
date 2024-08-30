import { Base64 } from 'js-base64';
import { z } from 'zod';

const MEASURE_TYPES = ['WATER', 'GAS'] as const;

export const uploadImageSchema = z.object({
  image: z.string().refine(Base64.isValid),
  customer_code: z.string(),
  measure_datetime: z.coerce.date(),
  measure_type: z.enum(MEASURE_TYPES),
});

export const customerCodeSchema = z.object({
  customer_code: z.string(),
});

export const measureTypeSchema = z.object({
  measure_type: z.enum(MEASURE_TYPES).optional(),
});

export const confirmMeasureSchema = z.object({
  measure_uuid: z.string(),
  confirmed_value: z.number().int(),
});
