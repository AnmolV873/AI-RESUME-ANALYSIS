import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/db.js';
import { AppError } from './error.middleware.js';

export const protect = async (req, res, next) => {
  try {
    // 1. Check token exists in header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('You are not logged in. Please login to continue.', 401));
    }

    // 2. Extract and verify token
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // 3. Check user still exists in DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, isverified: true },
    });

    if (!user) {
      return next(new AppError('User no longer exists.', 401));
    }

    // 4. Attach user to request so controllers can access it
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};