import { uploadResume, getUserResumes, getResumeById } from './resume.service.js';

export const upload = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('Please upload a file', 400));
    }

    const resume = await uploadResume({
      userId: req.user.id,
      file: req.file,
    });

    res.status(201).json({
      success: true,
      message: 'Resume uploaded and parsed successfully',
      resume,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyResumes = async (req, res, next) => {
  try {
    const resumes = await getUserResumes(req.user.id);

    res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (err) {
    next(err);
  }
};

export const getResume = async (req, res, next) => {
  try {
    const resume = await getResumeById(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (err) {
    next(err);
  }
};