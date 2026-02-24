import { prisma } from '../../config/db.js';
import { extractTextFromFile, cleanupFile } from './resume.parser.js';
import { AppError } from '../../middleware/error.middleware.js';

export const uploadResume = async ({ userId, file }) => {
  let parsedText;

  try {
    parsedText = await extractTextFromFile(file.path, file.mimetype);
  } catch (err) {
    await cleanupFile(file.path);
    throw err;
  }

  const resume = await prisma.resume.create({
    data: {
      userId,
      originalName: file.originalname,
      parsedText,
    },
    select: {
      id: true,
      originalName: true,
      sector: true,
      createdAt: true,
    },
  });

  // Delete temp file after successful DB save
  await cleanupFile(file.path);

  return resume;
};

export const getUserResumes = async (userId) => {
  return prisma.resume.findMany({
    where: { userId },
    select: {
      id: true,
      originalName: true,
      sector: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getResumeById = async (resumeId, userId) => {
  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId,
    },
  });

  if (!resume) {
    throw new AppError('Resume not found', 404);
  }

  return resume;
};