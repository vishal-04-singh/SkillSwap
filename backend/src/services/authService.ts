import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';

const prisma = new PrismaClient();

export class AuthService {
  async register(input: any) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: input.email }, { roll_number: input.roll_number }],
      },
    });

    if (existingUser) {
      throw new Error('User with this email or roll number already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, config.bcryptRounds);

    const user = await prisma.user.create({
      data: {
        roll_number: input.roll_number,
        full_name: input.full_name,
        email: input.email,
        password_hash: passwordHash,
        role: input.role || 'student',
        department: input.department,
      },
    });

    const token = this.generateToken(user.id, user.email, user.role);

    const { password_hash, ...userWithoutPassword } = user;

    return { user: { ...userWithoutPassword, user_id: user.id }, token };
  }

  async login(input: any) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(input.password, user.password_hash);

    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user.id, user.email, user.role);

    const { password_hash, ...userWithoutPassword } = user;

    return { user: { ...userWithoutPassword, user_id: user.id }, token };
  }

  private generateToken(userId: string, email: string, role: string): string {
    const payload = { userId, email, role };
    const options: SignOptions = { expiresIn: '7d' };
    return jwt.sign(payload, config.jwtSecret, options);
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const { password_hash, ...userWithoutPassword } = user;

    return { ...userWithoutPassword, user_id: user.id };
  }

  async updateProfile(userId: string, data: { full_name?: string; department?: string; bio?: string }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        full_name: data.full_name,
        department: data.department,
        bio: data.bio,
      },
    });

    const { password_hash, ...userWithoutPassword } = user;

    return { ...userWithoutPassword, user_id: user.id };
  }
}

export const authService = new AuthService();
