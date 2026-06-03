import client from './client';

// ========== Types ==========
export interface UE {
  id_UE: number;
  code_UE: string;
  libelle_UE: string;
  credits_ECTS: number;
  id_niveau: number;
  Niveau?: { id_niveau: number; libelle_niveau: string };
}

export interface Note {
  id_note: number;
  valeur_note: number;
  session: string;
  date_examen: string;
  id_inscription: number;
  id_UE: number;
  id_enseignant: number;
  Inscription?: {
    Etudiant?: { id_etudiant: number; matricule: string; nom_etud: string; prenom_etud: string };
  };
  UE?: UE;
  Enseignant?: { id_enseignant: number; nom_ens: string; prenom_ens: string };
}

export interface CreateNoteData {
  valeur_note: number;
  session?: string;
  date_examen?: string;
  id_inscription: number;
  id_UE: number;
  id_enseignant?: number;
}

// ========== UE ==========
export const getAllUEs = () => client.get<UE[]>('/academique/ue');
export const getUEById = (id: number) => client.get<UE>(`/academique/ue/${id}`);
export const createUE = (data: Partial<UE>) => client.post<UE>('/academique/ue', data);

// ========== Notes ==========
export const getAllNotes = (params?: { id_inscription?: number; id_UE?: number; id_enseignant?: number }) =>
  client.get<Note[]>('/academique/notes', { params });

export const getNoteById = (id: number) => client.get<Note>(`/academique/notes/id/${id}`);
export const createNote = (data: CreateNoteData) => client.post<Note>('/academique/notes', data);

// Notes pour enseignant connecté
export const getNotesForEnseignant = () => client.get<Note[]>('/academique/notes/enseignant/me');

// ========== Moyennes ==========
export const getMoyenneByInscription = (id_inscription: number) =>
  client.get<{ moyenne: number }>(`/academique/moyenne/inscription/${id_inscription}`);

export const getMoyenneByUE = (id_UE: number) =>
  client.get<{ moyenne: number }>(`/academique/moyenne/ue/${id_UE}`);