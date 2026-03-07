import { z } from 'zod';
import {
  createJobDescription,
  getUserJobs,
  getJobById,
  updateJob,
  deleteJob,
} from './jobdescription.services.js';
import { AppError } from '../../middleware/error.middleware.js';

const jobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(50, 'Job description content must be at least 50 characters'),
});

const updateJobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').optional(),
  content: z.string().min(50, 'Job description content must be at least 50 characters').optional(),
});

export const create = async (req, res, next) => {
  try {
    const parsed = jobSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(parsed.error.errors[0].message, 400));
    }

    const job = await createJobDescription({
      userId: req.user.id,
      ...parsed.data,
    });

    res.status(201).json({
      success: true,
      message: 'Job description created successfully',
      job,
    });
  } catch (err) {
    next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const jobs = await getUserJobs(req.user.id);

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const job = await getJobById(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      job,
    });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const parsed = updateJobSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(parsed.error.errors[0].message, 400));
    }

    if (!parsed.data.title && !parsed.data.content) {
      return next(new AppError('Provide at least title or content to update', 400));
    }

    const job = await updateJob(req.params.id, req.user.id, parsed.data);

    res.status(200).json({
      success: true,
      message: 'Job description updated successfully',
      job,
    });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await deleteJob(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Job description deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};