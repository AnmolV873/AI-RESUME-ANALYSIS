import { prisma } from '../../config/db.js';
import { AppError } from '../../middleware/error.middleware.js';

export const createJobDescription = async ({ userId, title, content }) => {
  const job = await prisma.jobDescription.create({
    data: {
      userId,
      title,
      content,
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });

  return job;
};

export const getUserJobs = async (userId) => {
  return prisma.jobDescription.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getJobById = async (jobId, userId) => {
  const job = await prisma.jobDescription.findFirst({
    where: {
      id: jobId,
      userId,
    },
  });

  if (!job) {
    throw new AppError('Job description not found', 404);
  }

  return job;
};

export const updateJob = async (jobId, userId, { title, content }) => {
  // First check it exists and belongs to this user
  await getJobById(jobId, userId);

  return prisma.jobDescription.update({
    where: { id: jobId },
    data: { title, content },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });
};

export const deleteJob = async (jobId, userId) => {
  // First check it exists and belongs to this user
  await getJobById(jobId, userId);

  await prisma.jobDescription.delete({
    where: { id: jobId },
  });
};