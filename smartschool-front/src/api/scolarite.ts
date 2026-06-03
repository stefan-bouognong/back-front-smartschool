import client from './client';

// Types
export interface Etudiant {
  id_etudiant: number;
  nom_etud: string;
  prenom_etud: string;
  email: string;
}

export interface Niveau {
  id_niveau: number;
  libelle_niveau: string;
  id_departement: number;
  Departement?: {
    nom_dept: string;
  };
}

export interface AnneeAcademique {
  id_annee: number;
  libelle_annee: string;
}

export interface Inscription {
  id_inscription: number;
  matricule: string;
  date_inscription: string;
  statut_paiement: boolean;
  id_etudiant: number;
  id_annee: number;
  id_niveau: number;
  Etudiant?: Etudiant;
  Niveau?: Niveau;
  anne?: AnneeAcademique;
}

export interface CreateInscriptionData {
  nom: string;
  prenom: string;
  email: string;
  filiere: string;
  niveau: string;
  anneeLibelle?: string;
}

// API calls
export const createInscription = (data: CreateInscriptionData) =>
  client.post<Inscription>('/scolarite/inscription', data);

export const getAllInscriptions = (params?: { niveau?: string; filiere?: string }) =>
  client.get<{ total: number; data: Inscription[] }>('/scolarite/inscriptions', { params });

export const getInscriptionById = (id: number) =>
  client.get<{ data: Inscription }>(`/scolarite/inscription/${id}`);

export const deleteInscription = (id: number) =>
  client.delete(`/scolarite/inscription/${id}`);

export const getAllEtudiants = () => client.get<Etudiant[]>('/scolarite/etudiants');