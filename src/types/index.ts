export type UserRole = 'admin' | 'employee' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department?: string;
  title?: string;
  createdAt: string;
  customBadges?: Array<{
    id: string;
    title: string;
    icon: string;
    reason: string;
    grantedBy: string;
    grantedAt: string;
  }>;
}

export interface TeamMember {
  userId: string;
  user: User;
  roleInTeam: 'leader' | 'member';
  joinedAt: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  leadId: string;
  lead: User;
  memberIds: string[];
  members: User[];
  createdAt: string;
  taskStats?: {
    total: number;
    new: number;
    inProgress: number;
    awaitingApproval: number;
    resolved: number;
    closed: number;
    ongoing: number;
    incomplete: number;
  };
}

export type TaskStatus =
  | 'New'
  | 'Assigned'
  | 'In Progress'
  | 'Awaiting Approval'
  | 'Resolved'
  | 'Closed';

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type AssignmentMethod = 'my_team' | 'another_team' | 'specific_member';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  creatorId: string;
  creator: User;
  assigneeId?: string | null;
  assignee?: User | null;
  sourceTeamId: string;
  sourceTeam?: Team;
  destinationTeamId?: string | null;
  destinationTeam?: Team | null;
  assignmentMethod: AssignmentMethod;
  createdAt: string;
  updatedAt: string;
  reviewNotes?: string;
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  author: User;
  content: string;
  createdAt: string;
}

export type ActivityAction =
  | 'task_created'
  | 'task_assigned'
  | 'task_claimed'
  | 'status_changed'
  | 'cross_team_requested'
  | 'cross_team_approved'
  | 'cross_team_rejected'
  | 'distributed_to_members'
  | 'submitted_for_review'
  | 'changes_requested'
  | 'task_resolved'
  | 'task_closed'
  | 'task_deleted'
  | 'comment_added'
  | 'team_created'
  | 'team_deleted'
  | 'badge_granted';

export interface ActivityLog {
  id: string;
  taskId?: string;
  taskTitle?: string;
  actorId: string;
  actor: User;
  action: ActivityAction;
  details: string;
  sourceTeamName?: string;
  destinationTeamName?: string;
  createdAt: string;
}

export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export interface ApprovalRequest {
  id: string;
  taskId: string;
  task: Task;
  sourceTeamId: string;
  sourceTeam: Team;
  destinationTeamId: string;
  destinationTeam: Team;
  requestorId: string;
  requestor: User;
  recipientLeaderId: string;
  recipientLeader: User;
  status: ApprovalStatus;
  rejectionReason?: string;
  createdAt: string;
  respondedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  teamsLeading: Team[];
  teamsMemberOf: Team[];
}
