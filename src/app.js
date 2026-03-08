import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { globalErrorHandler, notFoundHandler } from './middleware/error.middleware.js';
import authRoutes from './modules/auth/auth.route.js';
import resumeRoutes from './modules/resume/resume.route.js';
import jobRoutes from './modules/job-description/jobdescription.route.js';
import matchRoutes from './modules/matching/matching.route.js';

const app = express();

// CORS must be the FIRST middleware
// It tells the browser "yes, requests from localhost:5173 are allowed"
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/match', matchRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;