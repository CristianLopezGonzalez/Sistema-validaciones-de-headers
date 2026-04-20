import { Request, Response } from 'express';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { authService } from '../services/authService';
import { HttpResponse } from '../middlewares/httpResponse';

const http = new HttpResponse();

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const user = await authService.register(email, password, name);

  const accessToken = generateAccessToken({ userId: user.id, role: user.role, email: user.email });
  const refreshToken = generateRefreshToken(user.id);

  return http.Created(res, {
    user,
    accessToken,
    refreshToken,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await authService.loginUser(email, password);

  const accessToken = generateAccessToken({ userId: user.id, role: user.role, email: user.email });
  const refreshToken = generateRefreshToken(user.id);

  return http.OK(res, {
    user,
    accessToken,
    refreshToken,
  });
};

export const getProfile = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const user = await authService.getUserById(userId);
  return http.OK(res, { user });
};
