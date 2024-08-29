"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemporaryPage = void 0;
const express_1 = require("express");
const tokens_1 = require("../lib/tokens");
const prisma_1 = require("../lib/prisma");
const getImageMimeTypeFromBase64_1 = require("../lib/getImageMimeTypeFromBase64");
const router = (0, express_1.Router)();
exports.getTemporaryPage = router;
router.get('/view-temp-page/:token', async (req, res) => {
    const token = req.params.token;
    const expirationTime = tokens_1.tokens.get(token);
    const imageBase64 = await prisma_1.prisma.measurement.findUnique({
        where: {
            measure_uuid: token,
        },
        select: {
            image: true,
        },
    });
    const mimeType = (imageBase64 === null || imageBase64 === void 0 ? void 0 : imageBase64.image)
        ? (0, getImageMimeTypeFromBase64_1.getImageMimeTypeFromBase64)(imageBase64.image)
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
          <img src="data:${mimeType};base64, ${imageBase64 === null || imageBase64 === void 0 ? void 0 : imageBase64.image}"/>
        </body>
        </html>
      `;
        res.send(htmlContent);
    }
    else {
        res.status(404).send('Link expirado ou inválido');
    }
});
