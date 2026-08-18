import { z } from 'zod';

const roastSchema = z.object({
  text: z
    .string()
    .trim()
    .max(12000, 'Resume text cannot exceed 12,000 characters')
    .optional()
    .or(z.literal('')),

  intensity: z
    .enum(['mild', 'spicy', 'savage'])
    .default('spicy')
});

export function validateRoastInput(req, res, next) {
  const result = roastSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: result.error.issues[0]?.message || 'Invalid input'
    });
  }

  req.body = result.data;
  next();
}