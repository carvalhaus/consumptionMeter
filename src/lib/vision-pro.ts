import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';

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

export async function readMeter(image64: string): Promise<any> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const prompt = 'Give me just the numbers from the meter reading';

  const imageParts: GenerativePart[] = [
    fileToGenerativePart(image64, 'image/webp'),
  ];

  const result = await model.generateContent([prompt, ...imageParts]);

  let text: string;
  if (typeof result.response.text === 'function') {
    text = await result.response.text(); // Await if it's a function
  } else if (typeof result.response.text === 'string') {
    text = result.response.text; // Directly use if it's a string
  } else {
    throw new Error('Unexpected result format');
  }

  return text;
}
