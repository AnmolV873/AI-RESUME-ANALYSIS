import fs from 'fs/promises';
import { createRequire } from 'module';
import mammoth from 'mammoth';
import { AppError } from '../../middleware/error.middleware.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');


export const extractTextFromFile = async (filePath, mimetype) => {
  const buffer = await fs.readFile(filePath);

  if (mimetype === 'application/pdf') {
    const data = await pdfParse(buffer);

    if (!data.text || data.text.trim().length < 50) {
      throw new AppError('Could not extract text from PDF. The file may be scanned or image-based.', 400);
    }

    return data.text.trim();
  }

  if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer });

    if (!result.value || result.value.trim().length < 50) {
      throw new AppError('Could not extract text from DOCX file.', 400);
    }

    return result.value.trim();
  }

  throw new AppError('Unsupported file type', 400);
};

export const cleanupFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch {
    // File already gone, no action needed
  }
};