import fetch from 'node-fetch';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3000';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ error: 'unauthorized', message: 'Invalid or missing authentication token' });

  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/get-token`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Token verification failed');
    }

    const data = await response.json();
    req.user = {
      userId: data.userId,
      email: data.email
    };
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    if (error.message === 'Token verification failed') {
      return res.status(403).json({ error: 'forbidden', message: 'Token verification failed' });
    } else if (error.name === 'FetchError') {
      return res.status(500).json({ error: 'auth_service_unavailable', message: 'Unable to reach authentication service' });
    } else {
      return res.status(500).json({ error: 'internal_server_error', message: 'An unexpected error occurred during authentication' });
    }
  }
};

