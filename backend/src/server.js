import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import roastRoutes from './routes/roastRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { initDatabase } from './config/db.js';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://ai-resume-roaster-jhod.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests without an Origin header
    // such as curl/server-to-server requests.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS: Origin not allowed'));
    }
  },
  credentials: true
}));

const roastLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many roast requests. Please try again later.'
  }
});

app.use('/api/roast', roastLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api', roastRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'AI Resume Roaster API is online',
    endpoints: {
      health: 'GET /api/health',
      roast: 'POST /api/roast',
      listRoasts: 'GET /api/roasts',
      getRoast: 'GET /api/roasts/:id'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start server
async function startServer() {
  try {
    await initDatabase();

    app.listen(PORT, '0.0.0.0', () => {
      console.log('=========================================');
      console.log('Resume Roaster Backend Server Online');
      console.log(`Running on port: ${PORT}`);
      console.log('Health check: /api/health');
      console.log('=========================================');
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

startServer();

export default app;