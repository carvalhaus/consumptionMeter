import { Request, Response, Router } from 'express';
import { ZodError } from 'zod';
import { prisma } from '../lib/prisma';
import { confirmMeasureSchema } from '../schemas/applicationSchemas';

const router = Router();

router.patch('/confirm', async (req: Request, res: Response) => {
  try {
    const parsedBody = confirmMeasureSchema.parse(req.body);

    const { confirmed_value, measure_uuid } = parsedBody;

    const confirmedValue = await prisma.measurement.findUnique({
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
      await prisma.measurement.update({
        where: {
          measure_uuid: measure_uuid,
        },
        data: {
          has_confirmed: true,
        },
      });
      res.status(200).json({ success: true });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: error.errors,
      });
    }
  }
});

export { router as confirmMeasure };
