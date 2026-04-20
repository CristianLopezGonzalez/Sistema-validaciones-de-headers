import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { UnauthorizedError } from '../utils/AppError';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Extraer token del header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1] as string;

    // 2. Verificar token
    const payload = verifyAccessToken(token);

    // 3. Agregar usuario al request
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    next(new UnauthorizedError('Invalid token'));
  }
};
