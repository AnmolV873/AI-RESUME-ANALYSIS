import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/db.js';
import { env } from '../../config/env.js';
import { AppError } from '../../middleware/error.middleware.js';

const signToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

export const registerUser = async ({ name, email, password, phone }) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser && existingUser.isVerified) {
    throw new AppError('Email already registered. Please login.', 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create or update user
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      password: hashedPassword,
      phone,
      isverified: true,
    },
    create: {
      name,
      email,
      password: hashedPassword,
      phone,
      isverified: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      isverified: true,
      createdAt: true,
    },
  });

  const token = signToken(user.id);

  return { user, token };
};

export const loginUser = async ({ email, password }) => {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // User doesn't exist at all
  if (!user) {
    throw new AppError('No account found with this email. Please register first.', 404);
  }

  // User exists but never completed registration
  if (!user.isverified) {
    throw new AppError('Please complete your registration first.', 403);
  }

  // Check password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new AppError('Incorrect email or password', 401);
  }

  const token = signToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
    token,
  };
};