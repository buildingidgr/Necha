import fetch from 'node-fetch';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3000';

export async function getToken(clerkToken) {
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/get-token`, {
      headers: {
        'Authorization': `Bearer ${clerkToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get token from auth service');
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error fetching token:', error);
    throw error;
  }
}

