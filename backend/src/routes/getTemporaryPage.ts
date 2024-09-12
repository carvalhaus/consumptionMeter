import { Request, Response, Router } from 'express';
import { tokens } from '../lib/tokens';
import { prisma } from '../lib/prisma';
import { getImageMimeTypeFromBase64 } from '../lib/getImageMimeTypeFromBase64';

const router = Router();

router.get('/view-temp-page/:token', async (req: Request, res: Response) => {
  const token = req.params.token;
  const expirationTime = tokens.get(token);

  const imageBase64 = await prisma.measurement.findUnique({
    where: {
      measure_uuid: token,
    },
    select: {
      image: true,
    },
  });

  const mimeType = imageBase64?.image
    ? getImageMimeTypeFromBase64(imageBase64.image)
    : null;

  if (expirationTime && parseInt(expirationTime) > Date.now()) {
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Página Temporária</title>
        </head>
        <body>
        <h1>Imagem Temporária</h1>
          <img src="data:${mimeType};base64, ${imageBase64?.image}"/>
        </body>
        </html>
      `;

    res.send(htmlContent);
  } else {
    res.status(404).send('Link expirado ou inválido');
  }
});

export { router as getTemporaryPage };
