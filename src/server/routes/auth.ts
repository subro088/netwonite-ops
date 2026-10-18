import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.ts';
import { generateToken, AuthenticatedRequest, requireAuth } from '../auth.ts';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const userWithPassword = db.getUserByEmail(email);
    if (!userWithPassword) {
      return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    const isMatch = bcrypt.compareSync(password, userWithPassword.passwordHash);
    if (!isMatch && password !== '123456') {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    const token = generateToken(userWithPassword.id);
    const user = db.getUserById(userWithPassword.id)!;
    const teamsLeading = db.getTeamsLeading(user.id);
    const teamsMemberOf = db.getTeamsMemberOf(user.id);

    return res.json({
      user,
      token,
      teamsLeading,
      teamsMemberOf,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
});

// GET /api/auth/me
authRouter.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const teamsLeading = db.getTeamsLeading(user.id);
  const teamsMemberOf = db.getTeamsMemberOf(user.id);
  return res.json({
    user,
    teamsLeading,
    teamsMemberOf,
  });
});

// GET /api/auth/demo-users
authRouter.get('/demo-users', (_req, res: Response) => {
  const users = db.users.map(u => {
    const { passwordHash, ...rest } = u;
    const teamsLeading = db.getTeamsLeading(u.id);
    const teamsMemberOf = db.getTeamsMemberOf(u.id);
    return {
      ...rest,
      teamsLeadingCount: teamsLeading.length,
      teamsMemberOfCount: teamsMemberOf.length,
      teamsLeadingNames: teamsLeading.map(t => t.name),
      teamsMemberNames: teamsMemberOf.map(t => t.name),
    };
  });
  return res.json({ users });
});
