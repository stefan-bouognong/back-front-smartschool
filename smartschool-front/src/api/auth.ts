import client from './client';

export interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  mot_de_passe: string;
  role: 'ADMIN' | 'ENSEIGNANT';
  id_enseignant?: number | null;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
}

export interface LoginResponse extends User {
  token: string;
}

export const register = async (data: RegisterData): Promise<User> => {
  const response = await client.post('/auth/register', data);
  return response.data;
};

export const login = async (data: LoginData): Promise<LoginResponse> => {
  const response = await client.post('/auth/login', data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await client.post('/auth/logout');
};