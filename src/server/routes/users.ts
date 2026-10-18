import { Router, Response } from 'express';
import { db } from '../db.ts';
import { AuthenticatedRequest, requireAuth, requireAdmin } from '../auth.ts';

export const usersRouter = Router();

// GET /api/users - List all users with team info
usersRouter.get('/', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  const users = db.users.map(u => {
    const { passwordHash, ...rest } = u;
    const teamsLeading = db.getTeamsLeading(u.id);
    const teamsMemberOf = db.getTeamsMemberOf(u.id);
    return {
      ...rest,
      teamsLeading,
      teamsMemberOf,
      isLeader: teamsLeading.length > 0,
      totalTeams: teamsLeading.length + teamsMemberOf.length,
    };
  });
  return res.json({ users });
});

// GET /api/users/:id - Get user profile
usersRouter.get('/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = db.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const teamsLeading = db.getTeamsLeading(user.id);
  const teamsMemberOf = db.getTeamsMemberOf(user.id);
  const assignedTasks = db.tasks.filter(t => t.assigneeId === user.id);
  const createdTasks = db.tasks.filter(t => t.creatorId === user.id);

  return res.json({
    user,
    teamsLeading,
    teamsMemberOf,
    stats: {
      assignedTasksCount: assignedTasks.length,
      createdTasksCount: createdTasks.length,
      completedTasksCount: assignedTasks.filter(t => t.status === 'Resolved' || t.status === 'Closed').length,
    },
  });
});

// PATCH /api/users/:id/avatar - Update user profile vector photo
usersRouter.patch('/:id/avatar', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { avatar } = req.body;
  if (!avatar) {
    return res.status(400).json({ error: 'Avatar vector URL or identifier is required' });
  }
  if (req.user?.id !== req.params.id && req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized to update this user avatar' });
  }
  const updatedUser = db.updateUserAvatar(req.params.id, avatar);
  if (!updatedUser) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { passwordHash, ...safeUser } = updatedUser;
  return res.json({ user: safeUser, message: 'Profile photo vector updated successfully' });
});

// POST /api/users/:id/grant-badge - Admin feature: grant recognition badge to employee
usersRouter.post('/:id/grant-badge', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { title, icon, reason } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Badge title is required.' });
  }
  if (!reason || !reason.trim()) {
    return res.status(400).json({ error: 'Reason for granting recognition is required.' });
  }

  const user = db.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  const updated = db.grantBadge(req.params.id, {
    title: title.trim(),
    icon: icon || '🎖️',
    reason: reason.trim(),
    grantedBy: req.user!.name,
  });

  db.logActivity({
    actorId: req.user!.id,
    actor: req.user!,
    action: 'badge_granted',
    details: `${req.user!.name} awarded badge "${title.trim()}" ${icon || '🎖️'} to ${user.name}: "${reason.trim()}"`,
  });

  return res.json({ user: updated, message: `Recognition badge "${title.trim()}" awarded to ${user.name}!` });
});
