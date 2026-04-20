import jwt from 'jsonwebtoken';
import { JwtPayload, RefreshTokenPayload } from '../types/authTypes';
import { env } from '../config/env';
import { UnauthorizedError } from './AppError';

export const generateAccessToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
}

export const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
}

export const verifyAccessToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch (err) {
        console.error(err);
        throw new UnauthorizedError('Token invalido o expirado');
    }
}

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
    try {
        return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
    } catch (err) {
        console.error(err);
        throw new UnauthorizedError('Refresh token invalido o expirado');
    }
}