import { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify, createRemoteJWKSet } from 'jose';

const CLERK_ISSUER = process.env.CLERK_ISSUER;
const CLERK_JWK_ENDPOINT = `${CLERK_ISSUER}/.well-known/jwks.json`;

const jwks = createRemoteJWKSet(new URL(CLERK_JWK_ENDPOINT));

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    userId: string;
    email: string;
  };
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: NextApiResponse,
  next: () => void
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: CLERK_ISSUER,
    });

    req.user = {
      userId: payload.userId as string,
      email: payload.email as string,
    };

    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
}



