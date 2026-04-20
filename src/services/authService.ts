import { prisma } from '../config/database';
import { BadRequestError, UnauthorizedError, NotFoundError } from '../utils/AppError';
import { hashPassword, comparePassword } from '../utils/password';

export class AuthService {
    async register(email: string, password: string, name: string) {
        try {
            const user = await prisma.user.findUnique({ where: { email } });

            if (user) {
                throw new BadRequestError('Email is already registered');
            }

            const passwordHash = await hashPassword(password);

            const newUser = await prisma.user.create({
                data: { email, password: passwordHash, name },
                select: { id: true, email: true, name: true, role: true },
            });

            return newUser;
        } catch (error) {
            if (error instanceof Error) throw error;
            throw new BadRequestError('Unexpected error');
        }
    }

    async getUserById(userId: string) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { id: true, email: true, name: true, role: true },
            });

            if (!user) {
                throw new NotFoundError('User not found');
            }

            return user;
        } catch (error) {
            if (error instanceof Error) throw error;
            throw new BadRequestError('Unexpected error');
        }
    }

    async loginUser(email: string, password: string) {
        try {
            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                throw new UnauthorizedError('Invalid email or password');
            }

            await prisma.user.update({ data: { lastLogin: new Date() }, where: { id: user.id } });

            const isPasswordValid = await comparePassword(password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedError('Invalid email or password');
            }

            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            if (error instanceof Error) throw error;
            throw new BadRequestError('Unexpected error');
        }
    }
}

export const authService = new AuthService();
