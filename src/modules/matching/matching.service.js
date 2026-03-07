import { prisma } from '../../config/db.js';
import { AppError } from '../../middleware/error.middleware.js';
import { callSarvamJSON } from '../../ai/sarvam.js';
import { MATCH_SYSTEM_PROMPT, buildMatchUserMessage } from '../../ai/prompts/match.prompt.js';

export const matchResumeToJob = async ({ userId, resumeId, jobId }) => {
  // Fetch resume — must belong to this user
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
  });
  if (!resume) throw new AppError('Resume not found', 404);

  // Fetch job — must belong to this user
  const job = await prisma.jobDescription.findFirst({
    where: { id: jobId, userId },
  });
  if (!job) throw new AppError('Job description not found', 404);

  // Build message and call AI
  const userMessage = buildMatchUserMessage(resume.parsedText, job.content);
  const aiResult = await callSarvamJSON(MATCH_SYSTEM_PROMPT, userMessage);

  // Validate AI returned what we expect
  const atsScore = Number(aiResult.ats_score);
  if (isNaN(atsScore) || atsScore < 0 || atsScore > 100) {
    throw new AppError('AI returned an invalid ATS score', 502);
  }

  // Save match result to DB
  const match = await prisma.match.create({
    data: {
      resumeId,
      jobId,
      score: atsScore,
      feedback: JSON.stringify({
        skills_match_percentage: aiResult.skills_match_percentage,
        matched_skills: aiResult.matched_skills,
        missing_keywords: aiResult.missing_keywords,
        suggestions: aiResult.suggestions,
        summary: aiResult.summary,
      }),
    },
  });

  return {
    matchId: match.id,
    ats_score: atsScore,
    skills_match_percentage: aiResult.skills_match_percentage,
    matched_skills: aiResult.matched_skills,
    missing_keywords: aiResult.missing_keywords,
    suggestions: aiResult.suggestions,
    summary: aiResult.summary,
    resume_name: resume.originalName,
    job_title: job.title,
    createdAt: match.createdAt,
  };
};

export const getMatchHistory = async (userId) => {
  const matches = await prisma.match.findMany({
    where: {
      resume: { userId },
    },
    include: {
      resume: { select: { originalName: true } },
      job: { select: { title: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return matches.map((m) => ({
    matchId: m.id,
    ats_score: m.score,
    resume_name: m.resume.originalName,
    job_title: m.job.title,
    createdAt: m.createdAt,
    feedback: JSON.parse(m.feedback || '{}'),
  }));
};

export const getMatchById = async (matchId, userId) => {
  const match = await prisma.match.findFirst({
    where: {
      id: matchId,
      resume: { userId },
    },
    include: {
      resume: { select: { originalName: true } },
      job: { select: { title: true } },
    },
  });

  if (!match) throw new AppError('Match not found', 404);

  return {
    matchId: match.id,
    ats_score: match.score,
    resume_name: match.resume.originalName,
    job_title: match.job.title,
    createdAt: match.createdAt,
    feedback: JSON.parse(match.feedback || '{}'),
  };
};