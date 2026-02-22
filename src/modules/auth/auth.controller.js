import { registerUser, loginUser } from './auth.service.js';
import { registerSchema, loginSchema } from './auth.schema.js';
import { AppError } from '../../middleware/error.middleware.js';

export const register = async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      const message = parsed.error.issues[0].message;
      return next(new AppError(message, 400));
    }

    const { user, token } = await registerUser(parsed.data);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      const message = parsed.error.errors[0].message;
      return next(new AppError(message, 400));
    }

    const { user, token } = await loginUser(parsed.data);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
};