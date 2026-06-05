import client from './client';

export interface Etudiant {
  id_etudiant: number;
  matricule: string;
  nom_etud: string;
  prenom_etud: string;
  email: string;
  date_naissance?: string;
  Inscriptions?: Inscription[];
}

export interface Niveau {
  id_niveau: number;
  libelle_niveau: string;
  id_departement: number;
  Departement?: { nom_dept: string };
}

export interface AnneeAcademique {
  id_annee: number;
  libelle_annee: string;
}

export interface PayerTranche {
  id_inscription: number;
  id_tranche: number;
  date_paiement: string;
  montant_verse: number;
  mode_paiement: string;
  Tranche?: { id_tranche: number; libelle_tranche: string };
}

export interface Inscription {
  id_inscription: number;
  date_inscription: string;
  statut_paiement: boolean;
  id_etudiant: number;
  id_annee: number;
  id_niveau: number;
  Etudiant?: Etudiant;
  Niveau?: Niveau;
  Annee?: AnneeAcademique;
  PayerTranches?: PayerTranche[];
}

export interface CreateInscriptionData {
  nom: string;
  prenom: string;
  email: string;
  filiere: string;
  niveau: string;
  anneeLibelle?: string;
  date_naissance?: string;
}

export const createInscription = (data: CreateInscriptionData) =>
  client.post<Inscription>('/scolarite/inscription', data);

export const getAllInscriptions = (params?: { niveau?: string; filiere?: string }) =>
  client.get<{ total: number; data: Inscription[] }>('/scolarite/inscriptions', { params });

export const getInscriptionById = (id: number) =>
  client.get<{ data: Inscription }>(`/scolarite/inscription/${id}`);

export const deleteInscription = (id: number) =>
  client.delete(`/scolarite/inscription/${id}`);

export const getAllEtudiants = () => client.get<Etudiant[]>('/scolarite/etudiants');