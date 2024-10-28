import type { User } from '$lib/types/';

const API_URL = '/api'; // This should be a relative URL

export async function registerUser(email: string, password: string, passwordConfirm: string, name: string, role: string): Promise<User> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, passwordConfirm, name, role }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Registration failed');
  }

  return response.json();
}
export async function loginUser(email: string, password: string): Promise<{ user: User }> {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }
  
    return response.json();
  }
  