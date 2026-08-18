import rateLimit from 'express-rate-limit';

export const roastLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    error: 'Too many roast requests. Please try again in a minute.'
  }
});