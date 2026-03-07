import { z } from 'zod';
import { matchResumeToJob, getMatchHistory, getMatchById } from './matching.service.js';
import { AppError } from '../../middleware/error.middleware.js';

const matchSchema = z.object({
  resumeId: z.string().min(1, 'resumeId is required'),
  jobId: z.string().min(1, 'jobId is required'),
});

export const createMatch = async (req, res, next) => {
  try {
    const parsed = matchSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(parsed.error.errors[0].message, 400));
    }

    const result = await matchResumeToJob({
      userId: req.user.id,
      resumeId: parsed.data.resumeId,
      jobId: parsed.data.jobId,
    });

    res.status(201).json({
      success: true,
      message: 'Match analysis complete',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const matches = await getMatchHistory(req.user.id);
    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches,
    });
  } catch (err) {
    next(err);
  }
};

export const getMatch = async (req, res, next) => {
  try {
    const match = await getMatchById(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: match });
  } catch (err) {
    next(err);
  }
};