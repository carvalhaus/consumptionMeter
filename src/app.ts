import express from 'express';
import cors from 'cors';

import { uploadImage } from './routes/uploadImage';
import bodyParser from 'body-parser';
import { confirmMeasure } from './routes/confirmMeasure';

const app = express();
const PORT = 3000;
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(express.json({ limit: '100mb' }));

app.use(uploadImage);
app.use(confirmMeasure);

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
