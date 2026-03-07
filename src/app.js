import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { globalErrorHandler, notFoundHandler } from './middleware/error.middleware.js';
import authRoutes from './modules/auth/auth.route.js';
import resumeRoute from './modules/resume/resume.route.js';
import jobRoutes from './modules/job-description/jobdescription.route.js';
import matchRoute from './modules/matching/matching.route.js';

const app = express();

// Security headers
app.use(helmet());
// Request logging - only in development
app.use(morgan('dev'));
// Parse incoming JSON
app.use(express.json());
// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoute);
app.use('/api/jobs', jobRoutes);
app.use('/api/matches', matchRoute);

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(globalErrorHandler);

export default app;
