import { ZodError } from 'zod';
import { Request, Response, Router } from 'express';
import { prisma } from '../lib/prisma';

import { readMeter } from '../lib/vision-pro';
import { getImageMimeTypeFromBase64 } from '../lib/getImageMimeTypeFromBase64';
import { tokens } from '../lib/tokens';
import { uploadImageSchema } from '../schemas/applicationSchemas';

const router = Router();

router.post('/upload', async (req: Request, res: Response) => {
  try {
    const parsedBody = uploadImageSchema.parse(req.body);

    const { image, customer_code, measure_datetime, measure_type } = parsedBody;

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

    const mimeType: string | null = getImageMimeTypeFromBase64(image);

    const result: string = await readMeter(image, mimeType);
    const measure_value = parseInt(result, 10);
    console.log(measure_value);

    await prisma.customer.upsert({
      where: { customer_code },
      update: {},
      create: { customer_code },
    });

    const upload = await prisma.measurement.create({
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

    tokens.set(token, expirationTime.toString());

    res.status(200).json({
      image_url: `http://localhost:3000/view-temp-page/${token}`,
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
});

export { router as uploadImage };
