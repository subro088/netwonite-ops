import { Router, Response } from 'express';
import { db } from '../db.ts';
import { AuthenticatedRequest, requireAuth } from '../auth.ts';

export const seedRouter = Router();

// POST /api/seed/reset - Reset demo database to initial pristine state
seedRouter.post('/reset', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  db.seed();
  db.logActivity({
    actorId: req.user!.id,
    actor: req.user!,
    action: 'status_changed',
    details: `${req.user!.name} re-seeded the demo workspace to pristine initial state.`,
  });
  return res.json({
    message: 'Workspace successfully reset to pristine demo state with 20 demo employees, admin, and demo teams.',
  });
});
