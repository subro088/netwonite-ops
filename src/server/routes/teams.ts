import { Router, Response } from 'express';
import { db } from '../db.ts';
import { AuthenticatedRequest, requireAuth, requireAdmin } from '../auth.ts';
import { Team } from '../../types/index.ts';

export const teamsRouter = Router();

// GET /api/teams - List all teams with lead and members and stats
teamsRouter.get('/', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  const teams = db.teams.map(t => db.enrichTeam(t));
  return res.json({ teams });
});

// GET /api/teams/:id - Get team details with its tasks
teamsRouter.get('/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const team = db.teams.find(t => t.id === req.params.id);
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }
  const enriched = db.enrichTeam(team);
  const tasks = db.tasks.filter(t => t.sourceTeamId === team.id || t.destinationTeamId === team.id);
  return res.json({
    team: enriched,
    tasks,
  });
});

// POST /api/teams - Admin only: Create a team
teamsRouter.post('/', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, leadId, memberIds } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Team name is required.' });
    }
    if (!description || typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({ error: 'Team description is required.' });
    }
    if (!leadId) {
      return res.status(400).json({ error: 'A team leader must be selected.' });
    }

    const leadUser = db.getUserById(leadId);
    if (!leadUser) {
      return res.status(400).json({ error: 'Selected team lead does not exist.' });
    }

    if (!Array.isArray(memberIds)) {
      return res.status(400).json({ error: 'Member IDs must be an array.' });
    }

    const validMemberIds = memberIds.filter(id => id !== leadId && !!db.getUserById(id));

    const newTeam: Team = {
      id: `team-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      description: description.trim(),
      leadId,
      lead: leadUser,
      memberIds: validMemberIds,
      members: validMemberIds.map(id => db.getUserById(id)!),
      createdAt: new Date().toISOString(),
    };

    db.teams.push(newTeam);

    // Record activity
    db.logActivity({
      actorId: req.user!.id,
      actor: req.user!,
      action: 'team_created',
      details: `Created team "${newTeam.name}" and appointed ${leadUser.name} as Team Lead with ${validMemberIds.length} members.`,
    });

    const enriched = db.enrichTeam(newTeam);
    return res.status(201).json({ team: enriched });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to create team' });
  }
});

// DELETE /api/teams/:id - Admin only: Delete a team safely
teamsRouter.delete('/:id', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const teamIndex = db.teams.findIndex(t => t.id === req.params.id);
  if (teamIndex === -1) {
    return res.status(404).json({ error: 'Team not found' });
  }

  const teamToDelete = db.teams[teamIndex];
  db.teams.splice(teamIndex, 1);

  // Safely archive or unlink associated tasks
  db.tasks = db.tasks.map(t => {
    if (t.sourceTeamId === teamToDelete.id) {
      return { ...t, status: 'Closed', reviewNotes: 'Team was disbanded by Administrator.' };
    }
    return t;
  });

  // Clean pending approvals for this team
  db.approvals = db.approvals.filter(a => a.sourceTeamId !== teamToDelete.id && a.destinationTeamId !== teamToDelete.id);

  // Log activity
  db.logActivity({
    actorId: req.user!.id,
    actor: req.user!,
    action: 'team_deleted',
    details: `Deleted team "${teamToDelete.name}". Associated active tasks were safely closed.`,
  });

  return res.json({ message: `Team "${teamToDelete.name}" deleted successfully.` });
});
