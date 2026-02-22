import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Please provide a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  phone: z
    .string()
    .min(10, 'Phone must be at least 10 digits')
    .regex(/^\+?[0-9]+$/, 'Phone must contain only numbers'),
});

export const loginSchema = z.object({
  email: z.email('Please provide a valid email'),
  password: z.string().min(1, 'Password is required'),
});