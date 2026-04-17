import { z } from 'zod';

export const registerSchema = z.object({
  roll_number: z.string().min(1, 'Roll number is required'),
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['student', 'faculty']).optional().default('student'),
  department: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const sessionSchema = z.object({
  mentor_id: z.number().int().positive('Invalid mentor ID'),
  skill_id: z.number().int().positive('Invalid skill ID'),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  scheduled_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
});

export const reviewSchema = z.object({
  session_id: z.number().int().positive('Invalid session ID'),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export const userSkillSchema = z.object({
  skill_id: z.number().int().positive('Invalid skill ID'),
  proficiency_level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  years_of_experience: z.number().min(0).max(50),
});

export const validate = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: error.errors.map((e) => e.message).join(', '),
        });
      }
      next(error);
    }
  };
};
