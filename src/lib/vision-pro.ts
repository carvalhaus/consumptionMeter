import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

interface GenerativePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

function fileToGenerativePart(
  image64: string,
  mimeType: string,
): GenerativePart {
  return {
    inlineData: {
      data: image64,
      mimeType,
    },
  };
}

export async function readMeter(
  image64: string,
  mimeType: string | null,
): Promise<any> {
  if (mimeType === null) {
    throw new Error();
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = 'Give me just the numbers from the meter reading';

  const imageParts: GenerativePart[] = [
    fileToGenerativePart(image64, mimeType),
  ];

  const result = await model.generateContent([prompt, ...imageParts]);

  let text: string;
  if (typeof result.response.text === 'function') {
    text = await result.response.text();
  } else if (typeof result.response.text === 'string') {
    text = result.response.text;
  } else {
    throw new Error('Unexpected result format');
  }

  return text;
}
