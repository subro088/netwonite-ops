import { Router, Response } from 'express';
import { db } from '../db.ts';
import { AuthenticatedRequest, requireAuth } from '../auth.ts';
import { Task, TaskPriority, TaskStatus, AssignmentMethod, ApprovalRequest } from '../../types/index.ts';

export const tasksRouter = Router();

// Helper to enrich a task with current team and user references
function enrichTask(task: Task): Task {
  return {
    ...task,
    creator: db.getUserById(task.creatorId)!,
    assignee: task.assigneeId ? db.getUserById(task.assigneeId) || null : null,
    sourceTeam: db.teams.find(t => t.id === task.sourceTeamId),
    destinationTeam: task.destinationTeamId ? db.teams.find(t => t.id === task.destinationTeamId) || null : null,
  };
}

// GET /api/tasks - Query with filters, pagination, search
tasksRouter.get('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const filter = (req.query.filter as string) || 'all';
  const priority = req.query.priority as string;
  const status = req.query.status as string;
  const teamId = req.query.teamId as string;
  const search = ((req.query.search as string) || '').toLowerCase().trim();
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  let results = db.tasks.map(t => enrichTask(t));

  // Role and view filters
  if (filter === 'assigned_to_me') {
    results = results.filter(t => t.assigneeId === user.id);
  } else if (filter === 'priority') {
    results = results.filter(t => t.priority === 'High' || t.priority === 'Urgent');
  } else if (filter === 'awaiting_approval') {
    results = results.filter(t => t.status === 'Awaiting Approval');
  } else if (filter === 'ongoing') {
    results = results.filter(t => ['New', 'Assigned', 'In Progress', 'Awaiting Approval'].includes(t.status));
  } else if (filter === 'completed') {
    results = results.filter(t => ['Resolved', 'Closed'].includes(t.status));
  }

  // Team filter
  if (teamId) {
    results = results.filter(t => t.sourceTeamId === teamId || t.destinationTeamId === teamId);
  }

  // Priority filter
  if (priority && priority !== 'all') {
    results = results.filter(t => t.priority.toLowerCase() === priority.toLowerCase());
  }

  // Status filter
  if (status && status !== 'all') {
    results = results.filter(t => t.status.toLowerCase() === status.toLowerCase());
  }

  // Search filter
  if (search) {
    results = results.filter(t =>
      t.title.toLowerCase().includes(search) ||
      t.description.toLowerCase().includes(search) ||
      t.creator?.name.toLowerCase().includes(search) ||
      t.assignee?.name.toLowerCase().includes(search) ||
      t.sourceTeam?.name.toLowerCase().includes(search)
    );
  }

  // Sort by updatedAt desc
  results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const total = results.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginatedTasks = results.slice((page - 1) * limit, page * limit);

  return res.json({
    tasks: paginatedTasks,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
    counts: {
      all: db.tasks.length,
      assignedToMe: db.tasks.filter(t => t.assigneeId === user.id).length,
      priority: db.tasks.filter(t => t.priority === 'High' || t.priority === 'Urgent').length,
      awaitingApproval: db.tasks.filter(t => t.status === 'Awaiting Approval').length,
      ongoing: db.tasks.filter(t => ['New', 'Assigned', 'In Progress', 'Awaiting Approval'].includes(t.status)).length,
      completed: db.tasks.filter(t => ['Resolved', 'Closed'].includes(t.status)).length,
    },
  });
});

// GET /api/tasks/:id - Task details with comments and activity history
tasksRouter.get('/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const task = db.tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const enriched = enrichTask(task);
  const comments = db.comments
    .filter(c => c.taskId === task.id)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const activities = db.activities
    .filter(a => a.taskId === task.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Determine allowed user actions
  const user = req.user!;
  const isCreator = task.creatorId === user.id;
  const isAssignee = task.assigneeId === user.id;
  const isSourceLeader = task.sourceTeam?.leadId === user.id;
  const isDestinationLeader = task.destinationTeam?.leadId === user.id;
  const isSourceMember = task.sourceTeam?.memberIds.includes(user.id) || false;
  const isDestinationMember = task.destinationTeam?.memberIds.includes(user.id) || false;
  const isAdmin = user.role === 'admin';

  const canClaim =
    !isCreator &&
    !task.assigneeId &&
    task.status === 'New' &&
    ((task.destinationTeamId ? isDestinationMember : isSourceMember) || isAdmin);
  const canStartWork = isAssignee && task.status === 'Assigned';
  const canSubmitForReview = isAssignee && (task.status === 'In Progress' || task.status === 'Assigned');
  const canReview = (isSourceLeader || (task.destinationTeamId && isDestinationLeader) || isAdmin) && task.status === 'Awaiting Approval';
  const canDelete = isCreator || isAdmin;

  return res.json({
    task: enriched,
    comments,
    activities,
    permissions: {
      canClaim,
      canStartWork,
      canSubmitForReview,
      canReview,
      canDelete,
      isCreator,
      isAssignee,
    },
  });
});

// POST /api/tasks - Create a new task (by Team Leader or Admin)
tasksRouter.post('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const {
      title,
      description,
      priority,
      dueDate,
      sourceTeamId,
      assignmentMethod,
      destinationTeamId,
      assignedMemberId,
    } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required.' });
    }
    if (!description || typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({ error: 'Task description is required.' });
    }
    if (!sourceTeamId) {
      return res.status(400).json({ error: 'Source team is required.' });
    }

    const sourceTeam = db.teams.find(t => t.id === sourceTeamId);
    if (!sourceTeam) {
      return res.status(400).json({ error: 'Source team does not exist.' });
    }

    // Authorization: User must be leader of the source team, or admin
    if (sourceTeam.leadId !== user.id && user.role !== 'admin') {
      return res.status(403).json({ error: 'Only the team leader or administrator can create tasks for this team.' });
    }

    const validPriorities: TaskPriority[] = ['Low', 'Medium', 'High', 'Urgent'];
    const chosenPriority: TaskPriority = validPriorities.includes(priority) ? priority : 'Medium';

    let status: TaskStatus = 'New';
    let assigneeId: string | null = null;
    let finalDestTeamId: string | null = null;

    if (assignmentMethod === 'another_team') {
      if (!destinationTeamId || destinationTeamId === sourceTeamId) {
        return res.status(400).json({ error: 'Please choose a different destination team for cross-team assignment.' });
      }
      const destTeam = db.teams.find(t => t.id === destinationTeamId);
      if (!destTeam) {
        return res.status(400).json({ error: 'Destination team does not exist.' });
      }
      finalDestTeamId = destTeam.id;
      status = 'Awaiting Approval';
    } else if (assignmentMethod === 'specific_member') {
      if (!assignedMemberId) {
        return res.status(400).json({ error: 'Please select a team member to assign this task to.' });
      }
      if (!sourceTeam.memberIds.includes(assignedMemberId)) {
        return res.status(400).json({ error: 'Selected assignee is not a member of this team.' });
      }
      if (assignedMemberId === user.id) {
        return res.status(400).json({ error: 'Task creator cannot assign the task to themselves.' });
      }
      assigneeId = assignedMemberId;
      status = 'Assigned';
    } else {
      status = 'New';
      assigneeId = null;
    }

    const newTask: Task = {
      id: `tsk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      description: description.trim(),
      priority: chosenPriority,
      status,
      dueDate: dueDate || undefined,
      creatorId: user.id,
      creator: user,
      assigneeId,
      assignee: assigneeId ? db.getUserById(assigneeId) || null : null,
      sourceTeamId: sourceTeam.id,
      sourceTeam,
      destinationTeamId: finalDestTeamId,
      destinationTeam: finalDestTeamId ? db.teams.find(t => t.id === finalDestTeamId) || null : null,
      assignmentMethod: (assignmentMethod as AssignmentMethod) || 'my_team',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.tasks.unshift(newTask);

    if (assignmentMethod === 'another_team' && finalDestTeamId) {
      const destTeam = db.teams.find(t => t.id === finalDestTeamId)!;
      const approvalRequest: ApprovalRequest = {
        id: `appr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        taskId: newTask.id,
        task: newTask,
        sourceTeamId: sourceTeam.id,
        sourceTeam,
        destinationTeamId: destTeam.id,
        destinationTeam: destTeam,
        requestorId: user.id,
        requestor: user,
        recipientLeaderId: destTeam.leadId,
        recipientLeader: db.getUserById(destTeam.leadId)!,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };
      db.approvals.unshift(approvalRequest);
      db.logActivity({
        taskId: newTask.id,
        taskTitle: newTask.title,
        actorId: user.id,
        actor: user,
        action: 'cross_team_requested',
        details: `${user.name} initiated cross-team assignment from "${sourceTeam.name}" to "${destTeam.name}". Awaiting approval from ${destTeam.lead.name}.`,
        sourceTeamName: sourceTeam.name,
        destinationTeamName: destTeam.name,
      });
    } else {
      db.logActivity({
        taskId: newTask.id,
        taskTitle: newTask.title,
        actorId: user.id,
        actor: user,
        action: newTask.assigneeId ? 'task_assigned' : 'task_created',
        details: newTask.assigneeId
          ? `Created and assigned directly to ${db.getUserById(newTask.assigneeId)?.name}.`
          : `Created new task open for members of "${sourceTeam.name}" to claim.`,
        sourceTeamName: sourceTeam.name,
      });
    }

    return res.status(201).json({ task: enrichTask(newTask) });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to create task' });
  }
});

// POST /api/tasks/:id/claim - Claim eligible task
tasksRouter.post('/:id/claim', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const task = db.tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  if (task.creatorId === user.id) {
    return res.status(403).json({ error: 'Task creators are not permitted to claim their own tasks.' });
  }
  if (task.assigneeId) {
    return res.status(409).json({ error: 'This task has already been claimed by another team member.' });
  }
  if (task.status !== 'New') {
    return res.status(400).json({ error: `Cannot claim task in status "${task.status}". Only "New" tasks can be claimed.` });
  }

  const activeTeamId = task.destinationTeamId || task.sourceTeamId;
  const activeTeam = db.teams.find(t => t.id === activeTeamId);
  if (!activeTeam) {
    return res.status(400).json({ error: 'Associated team not found.' });
  }

  const isMember = activeTeam.memberIds.includes(user.id);
  if (!isMember && user.role !== 'admin') {
    return res.status(403).json({ error: `Only members of "${activeTeam.name}" are eligible to claim this task.` });
  }

  task.assigneeId = user.id;
  task.status = 'Assigned';
  task.updatedAt = new Date().toISOString();

  db.logActivity({
    taskId: task.id,
    taskTitle: task.title,
    actorId: user.id,
    actor: user,
    action: 'task_claimed',
    details: `${user.name} claimed the task and moved it to their assigned work.`,
    sourceTeamName: activeTeam.name,
  });

  return res.json({ task: enrichTask(task) });
});

// PATCH /api/tasks/:id/status - Status transitions
tasksRouter.patch('/:id/status', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { status, reviewNotes } = req.body;
  const task = db.tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const validStatuses: TaskStatus[] = ['New', 'Assigned', 'In Progress', 'Awaiting Approval', 'Resolved', 'Closed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status provided.' });
  }

  const isAssignee = task.assigneeId === user.id;
  const isSourceLeader = task.sourceTeam?.leadId === user.id;
  const isDestLeader = task.destinationTeam?.leadId === user.id;
  const isAuthorizedLeader = isSourceLeader || isDestLeader || user.role === 'admin';

  if ((status === 'Resolved' || status === 'Closed') && !isAuthorizedLeader) {
    return res.status(403).json({
      error: 'Only the team leader or administrator can resolve or close tasks after review.',
    });
  }

  if (status === 'In Progress' && !isAssignee && !isAuthorizedLeader) {
    return res.status(403).json({ error: 'Only the assigned member or team leader can start progress on this task.' });
  }

  const prevStatus = task.status;
  task.status = status;
  task.updatedAt = new Date().toISOString();
  if (reviewNotes) {
    task.reviewNotes = reviewNotes;
  }

  db.logActivity({
    taskId: task.id,
    taskTitle: task.title,
    actorId: user.id,
    actor: user,
    action: status === 'Resolved' ? 'task_resolved' : status === 'Closed' ? 'task_closed' : 'status_changed',
    details: `Status transitioned from "${prevStatus}" to "${status}" by ${user.name}. ${reviewNotes ? `Notes: ${reviewNotes}` : ''}`,
  });

  return res.json({ task: enrichTask(task) });
});

// POST /api/tasks/:id/submit-for-review - Member submits work to leader
tasksRouter.post('/:id/submit-for-review', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { notes } = req.body;
  const task = db.tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (task.assigneeId !== user.id && user.role !== 'admin') {
    return res.status(403).json({ error: 'Only the assigned team member can submit work for review.' });
  }

  task.status = 'Awaiting Approval';
  task.updatedAt = new Date().toISOString();

  db.logActivity({
    taskId: task.id,
    taskTitle: task.title,
    actorId: user.id,
    actor: user,
    action: 'submitted_for_review',
    details: `${user.name} submitted completed work for lead review. ${notes ? `Submission note: "${notes}"` : ''}`,
  });

  if (notes) {
    db.comments.push({
      id: `com-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      taskId: task.id,
      authorId: user.id,
      author: user,
      content: `[Submitted for Review] ${notes}`,
      createdAt: new Date().toISOString(),
    });
  }

  return res.json({ task: enrichTask(task) });
});

// POST /api/tasks/:id/leader-review - Leader reviews work
tasksRouter.post('/:id/leader-review', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { decision, reason } = req.body;
  const task = db.tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const team = task.destinationTeamId ? db.teams.find(t => t.id === task.destinationTeamId) : db.teams.find(t => t.id === task.sourceTeamId);
  const isLeader = team && team.leadId === user.id;

  if (!isLeader && user.role !== 'admin') {
    return res.status(403).json({ error: 'Only the team leader can review task submissions.' });
  }

  if (decision === 'approve') {
    task.status = 'Resolved';
    task.reviewNotes = reason || 'Work approved by team lead.';
    task.updatedAt = new Date().toISOString();

    db.logActivity({
      taskId: task.id,
      taskTitle: task.title,
      actorId: user.id,
      actor: user,
      action: 'task_resolved',
      details: `${user.name} approved the submission and marked the work as Resolved.`,
    });
  } else {
    if (!reason || !reason.trim()) {
      return res.status(400).json({ error: 'A reason or feedback is required when requesting changes.' });
    }
    task.status = 'In Progress';
    task.reviewNotes = `Changes requested by ${user.name}: ${reason.trim()}`;
    task.updatedAt = new Date().toISOString();

    db.logActivity({
      taskId: task.id,
      taskTitle: task.title,
      actorId: user.id,
      actor: user,
      action: 'changes_requested',
      details: `${user.name} requested changes on the submission: "${reason.trim()}". Returned to In Progress.`,
    });

    db.comments.push({
      id: `com-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      taskId: task.id,
      authorId: user.id,
      author: user,
      content: `[Changes Requested by Lead] ${reason.trim()}`,
      createdAt: new Date().toISOString(),
    });
  }

  return res.json({ task: enrichTask(task) });
});

// DELETE /api/tasks/:id - Delete task (Only creator or admin)
tasksRouter.delete('/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const taskIndex = db.tasks.findIndex(t => t.id === req.params.id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const task = db.tasks[taskIndex];
  if (task.creatorId !== user.id && user.role !== 'admin') {
    return res.status(403).json({ error: 'Only the task creator or administrator can delete this task.' });
  }

  db.tasks.splice(taskIndex, 1);
  db.approvals = db.approvals.filter(a => a.taskId !== task.id);

  db.logActivity({
    taskId: task.id,
    taskTitle: task.title,
    actorId: user.id,
    actor: user,
    action: 'task_deleted',
    details: `${user.name} deleted task "${task.title}".`,
  });

  return res.json({ message: 'Task deleted successfully.' });
});

// POST /api/tasks/:id/comments - Add comment in chronological order
tasksRouter.post('/:id/comments', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { content } = req.body;
  const task = db.tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Comment content cannot be empty.' });
  }

  const newComment = {
    id: `com-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    taskId: task.id,
    authorId: user.id,
    author: user,
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };

  db.comments.push(newComment);
  db.logActivity({
    taskId: task.id,
    taskTitle: task.title,
    actorId: user.id,
    actor: user,
    action: 'comment_added',
    details: `${user.name} added a comment on task "${task.title}".`,
  });

  return res.status(201).json({ comment: newComment });
});
