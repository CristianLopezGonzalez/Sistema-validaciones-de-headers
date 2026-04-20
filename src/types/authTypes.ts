import { Role } from "../../generated/prisma/client";

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number; // issued at
  exp?: number; // expiration
}

export interface RefreshTokenPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

declare module "express-serve-static-core" {
    interface Request {
        user?: {
            userId: string;
            email: string;
            role: Role;
        }
    }
}