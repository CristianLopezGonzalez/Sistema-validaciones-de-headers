import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

// Verifica que existan
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined');
}

if (!process.env.JWT_REFRESH_SECRET) {
  throw new Error('JWT_REFRESH_SECRET must be defined');
}

if (!process.env.JWT_EXPIRES_IN) {
  throw new Error('JWT_EXPIRES_IN must be defined');
}

if (!process.env.JWT_REFRESH_EXPIRES_IN) {
  throw new Error('JWT_REFRESH_EXPIRES_IN must be defined');
}

if (!process.env.NODE_ENV) {
  throw new Error('NODE_ENV must be defined');
}

if (!process.env.PORT) {
  throw new Error('PORT must be defined');
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be defined');
}

export const env = {
  NODE_ENV: process.env.NODE_ENV! as string,
  PORT: Number(process.env.PORT) as number,
  DATABASE_URL: process.env.DATABASE_URL! as string,
  JWT_SECRET: process.env.JWT_SECRET! as string,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN! as jwt.SignOptions['expiresIn'],
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET! as string,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN! as jwt.SignOptions['expiresIn'],
};

for (const [key, value] of Object.entries(env)) {
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
}

export default env as {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_SECRET: string;
};
