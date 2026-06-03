import client from './client';

export const downloadReleve = (etudiantId: number, session?: string) => {
  let url = `/reporting/releve/${etudiantId}`;
  if (session) url += `?session=${session}`;
  return client.get(url, { responseType: 'blob' }); // pour téléchargement PDF
};