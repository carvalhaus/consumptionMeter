"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readMeter = readMeter;
const dotenv_1 = __importDefault(require("dotenv"));
const generative_ai_1 = require("@google/generative-ai");
dotenv_1.default.config();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
function fileToGenerativePart(image64, mimeType) {
    return {
        inlineData: {
            data: image64,
            mimeType,
        },
    };
}
async function readMeter(image64, mimeType) {
    if (mimeType === null) {
        throw new Error();
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = 'Give me just the numbers from the meter reading';
    const imageParts = [
        fileToGenerativePart(image64, mimeType),
    ];
    const result = await model.generateContent([prompt, ...imageParts]);
    let text;
    if (typeof result.response.text === 'function') {
        text = await result.response.text();
    }
    else if (typeof result.response.text === 'string') {
        text = result.response.text;
    }
    else {
        throw new Error('Unexpected result format');
    }
    return text;
}
