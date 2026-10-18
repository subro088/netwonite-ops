import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { authMiddleware } from './src/server/auth.ts';
import { authRouter } from './src/server/routes/auth.ts';
import { teamsRouter } from './src/server/routes/teams.ts';
import { usersRouter } from './src/server/routes/users.ts';
import { tasksRouter } from './src/server/routes/tasks.ts';
import { approvalsRouter } from './src/server/routes/approvals.ts';
import { rejectionsRouter } from './src/server/routes/rejections.ts';
import { activitiesRouter } from './src/server/routes/activities.ts';
import { seedRouter } from './src/server/routes/seed.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(cors());
app.use(express.json());
app.use(authMiddleware);

// API routes
app.use('/api/auth', authRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/users', usersRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/approvals', approvalsRouter);
app.use('/api/rejections', rejectionsRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/seed', seedRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Netwonite] Server listening on http://0.0.0.0:${PORT}`);
  });
}

// Only start when run directly (not in tests)
if (process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
  startServer();
}
