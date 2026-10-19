import {
  User,
  Team,
  Task,
  ApprovalRequest,
  ActivityLog,
  Comment,
  TaskPriority,
  AssignmentMethod,
  TaskStatus,
} from '../types/index.ts';

const TOKEN_KEY = 'netwonite_token';
const USER_KEY = 'netwonite_user';

// Automatically purge legacy tokens stored in localStorage from earlier builds
// This ensures that clicking deployment links (e.g. Render) always starts at the Login page
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  }
} catch {
  // ignore
}

export const storage = {
  getToken(): string | null {
    try {
      if (typeof window === 'undefined') return null;
      return window.sessionStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  setToken(token: string) {
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(TOKEN_KEY, token);
      }
    } catch {
      // ignore
    }
  },
  getUser(): User | null {
    try {
      if (typeof window === 'undefined') return null;
      const raw = window.sessionStorage.getItem(USER_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setUser(user: User) {
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
      }
    } catch {
      // ignore
    }
  },
  clear() {
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(TOKEN_KEY);
        window.sessionStorage.removeItem(USER_KEY);
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(USER_KEY);
      }
    } catch {
      // ignore
    }
  },
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = storage.getToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
  }
  return data as T;
}

export const api = {
  // Auth
  async login(email: string, password = '123456') {
    return request<{ user: User; token: string; teamsLeading: Team[]; teamsMemberOf: Team[] }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
  },
  async getMe() {
    return request<{ user: User; teamsLeading: Team[]; teamsMemberOf: Team[] }>('/api/auth/me');
  },
  async getDemoUsers() {
    return request<{ users: (User & { teamsLeadingCount: number; teamsMemberOfCount: number; teamsLeadingNames: string[]; teamsMemberNames: string[] })[] }>(
      '/api/auth/demo-users'
    );
  },

  // Teams
  async getTeams() {
    return request<{ teams: Team[] }>('/api/teams');
  },
  async getTeam(id: string) {
    return request<{ team: Team; tasks: Task[] }>(`/api/teams/${id}`);
  },
  async createTeam(data: { name: string; description: string; leadId: string; memberIds: string[] }) {
    return request<{ team: Team }>('/api/teams', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async deleteTeam(id: string) {
    return request<{ message: string }>(`/api/teams/${id}`, {
      method: 'DELETE',
    });
  },

  // Users
  async getUsers() {
    return request<{ users: (User & { teamsLeading: Team[]; teamsMemberOf: Team[]; isLeader: boolean; totalTeams: number })[] }>('/api/users');
  },
  async getUser(id: string) {
    return request<{
      user: User;
      teamsLeading: Team[];
      teamsMemberOf: Team[];
      stats: { assignedTasksCount: number; createdTasksCount: number; completedTasksCount: number };
    }>(`/api/users/${id}`);
  },
  async updateUserAvatar(id: string, avatar: string) {
    return request<{ user: User; message: string }>(`/api/users/${id}/avatar`, {
      method: 'PATCH',
      body: JSON.stringify({ avatar }),
    });
  },
  async grantBadge(id: string, data: { title: string; icon: string; reason: string }) {
    return request<{ user: User; message: string }>(`/api/users/${id}/grant-badge`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Tasks
  async getTasks(params?: {
    filter?: string;
    priority?: string;
    status?: string;
    teamId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.set(key, String(val));
        }
      });
    }
    return request<{
      tasks: Task[];
      pagination: { total: number; page: number; limit: number; totalPages: number };
      counts: {
        all: number;
        assignedToMe: number;
        priority: number;
        awaitingApproval: number;
        ongoing: number;
        completed: number;
      };
    }>(`/api/tasks?${query.toString()}`);
  },
  async getTask(id: string) {
    return request<{
      task: Task;
      comments: Comment[];
      activities: ActivityLog[];
      permissions: {
        canClaim: boolean;
        canStartWork: boolean;
        canSubmitForReview: boolean;
        canReview: boolean;
        canDelete: boolean;
        isCreator: boolean;
        isAssignee: boolean;
      };
    }>(`/api/tasks/${id}`);
  },
  async createTask(data: {
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate?: string;
    sourceTeamId: string;
    assignmentMethod: AssignmentMethod;
    destinationTeamId?: string;
    assignedMemberId?: string;
  }) {
    return request<{ task: Task }>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async claimTask(id: string) {
    return request<{ task: Task }>(`/api/tasks/${id}/claim`, {
      method: 'POST',
    });
  },
  async updateTaskStatus(id: string, status: TaskStatus, reviewNotes?: string) {
    return request<{ task: Task }>(`/api/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reviewNotes }),
    });
  },
  async submitForReview(id: string, notes?: string) {
    return request<{ task: Task }>(`/api/tasks/${id}/submit-for-review`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  },
  async leaderReview(id: string, decision: 'approve' | 'reject', reason?: string) {
    return request<{ task: Task }>(`/api/tasks/${id}/leader-review`, {
      method: 'POST',
      body: JSON.stringify({ decision, reason }),
    });
  },
  async deleteTask(id: string) {
    return request<{ message: string }>(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  },
  async addComment(taskId: string, content: string) {
    return request<{ comment: Comment }>(`/api/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  // Approvals
  async getApprovals() {
    return request<{ approvals: ApprovalRequest[] }>('/api/approvals');
  },
  async approveAndDistribute(id: string) {
    return request<{ message: string; approval: ApprovalRequest; task: Task }>(
      `/api/approvals/${id}/approve-distribute`,
      { method: 'POST' }
    );
  },
  async rejectApproval(id: string, reason: string) {
    return request<{ message: string; approval: ApprovalRequest }>(`/api/approvals/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  // Rejections
  async getRejections() {
    return request<{
      rejections: Array<{
        id: string;
        type: string;
        taskId: string;
        taskTitle: string;
        sourceTeam: string;
        destinationTeam: string;
        requestorName: string;
        rejectorName: string;
        reason: string;
        timestamp: string;
      }>;
    }>('/api/rejections');
  },

  // Activities
  async getActivities(limit = 40, taskId?: string) {
    const query = new URLSearchParams();
    query.set('limit', String(limit));
    if (taskId) query.set('taskId', taskId);
    return request<{ activities: ActivityLog[] }>(`/api/activities?${query.toString()}`);
  },

  // Reset demo
  async resetDemo() {
    return request<{ message: string }>('/api/seed/reset', {
      method: 'POST',
    });
  },
};
