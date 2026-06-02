import client from './client';

export interface InscriptionData {
  nom: string;
  prenom: string;
  email: string;
  filiere: string;
  niveau: string;
  telephone?: string;
}

export const inscrireEtudiant = async (data: InscriptionData) => {
  const response = await client.post('/scolarite/inscription', data);
  return response.data;
};