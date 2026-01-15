import jwt from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
}

const SECRET = process.env.JWT_SECRET_KEY!;

export class JWT {
  static generateToken(payload: JwtPayload): string {
    if (!SECRET) {
      throw new Error('JWT_SECRET_KEY is missing');
    }

    return jwt.sign(payload, SECRET, {
      algorithm: 'HS256',        // 🔴 EXPLICIT
      expiresIn: '24h',
      issuer: 'isdl-nitrkl',
      audience: 'isdl-admin',
    });
  }

  // ❌ Do NOT use this in middleware
  static verifyToken(token: string): JwtPayload {
    return jwt.verify(token, SECRET, {
      issuer: 'isdl-nitrkl',
      audience: 'isdl-admin',
    }) as JwtPayload;
  }
}
