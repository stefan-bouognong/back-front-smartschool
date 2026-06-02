import client from './client';

// ========== Types ==========
export interface Etablissement {
  id_etablissement: number;
  nom_etablissement: string;
  adresse?: string;
  ville?: string;
  telephone?: string;
}

export interface Departement {
  id_departement: number;
  nom_dept: string;
  id_etablissement: number;
  Etablissement?: Etablissement;
}

export interface Niveau {
  id_niveau: number;
  libelle_niveau: string;
  id_departement: number;
  Departement?: Departement;
}

export interface UE {
  id_UE: number;
  code_UE: string;
  libelle_UE: string;
  credits_ECTS: number;
  id_niveau: number;
  Niveau?: Niveau;
}

export interface AnneeAcademique {
  id_annee: number;
  libelle_annee: string;
}

export interface Enseignant {
  id_enseignant: number;
  nom_ens: string;
  prenom_ens: string;
  specialite?: string;
  email?: string;
  telephone?: string;
}

// ========== Établissements ==========
export const getAllEtablissements = () => client.get<Etablissement[]>('/admin/etablissements');
export const getEtablissementById = (id: number) => client.get<Etablissement>(`/admin/etablissements/${id}`);
export const createEtablissement = (data: Partial<Etablissement>) => client.post<Etablissement>('/admin/etablissements', data);
export const updateEtablissement = (id: number, data: Partial<Etablissement>) => client.put<Etablissement>(`/admin/etablissements/${id}`, data);
export const deleteEtablissement = (id: number) => client.delete(`/admin/etablissements/${id}`);

// ========== Départements ==========
export const getAllDepartements = () => client.get<Departement[]>('/admin/departements');
export const getDepartementById = (id: number) => client.get<Departement>(`/admin/departements/${id}`);
export const createDepartement = (data: Partial<Departement>) => client.post<Departement>('/admin/departements', data);
export const updateDepartement = (id: number, data: Partial<Departement>) => client.put<Departement>(`/admin/departements/${id}`, data);
export const deleteDepartement = (id: number) => client.delete(`/admin/departements/${id}`);

// ========== Niveaux ==========
export const getAllNiveaux = () => client.get<Niveau[]>('/admin/niveaux');
export const getNiveauById = (id: number) => client.get<Niveau>(`/admin/niveaux/${id}`);
export const createNiveau = (data: Partial<Niveau>) => client.post<Niveau>('/admin/niveaux', data);
export const updateNiveau = (id: number, data: Partial<Niveau>) => client.put<Niveau>(`/admin/niveaux/${id}`, data);
export const deleteNiveau = (id: number) => client.delete(`/admin/niveaux/${id}`);

// ========== Unités d'Enseignement ==========
export const getAllUEs = () => client.get<UE[]>('/admin/ues');
export const getUEById = (id: number) => client.get<UE>(`/admin/ues/${id}`);
export const createUE = (data: Partial<UE>) => client.post<UE>('/admin/ues', data);
export const updateUE = (id: number, data: Partial<UE>) => client.put<UE>(`/admin/ues/${id}`, data);
export const deleteUE = (id: number) => client.delete(`/admin/ues/${id}`);

// ========== Années académiques ==========
export const getAllAnnees = () => client.get<AnneeAcademique[]>('/admin/annees');
export const getAnneeById = (id: number) => client.get<AnneeAcademique>(`/admin/annees/${id}`);
export const createAnnee = (data: Partial<AnneeAcademique>) => client.post<AnneeAcademique>('/admin/annees', data);
export const updateAnnee = (id: number, data: Partial<AnneeAcademique>) => client.put<AnneeAcademique>(`/admin/annees/${id}`, data);
export const deleteAnnee = (id: number) => client.delete(`/admin/annees/${id}`);

// ========== Enseignants ==========
export const getAllEnseignants = () => client.get<Enseignant[]>('/admin/enseignants');
export const getEnseignantById = (id: number) => client.get<Enseignant>(`/admin/enseignants/${id}`);
export const createEnseignant = (data: Partial<Enseignant>) => client.post<Enseignant>('/admin/enseignants', data);
export const updateEnseignant = (id: number, data: Partial<Enseignant>) => client.put<Enseignant>(`/admin/enseignants/${id}`, data);
export const deleteEnseignant = (id: number) => client.delete(`/admin/enseignants/${id}`);