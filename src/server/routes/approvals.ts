import { Router, Response } from 'express';
import { db } from '../db.ts';
import { AuthenticatedRequest, requireAuth } from '../auth.ts';

export const approvalsRouter = Router();

// GET /api/approvals - List pending approval requests for current leader or admin
approvalsRouter.get('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const isAdmin = user.role === 'admin';

  let list = db.approvals.filter(a => a.status === 'Pending');
  if (!isAdmin) {
    list = list.filter(a => a.recipientLeaderId === user.id);
  }

  const enriched = list.map(a => {
    const task = db.tasks.find(t => t.id === a.taskId) || a.task;
    return {
      ...a,
      task: {
        ...task,
        sourceTeam: db.teams.find(t => t.id === a.sourceTeamId),
        destinationTeam: db.teams.find(t => t.id === a.destinationTeamId),
      },
      sourceTeam: db.teams.find(t => t.id === a.sourceTeamId) || a.sourceTeam,
      destinationTeam: db.teams.find(t => t.id === a.destinationTeamId) || a.destinationTeam,
      requestor: db.getUserById(a.requestorId) || a.requestor,
      recipientLeader: db.getUserById(a.recipientLeaderId) || a.recipientLeader,
    };
  });

  return res.json({ approvals: enriched });
});

// POST /api/approvals/:id/approve-distribute - Receiving leader approves and distributes to team members
approvalsRouter.post('/:id/approve-distribute', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const approval = db.approvals.find(a => a.id === req.params.id);
  if (!approval) {
    return res.status(404).json({ error: 'Approval request not found.' });
  }

  if (approval.status !== 'Pending') {
    return res.status(400).json({ error: `This request has already been ${approval.status.toLowerCase()}.` });
  }

  if (approval.recipientLeaderId !== user.id && user.role !== 'admin') {
    return res.status(403).json({ error: 'Only the receiving team leader can approve and distribute this request.' });
  }

  const destTeam = db.teams.find(t => t.id === approval.destinationTeamId);
  if (!destTeam) {
    return res.status(400).json({ error: 'Destination team does not exist.' });
  }

  const task = db.tasks.find(t => t.id === approval.taskId);
  if (!task) {
    return res.status(404).json({ error: 'Associated task not found.' });
  }

  approval.status = 'Approved';
  approval.respondedAt = new Date().toISOString();

  task.status = 'New';
  task.destinationTeamId = destTeam.id;
  task.updatedAt = new Date().toISOString();

  db.logActivity({
    taskId: task.id,
    taskTitle: task.title,
    actorId: user.id,
    actor: user,
    action: 'cross_team_approved',
    details: `${user.name} (Leader of ${destTeam.name}) approved the cross-team assignment from ${approval.sourceTeam.name} and distributed it to members of ${destTeam.name} to claim.`,
    sourceTeamName: approval.sourceTeam.name,
    destinationTeamName: destTeam.name,
  });

  return res.json({
    message: `Task successfully approved and distributed to members of "${destTeam.name}".`,
    approval,
    task,
  });
});

// POST /api/approvals/:id/reject - Receiving leader rejects request with reason
approvalsRouter.post('/:id/reject', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { reason } = req.body;
  const approval = db.approvals.find(a => a.id === req.params.id);
  if (!approval) {
    return res.status(404).json({ error: 'Approval request not found.' });
  }

  if (approval.status !== 'Pending') {
    return res.status(400).json({ error: `This request has already been ${approval.status.toLowerCase()}.` });
  }

  if (approval.recipientLeaderId !== user.id && user.role !== 'admin') {
    return res.status(403).json({ error: 'Only the receiving team leader can reject this request.' });
  }

  if (!reason || typeof reason !== 'string' || !reason.trim()) {
    return res.status(400).json({ error: 'A rejection reason is required.' });
  }

  const rejectionReason = reason.trim();
  approval.status = 'Rejected';
  approval.rejectionReason = rejectionReason;
  approval.respondedAt = new Date().toISOString();

  const task = db.tasks.find(t => t.id === approval.taskId);
  if (task) {
    task.status = 'Closed';
    task.reviewNotes = `Cross-team request rejected: ${rejectionReason}`;
    task.updatedAt = new Date().toISOString();
  }

  db.logActivity({
    taskId: approval.taskId,
    taskTitle: task?.title || 'Cross-Team Task',
    actorId: user.id,
    actor: user,
    action: 'cross_team_rejected',
    details: `${user.name} rejected cross-team assignment from "${approval.sourceTeam.name}": "${rejectionReason}".`,
    sourceTeamName: approval.sourceTeam.name,
    destinationTeamName: approval.destinationTeam.name,
  });

  return res.json({
    message: 'Cross-team request rejected.',
    approval,
  });
});
