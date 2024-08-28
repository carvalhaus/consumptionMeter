import { Base64 } from 'js-base64';
import { z, ZodError } from 'zod';
import { NextFunction, Request, Response, Router } from 'express';
import { prisma } from '../lib/prisma';

import { readMeter } from '../lib/vision-pro';

const MEASURE_TYPES = ['WATER', 'GAS'] as const;

const uploadImageSchema = z.object({
  image: z.string().refine(Base64.isValid),
  customer_code: z.string(),
  measure_datetime: z.coerce.date(),
  measure_type: z.enum(MEASURE_TYPES),
});

const router = Router();

router.post(
  '/upload',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = uploadImageSchema.parse(req.body);

      const { image, customer_code, measure_datetime, measure_type } =
        parsedBody;

      const existingMeasurement = await prisma.measurement.findFirst({
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

      let result: string;

      result = await readMeter(image);
      const measure_value = parseInt(result, 10);
      console.log(measure_value);

      const upload = await prisma.measurement.create({
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
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error_code: 'INVALID_DATA',
          error_description: error.errors,
        });
      }
    }
  },
);

export { router as uploadImage };
