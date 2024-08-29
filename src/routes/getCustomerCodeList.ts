import { Request, Response, Router } from 'express';
import { prisma } from '../lib/prisma';
import { ZodError } from 'zod';
import {
  customerCodeSchema,
  measureTypeSchema,
} from '../schemas/applicationSchemas';

const router = Router();

router.get('/:customer_code/list', async (req: Request, res: Response) => {
  try {
    const parsedParams = customerCodeSchema.parse(req.params);
    const parsedQuery = measureTypeSchema.parse(req.query);

    const { customer_code } = parsedParams;
    const { measure_type } = parsedQuery;

    if (measure_type && !['WATER', 'GAS'].includes(measure_type)) {
      res.status(400).json({
        error_code: 'INVALID_TYPE',
        error_description: 'Tipo de medição não permitida',
      });
    }

    if (measure_type) {
      const measurementExists = await prisma.measurement.findFirst({
        where: {
          customer_code: customer_code as string,
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

    const customerCode = await prisma.customer.findUnique({
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
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error_code: 'INVALID_TYPE',
        error_description: 'Tipo de medição não permitida',
      });
    }
  }
});

export { router as getCustomerCodeList };
