import { Router, Response } from 'express';
import { db } from '../db.ts';
import { AuthenticatedRequest, requireAuth } from '../auth.ts';

export const rejectionsRouter = Router();

// GET /api/rejections - View all rejected cross-team requests and rejected review submissions
rejectionsRouter.get('/', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  const rejectedApprovals = db.approvals
    .filter(a => a.status === 'Rejected')
    .map(a => {
      const task = db.tasks.find(t => t.id === a.taskId) || a.task;
      return {
        id: a.id,
        type: 'cross_team',
        taskId: a.taskId,
        taskTitle: task.title,
        sourceTeam: db.teams.find(t => t.id === a.sourceTeamId)?.name || 'Unknown Team',
        destinationTeam: db.teams.find(t => t.id === a.destinationTeamId)?.name || 'Unknown Team',
        requestorName: db.getUserById(a.requestorId)?.name || 'Unknown User',
        rejectorName: db.getUserById(a.recipientLeaderId)?.name || 'Unknown Leader',
        reason: a.rejectionReason || 'No reason specified',
        timestamp: a.respondedAt || a.createdAt,
      };
    });

  const changesRequested = db.activities
    .filter(act => act.action === 'changes_requested')
    .map(act => ({
      id: act.id,
      type: 'review_feedback',
      taskId: act.taskId || '',
      taskTitle: act.taskTitle || 'Task',
      sourceTeam: act.sourceTeamName || 'Team',
      destinationTeam: act.destinationTeamName || '',
      requestorName: 'Assignee',
      rejectorName: act.actor.name,
      reason: act.details,
      timestamp: act.createdAt,
    }));

  const allRejections = [...rejectedApprovals, ...changesRequested].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return res.json({ rejections: allRejections });
});
