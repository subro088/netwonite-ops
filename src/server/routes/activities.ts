import { Router, Response } from 'express';
import { db } from '../db.ts';
import { AuthenticatedRequest, requireAuth } from '../auth.ts';

export const activitiesRouter = Router();

// GET /api/activities - Get recent activity logs
activitiesRouter.get('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const limit = parseInt(req.query.limit as string, 10) || 50;
  const taskId = req.query.taskId as string;

  let logs = db.activities;
  if (taskId) {
    logs = logs.filter(a => a.taskId === taskId);
  }

  const enriched = logs.slice(0, limit).map(log => ({
    ...log,
    actor: db.getUserById(log.actorId) || log.actor,
  }));

  return res.json({ activities: enriched });
});
