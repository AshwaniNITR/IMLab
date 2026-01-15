import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY!);

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify(token, secret, {
    algorithms: ['HS256'],
    issuer: 'isdl-nitrkl',
    audience: 'isdl-admin',
  });

  if (!payload.isAdmin) {
    throw new Error('Not an admin');
  }

  return payload;
}
