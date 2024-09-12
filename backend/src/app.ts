import express from 'express';
import cors from 'cors';

import { uploadImage } from './routes/uploadImage';
import { confirmMeasure } from './routes/confirmMeasure';
import { getCustomerCodeList } from './routes/getCustomerCodeList';
import { getTemporaryPage } from './routes/getTemporaryPage';

const app = express();
const PORT = 3000;
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(express.json({ limit: '100mb' }));

app.use(uploadImage);
app.use(confirmMeasure);
app.use(getCustomerCodeList);
app.use(getTemporaryPage);

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
