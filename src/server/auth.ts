import { Request, Response, NextFunction } from 'express';
import { db } from './db.ts';
import { User, Team } from '../types/index.ts';

export interface AuthenticatedRequest extends Request {
  user?: User;
  teamsLeading?: Team[];
  teamsMemberOf?: Team[];
}

export function generateToken(userId: string): string {
  const payload = {
    sub: userId,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

export function parseToken(token: string): string | null {
  try {
    const raw = Buffer.from(token, 'base64url').toString('utf8');
    const parsed = JSON.parse(raw);
    if (parsed && parsed.sub) {
      return parsed.sub;
    }
    return null;
  } catch {
    return null;
  }
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.substring(7).trim();
  const userId = parseToken(token);
  if (userId) {
    const user = db.getUserById(userId);
    if (user) {
      req.user = user;
      req.teamsLeading = db.getTeamsLeading(userId);
      req.teamsMemberOf = db.getTeamsMemberOf(userId);
    }
  }
  next();
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }
  next();
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden. Administrator access required.' });
  }
  next();
}
