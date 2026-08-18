import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import roastRoutes from './routes/roastRoutes.js';
import { initDatabase } from './config/db.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Gemini-Key']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API routes
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

// Export for Vercel
export default app;

// Local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;

  initDatabase()
    .then(() => {
      app.listen(PORT, '0.0.0.0', () => {
  console.log(`=========================================`);
  console.log(`Resume Roaster Backend Server Online`);
  console.log(`Running on port: ${PORT}`);
  console.log(`Health check: /api/health`);
  console.log(`=========================================`);
});
    })
    .catch((error) => {
      console.error('Failed to initialize database:', error);
      process.exit(1);
    });
}