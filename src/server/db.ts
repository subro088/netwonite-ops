import bcrypt from 'bcryptjs';
import {
  User,
  Team,
  Task,
  Comment,
  ActivityLog,
  ApprovalRequest,
  TaskStatus,
  TaskPriority,
  AssignmentMethod,
} from '../types/index.ts';

// Precomputed bcrypt hash for password '123456'
const HASHED_PASSWORD_123456 = bcrypt.hashSync('123456', 8);

const EMPLOYEE_NAMES = [
  { name: 'Alex Chen', dept: 'Infrastructure', title: 'Principal DevOps Engineer' },
  { name: 'Jordan Taylor', dept: 'Backend Platform', title: 'Senior Software Engineer' },
  { name: 'Samira Khan', dept: 'Frontend Architecture', title: 'Senior UI/UX Engineer' },
  { name: 'Marcus Vance', dept: 'Cloud Reliability', title: 'Site Reliability Engineer' },
  { name: 'Elena Rostova', dept: 'Database Systems', title: 'Data Platform Engineer' },
  { name: 'David Kim', dept: 'Product Engineering', title: 'Lead Fullstack Engineer' },
  { name: 'Priya Patel', dept: 'Design Systems', title: 'Senior Product Designer' },
  { name: 'Lucas Silva', dept: 'Mobile & Web', title: 'Frontend Developer' },
  { name: 'Sarah Jenkins', dept: 'API Services', title: 'Software Engineer II' },
  { name: 'Hassan Ali', dept: 'Quality Engineering', title: 'Automation QA Lead' },
  { name: 'Emily Zhao', dept: 'Security & Compliance', title: 'Staff Security Engineer' },
  { name: 'Mateo Hernandez', dept: 'AppSec', title: 'Information Security Analyst' },
  { name: 'Chloe Dubois', dept: 'Auth & Identity', title: 'Systems Architect' },
  { name: 'Liam O Connor', dept: 'Network Security', title: 'Network Operations Engineer' },
  { name: 'Aisha Abubakar', dept: 'Platform Governance', title: 'Compliance Officer' },
  { name: 'Noah Becker', dept: 'Data & Intelligence', title: 'Machine Learning Lead' },
  { name: 'Mia Takahashi', dept: 'Data Science', title: 'Data Analyst' },
  { name: 'Ethan Wright', dept: 'MLOps', title: 'ML Infrastructure Engineer' },
  { name: 'Olivia Rossi', dept: 'Growth Engineering', title: 'Product Analytics Lead' },
  { name: 'Benjamin Scott', dept: 'Integrations', title: 'API Integration Specialist' },
];

export interface StoredUser extends User {
  passwordHash: string;
}

class NetwoniteDatabase {
  public users: StoredUser[] = [];
  public teams: Team[] = [];
  public tasks: Task[] = [];
  public comments: Comment[] = [];
  public activities: ActivityLog[] = [];
  public approvals: ApprovalRequest[] = [];

  constructor() {
    this.seed();
  }

  public seed() {
    // 1. Admin
    const admin: StoredUser = {
      id: 'usr-admin',
      name: 'System Administrator',
      email: 'admin@netwonite.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      department: 'Executive Operations',
      title: 'Global Administrator',
      createdAt: '2026-01-01T08:00:00.000Z',
      passwordHash: HASHED_PASSWORD_123456,
      customBadges: [],
    };

    const REAL_HUMAN_PHOTOS = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534751516642-a171edd2521d?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&auto=format&fit=crop&q=80',
    ];

    // 2. 20 Demo Employees
    const employees: StoredUser[] = [];
    for (let i = 1; i <= 20; i++) {
      const info = EMPLOYEE_NAMES[i - 1];
      const humanPhoto = REAL_HUMAN_PHOTOS[i - 1] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80';
      employees.push({
        id: `usr-emp-${i}`,
        name: info.name,
        email: `employ${i}@gmail.com`,
        role: 'employee',
        avatar: humanPhoto,
        department: info.dept,
        title: info.title,
        createdAt: '2026-01-05T09:00:00.000Z',
        passwordHash: HASHED_PASSWORD_123456,
        customBadges: i === 2 ? [
          {
            id: 'bdg-initial-1',
            title: 'Reliability Vanguard',
            icon: '🛡️',
            reason: 'Exceptional zero-downtime microservice migration',
            grantedBy: 'System Administrator',
            grantedAt: '2026-10-15T10:00:00.000Z',
          }
        ] : [],
      });
    }

    this.users = [admin, ...employees];

    // 3. Teams: Team Rock, Team Paper, Team Nexus, Team Alpha
    const teamRock: Team = {
      id: 'team-rock',
      name: 'Team Rock',
      description: 'Core infrastructure, microservices, containerization, and site reliability engineering.',
      leadId: 'usr-emp-1',
      lead: this.getUserById('usr-emp-1')!,
      memberIds: ['usr-emp-2', 'usr-emp-3', 'usr-emp-4', 'usr-emp-5'],
      members: [],
      createdAt: '2026-01-10T10:00:00.000Z',
    };
    teamRock.members = teamRock.memberIds.map(id => this.getUserById(id)!);

    const teamPaper: Team = {
      id: 'team-paper',
      name: 'Team Paper',
      description: 'Product design, frontend web application interfaces, and customer experience.',
      leadId: 'usr-emp-6',
      lead: this.getUserById('usr-emp-6')!,
      memberIds: ['usr-emp-7', 'usr-emp-8', 'usr-emp-9', 'usr-emp-10'],
      members: [],
      createdAt: '2026-01-11T10:00:00.000Z',
    };
    teamPaper.members = teamPaper.memberIds.map(id => this.getUserById(id)!);

    const teamNexus: Team = {
      id: 'team-nexus',
      name: 'Team Nexus',
      description: 'Zero-trust architecture, identity management, OAuth2 services, and cyber compliance.',
      leadId: 'usr-emp-11',
      lead: this.getUserById('usr-emp-11')!,
      memberIds: ['usr-emp-12', 'usr-emp-13', 'usr-emp-14', 'usr-emp-15', 'usr-emp-2'],
      members: [],
      createdAt: '2026-01-12T10:00:00.000Z',
    };
    teamNexus.members = teamNexus.memberIds.map(id => this.getUserById(id)!);

    const teamAlpha: Team = {
      id: 'team-alpha',
      name: 'Team Alpha',
      description: 'AI model inference pipelines, big data analytics, and real-time streaming metrics.',
      leadId: 'usr-emp-16',
      lead: this.getUserById('usr-emp-16')!,
      memberIds: ['usr-emp-17', 'usr-emp-18', 'usr-emp-19', 'usr-emp-20'],
      members: [],
      createdAt: '2026-01-13T10:00:00.000Z',
    };
    teamAlpha.members = teamAlpha.memberIds.map(id => this.getUserById(id)!);

    this.teams = [teamRock, teamPaper, teamNexus, teamAlpha];

    // 4. Tasks across statuses
    this.tasks = [
      {
        id: 'tsk-101',
        title: 'Upgrade Kubernetes ingress controller to v1.12 with TLS termination',
        description: 'Update the ingress-nginx chart, verify cert-manager auto-renewal and zero-downtime routing across all microservice pods.',
        priority: 'High',
        status: 'New',
        dueDate: '2026-11-01',
        creatorId: 'usr-emp-1',
        creator: this.getUserById('usr-emp-1')!,
        assigneeId: null,
        assignee: null,
        sourceTeamId: 'team-rock',
        sourceTeam: teamRock,
        destinationTeamId: null,
        destinationTeam: null,
        assignmentMethod: 'my_team',
        createdAt: '2026-10-15T09:30:00.000Z',
        updatedAt: '2026-10-15T09:30:00.000Z',
      },
      {
        id: 'tsk-102',
        title: 'Implement Redis cluster caching for team roster queries',
        description: 'Reduce relational database read latency by introducing Redis replica caching with an aggressive 5-minute TTL and write-through invalidation.',
        priority: 'Medium',
        status: 'In Progress',
        dueDate: '2026-10-25',
        creatorId: 'usr-emp-1',
        creator: this.getUserById('usr-emp-1')!,
        assigneeId: 'usr-emp-2',
        assignee: this.getUserById('usr-emp-2')!,
        sourceTeamId: 'team-rock',
        sourceTeam: teamRock,
        destinationTeamId: null,
        destinationTeam: null,
        assignmentMethod: 'specific_member',
        createdAt: '2026-10-14T11:00:00.000Z',
        updatedAt: '2026-10-16T14:20:00.000Z',
      },
      {
        id: 'tsk-103',
        title: 'Cross-team: Design glassy dashboard token palette for dark and light modes',
        description: 'Team Rock requires UI component guidelines and frosted glass css tokens from Team Paper for next-generation platform metrics.',
        priority: 'Urgent',
        status: 'Awaiting Approval',
        dueDate: '2026-10-28',
        creatorId: 'usr-emp-1',
        creator: this.getUserById('usr-emp-1')!,
        assigneeId: null,
        assignee: null,
        sourceTeamId: 'team-rock',
        sourceTeam: teamRock,
        destinationTeamId: 'team-paper',
        destinationTeam: teamPaper,
        assignmentMethod: 'another_team',
        createdAt: '2026-10-17T08:15:00.000Z',
        updatedAt: '2026-10-17T08:15:00.000Z',
      },
      {
        id: 'tsk-104',
        title: 'Responsive navigation bar redesign with role-based switcher',
        description: 'Implement Quicksand typography, glassmorphic backdrop blur, and compact mobile drawer navigation for Team Paper members.',
        priority: 'High',
        status: 'Awaiting Approval',
        dueDate: '2026-10-20',
        creatorId: 'usr-emp-6',
        creator: this.getUserById('usr-emp-6')!,
        assigneeId: 'usr-emp-7',
        assignee: this.getUserById('usr-emp-7')!,
        sourceTeamId: 'team-paper',
        sourceTeam: teamPaper,
        destinationTeamId: null,
        destinationTeam: null,
        assignmentMethod: 'specific_member',
        createdAt: '2026-10-12T10:00:00.000Z',
        updatedAt: '2026-10-17T16:00:00.000Z',
      },
      {
        id: 'tsk-105',
        title: 'Refactor OAuth token rotation and CSRF protection headers',
        description: 'Hardened refresh token rotation with cryptographic fingerprinting to eliminate replay attacks across API gateways.',
        priority: 'High',
        status: 'Resolved',
        dueDate: '2026-10-14',
        creatorId: 'usr-emp-11',
        creator: this.getUserById('usr-emp-11')!,
        assigneeId: 'usr-emp-12',
        assignee: this.getUserById('usr-emp-12')!,
        sourceTeamId: 'team-nexus',
        sourceTeam: teamNexus,
        destinationTeamId: null,
        destinationTeam: null,
        assignmentMethod: 'specific_member',
        createdAt: '2026-10-08T09:00:00.000Z',
        updatedAt: '2026-10-14T17:30:00.000Z',
        reviewNotes: 'Verified cryptographically. Excellent work on zero-trust token exchange.',
      },
      {
        id: 'tsk-106',
        title: 'Quarterly platform security audit & SOC2 Type II compliance check',
        description: 'Completed audit for all microservice access logs, backup retention, and encryption at rest.',
        priority: 'Low',
        status: 'Closed',
        dueDate: '2026-10-10',
        creatorId: 'usr-emp-11',
        creator: this.getUserById('usr-emp-11')!,
        assigneeId: 'usr-emp-13',
        assignee: this.getUserById('usr-emp-13')!,
        sourceTeamId: 'team-nexus',
        sourceTeam: teamNexus,
        destinationTeamId: null,
        destinationTeam: null,
        assignmentMethod: 'specific_member',
        createdAt: '2026-10-01T08:00:00.000Z',
        updatedAt: '2026-10-10T12:00:00.000Z',
        reviewNotes: 'Audit reports filed and archived with compliance office.',
      },
      {
        id: 'tsk-107',
        title: 'Optimize vector search embedding retrieval pipeline for telemetry',
        description: 'Speed up similarity queries using HNSW indexing and memory-mapped embedding shards.',
        priority: 'High',
        status: 'Assigned',
        dueDate: '2026-10-30',
        creatorId: 'usr-emp-16',
        creator: this.getUserById('usr-emp-16')!,
        assigneeId: 'usr-emp-17',
        assignee: this.getUserById('usr-emp-17')!,
        sourceTeamId: 'team-alpha',
        sourceTeam: teamAlpha,
        destinationTeamId: null,
        destinationTeam: null,
        assignmentMethod: 'specific_member',
        createdAt: '2026-10-16T13:00:00.000Z',
        updatedAt: '2026-10-16T13:05:00.000Z',
      },
      {
        id: 'tsk-108',
        title: 'Cross-team: Team Alpha requests frontend charts from Team Paper',
        description: 'Provide animated SVG/canvas heatmaps for real-time model throughput monitoring.',
        priority: 'Medium',
        status: 'New',
        dueDate: '2026-11-05',
        creatorId: 'usr-emp-16',
        creator: this.getUserById('usr-emp-16')!,
        assigneeId: null,
        assignee: null,
        sourceTeamId: 'team-alpha',
        sourceTeam: teamAlpha,
        destinationTeamId: 'team-paper',
        destinationTeam: teamPaper,
        assignmentMethod: 'another_team',
        createdAt: '2026-10-17T11:00:00.000Z',
        updatedAt: '2026-10-17T11:00:00.000Z',
      },
      {
        id: 'tsk-109',
        title: 'High-speed model quantization benchmark on TensorRT',
        description: 'Benchmark INT8 quantization accuracy retention and p99 inference response latency on production GPU clusters.',
        priority: 'High',
        status: 'Resolved',
        dueDate: '2026-10-16',
        creatorId: 'usr-emp-16',
        creator: this.getUserById('usr-emp-16')!,
        assigneeId: 'usr-emp-18',
        assignee: this.getUserById('usr-emp-18')!,
        sourceTeamId: 'team-alpha',
        sourceTeam: teamAlpha,
        destinationTeamId: null,
        destinationTeam: null,
        assignmentMethod: 'specific_member',
        createdAt: '2026-10-10T10:00:00.000Z',
        updatedAt: '2026-10-16T15:30:00.000Z',
        reviewNotes: 'Verified TensorRT model passes all regression tests with 2.8x speedup.',
      },
      {
        id: 'tsk-110',
        title: 'Distributed load testing on API gateway with K6',
        description: 'Simulate 50,000 concurrent websocket connections to measure gateway buffer health.',
        priority: 'Urgent',
        status: 'Resolved',
        dueDate: '2026-10-15',
        creatorId: 'usr-emp-1',
        creator: this.getUserById('usr-emp-1')!,
        assigneeId: 'usr-emp-4',
        assignee: this.getUserById('usr-emp-4')!,
        sourceTeamId: 'team-rock',
        sourceTeam: teamRock,
        destinationTeamId: null,
        destinationTeam: null,
        assignmentMethod: 'specific_member',
        createdAt: '2026-10-09T09:00:00.000Z',
        updatedAt: '2026-10-15T18:00:00.000Z',
        reviewNotes: 'Gateway held 50k sustained connections with 0 packet drops.',
      },
    ];

    // 5. Cross-Team Approvals
    this.approvals = [
      {
        id: 'appr-1',
        taskId: 'tsk-103',
        task: this.tasks.find(t => t.id === 'tsk-103')!,
        sourceTeamId: 'team-rock',
        sourceTeam: teamRock,
        destinationTeamId: 'team-paper',
        destinationTeam: teamPaper,
        requestorId: 'usr-emp-1',
        requestor: this.getUserById('usr-emp-1')!,
        recipientLeaderId: 'usr-emp-6',
        recipientLeader: this.getUserById('usr-emp-6')!,
        status: 'Pending',
        createdAt: '2026-10-17T08:15:00.000Z',
      },
      {
        id: 'appr-2',
        taskId: 'tsk-108',
        task: this.tasks.find(t => t.id === 'tsk-108')!,
        sourceTeamId: 'team-alpha',
        sourceTeam: teamAlpha,
        destinationTeamId: 'team-paper',
        destinationTeam: teamPaper,
        requestorId: 'usr-emp-16',
        requestor: this.getUserById('usr-emp-16')!,
        recipientLeaderId: 'usr-emp-6',
        recipientLeader: this.getUserById('usr-emp-6')!,
        status: 'Pending',
        createdAt: '2026-10-17T11:00:00.000Z',
      },
      {
        id: 'appr-3-rejected',
        taskId: 'tsk-old-rej',
        task: {
          id: 'tsk-old-rej',
          title: 'Direct database replica dump to external AWS S3 bucket',
          description: 'Request for raw SQL dumps to be piped to unverified vendor storage.',
          priority: 'Urgent',
          status: 'Closed',
          creatorId: 'usr-emp-1',
          creator: this.getUserById('usr-emp-1')!,
          sourceTeamId: 'team-rock',
          sourceTeam: teamRock,
          destinationTeamId: 'team-nexus',
          destinationTeam: teamNexus,
          assignmentMethod: 'another_team',
          createdAt: '2026-10-10T10:00:00.000Z',
          updatedAt: '2026-10-11T12:00:00.000Z',
        },
        sourceTeamId: 'team-rock',
        sourceTeam: teamRock,
        destinationTeamId: 'team-nexus',
        destinationTeam: teamNexus,
        requestorId: 'usr-emp-1',
        requestor: this.getUserById('usr-emp-1')!,
        recipientLeaderId: 'usr-emp-11',
        recipientLeader: this.getUserById('usr-emp-11')!,
        status: 'Rejected',
        rejectionReason: 'Violates compliance policy Sec-402: Raw database exports to external 3rd-party S3 buckets require audited encryption keys and VP approval.',
        createdAt: '2026-10-10T10:00:00.000Z',
        respondedAt: '2026-10-11T12:00:00.000Z',
      },
    ];

    // 6. Comments
    this.comments = [
      {
        id: 'com-1',
        taskId: 'tsk-102',
        authorId: 'usr-emp-1',
        author: this.getUserById('usr-emp-1')!,
        content: 'Please ensure we benchmark cluster hit ratios before enabling cache invalidation triggers.',
        createdAt: '2026-10-15T09:00:00.000Z',
      },
      {
        id: 'com-2',
        taskId: 'tsk-102',
        authorId: 'usr-emp-2',
        author: this.getUserById('usr-emp-2')!,
        content: 'Benchmarked in staging: latency dropped from 85ms to 4.2ms at p99. Preparing PR for review.',
        createdAt: '2026-10-16T14:15:00.000Z',
      },
      {
        id: 'com-3',
        taskId: 'tsk-104',
        authorId: 'usr-emp-7',
        author: this.getUserById('usr-emp-7')!,
        content: 'I have finished the responsive navbar with glassmorphic backdrop-blur and submitted it for lead review.',
        createdAt: '2026-10-17T16:00:00.000Z',
      },
    ];

    // 7. Activity Logs
    this.activities = [
      {
        id: 'act-1',
        actorId: 'usr-admin',
        actor: this.getUserById('usr-admin')!,
        action: 'team_created',
        details: 'Created team "Team Rock" and appointed Alex Chen as Team Lead.',
        createdAt: '2026-10-10T10:00:00.000Z',
      },
      {
        id: 'act-2',
        actorId: 'usr-admin',
        actor: this.getUserById('usr-admin')!,
        action: 'team_created',
        details: 'Created team "Team Paper" and appointed David Kim as Team Lead.',
        createdAt: '2026-10-11T10:00:00.000Z',
      },
      {
        id: 'act-3',
        taskId: 'tsk-101',
        taskTitle: 'Upgrade Kubernetes ingress controller to v1.12 with TLS termination',
        actorId: 'usr-emp-1',
        actor: this.getUserById('usr-emp-1')!,
        action: 'task_created',
        details: 'Created new task assigned to Team Rock for claiming.',
        sourceTeamName: 'Team Rock',
        createdAt: '2026-10-15T09:30:00.000Z',
      },
      {
        id: 'act-4',
        taskId: 'tsk-102',
        taskTitle: 'Implement Redis cluster caching for team roster queries',
        actorId: 'usr-emp-1',
        actor: this.getUserById('usr-emp-1')!,
        action: 'task_assigned',
        details: 'Assigned task directly to Jordan Taylor.',
        sourceTeamName: 'Team Rock',
        createdAt: '2026-10-14T11:00:00.000Z',
      },
      {
        id: 'act-5',
        taskId: 'tsk-103',
        taskTitle: 'Cross-team: Design glassy dashboard token palette for dark and light modes',
        actorId: 'usr-emp-1',
        actor: this.getUserById('usr-emp-1')!,
        action: 'cross_team_requested',
        details: 'Created cross-team assignment request from Team Rock to Team Paper.',
        sourceTeamName: 'Team Rock',
        destinationTeamName: 'Team Paper',
        createdAt: '2026-10-17T08:15:00.000Z',
      },
      {
        id: 'act-6',
        taskId: 'tsk-104',
        taskTitle: 'Responsive navigation bar redesign with role-based switcher',
        actorId: 'usr-emp-7',
        actor: this.getUserById('usr-emp-7')!,
        action: 'submitted_for_review',
        details: 'Priya Patel submitted task to lead David Kim for review.',
        sourceTeamName: 'Team Paper',
        createdAt: '2026-10-17T16:00:00.000Z',
      },
      {
        id: 'act-7',
        taskId: 'tsk-105',
        taskTitle: 'Refactor OAuth token rotation and CSRF protection headers',
        actorId: 'usr-emp-11',
        actor: this.getUserById('usr-emp-11')!,
        action: 'task_resolved',
        details: 'Emily Zhao approved submission and marked task Resolved.',
        sourceTeamName: 'Team Nexus',
        createdAt: '2026-10-14T17:30:00.000Z',
      },
      {
        id: 'act-8',
        taskId: 'tsk-old-rej',
        taskTitle: 'Direct database replica dump to external AWS S3 bucket',
        actorId: 'usr-emp-11',
        actor: this.getUserById('usr-emp-11')!,
        action: 'cross_team_rejected',
        details: 'Rejected cross-team request from Team Rock: Violates compliance policy Sec-402.',
        sourceTeamName: 'Team Rock',
        destinationTeamName: 'Team Nexus',
        createdAt: '2026-10-11T12:00:00.000Z',
      },
    ];
  }

  public getUserById(id: string): User | undefined {
    const user = this.users.find(u => u.id === id);
    if (!user) return undefined;
    const { passwordHash, ...rest } = user;
    return rest;
  }

  public getUserByEmail(email: string): StoredUser | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public updateUserAvatar(id: string, avatar: string): StoredUser | undefined {
    const user = this.users.find(u => u.id === id);
    if (!user) return undefined;
    user.avatar = avatar;
    // Synchronize avatar reference across teams and tasks
    for (const team of this.teams) {
      if (team.lead && team.lead.id === id) {
        team.lead.avatar = avatar;
      }
      team.members = team.members.map(m => (m.id === id ? { ...m, avatar } : m));
    }
    for (const task of this.tasks) {
      if (task.creator && task.creator.id === id) task.creator.avatar = avatar;
      if (task.assignee && task.assignee.id === id) task.assignee.avatar = avatar;
    }
    return user;
  }

  public grantBadge(userId: string, badge: { title: string; icon: string; reason: string; grantedBy: string }): User | undefined {
    const user = this.users.find(u => u.id === userId);
    if (!user) return undefined;
    if (!user.customBadges) user.customBadges = [];
    const newBadge = {
      ...badge,
      id: `bdg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      grantedAt: new Date().toISOString(),
    };
    user.customBadges.push(newBadge);
    return this.getUserById(userId);
  }

  public getTeamsLeading(userId: string): Team[] {
    return this.teams.filter(t => t.leadId === userId).map(t => this.enrichTeam(t));
  }

  public getTeamsMemberOf(userId: string): Team[] {
    return this.teams.filter(t => t.memberIds.includes(userId)).map(t => this.enrichTeam(t));
  }

  public enrichTeam(team: Team): Team {
    const teamTasks = this.tasks.filter(t => t.sourceTeamId === team.id || t.destinationTeamId === team.id);
    const total = teamTasks.length;
    const resolved = teamTasks.filter(t => t.status === 'Resolved').length;
    const closed = teamTasks.filter(t => t.status === 'Closed').length;
    const inProgress = teamTasks.filter(t => t.status === 'In Progress').length;
    const awaitingApproval = teamTasks.filter(t => t.status === 'Awaiting Approval').length;
    const newTasks = teamTasks.filter(t => t.status === 'New').length;
    const ongoing = inProgress + awaitingApproval + teamTasks.filter(t => t.status === 'Assigned').length;
    const incomplete = total - (resolved + closed);

    return {
      ...team,
      lead: this.getUserById(team.leadId)!,
      members: team.memberIds.map(id => this.getUserById(id)!),
      taskStats: {
        total,
        new: newTasks,
        inProgress,
        awaitingApproval,
        resolved,
        closed,
        ongoing,
        incomplete,
      },
    };
  }

  public logActivity(activity: Omit<ActivityLog, 'id' | 'createdAt'>): ActivityLog {
    const log: ActivityLog = {
      ...activity,
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    this.activities.unshift(log);
    return log;
  }
}

export const db = new NetwoniteDatabase();
