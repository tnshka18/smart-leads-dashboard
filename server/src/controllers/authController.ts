import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { RegisterDto, LoginDto, JwtPayload, UserRole, AuthenticatedRequest } from '../types';
import { AppError } from '../middleware/errorHandler';

// ─── Helper: Generate JWT ─────────────────────────────────────────────────────

const generateToken = (userId: string, role: UserRole): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AppError('JWT_SECRET not configured', 500);

  const payload: Omit<JwtPayload, 'iat' | 'exp'> = { userId, role };
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  } as jwt.SignOptions);
};

// ─── Register ─────────────────────────────────────────────────────────────────

export const register = async (
  req: Request<object, object, RegisterDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role ?? UserRole.SALES,
    });

    const token = generateToken(user._id.toString(), user.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────

export const login = async (
  req: Request<object, object, LoginDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Explicitly select password (excluded by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken(user._id.toString(), user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get Current User ─────────────────────────────────────────────────────────

export const getMe = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Not authenticated', 401);

    const user = await User.findById(req.user.userId);
    if (!user) throw new AppError('User not found', 404);

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
