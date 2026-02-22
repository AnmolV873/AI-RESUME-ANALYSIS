import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  MAX_FILE_SIZE_MB: z.string().default('5'),

  RESUME_STRONG_THRESHOLD: z.string().default('75'),
  JD_MATCH_STRONG_THRESHOLD: z.string().default('70'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
//   console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  NODE_ENV: parsed.data.NODE_ENV,
  PORT: parseInt(parsed.data.PORT, 10),
  isDev: parsed.data.NODE_ENV === 'development',

  DATABASE_URL: parsed.data.DATABASE_URL,

  JWT_SECRET: parsed.data.JWT_SECRET,
  JWT_EXPIRES_IN: parsed.data.JWT_EXPIRES_IN,

  MAX_FILE_SIZE_MB: parseInt(parsed.data.MAX_FILE_SIZE_MB, 10),

  RESUME_STRONG_THRESHOLD: parseInt(parsed.data.RESUME_STRONG_THRESHOLD, 10),
  JD_MATCH_STRONG_THRESHOLD: parseInt(parsed.data.JD_MATCH_STRONG_THRESHOLD, 10),
};