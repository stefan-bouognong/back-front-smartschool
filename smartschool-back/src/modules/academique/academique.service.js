const { UE, Note, Inscription, Enseignant, Niveau, Etudiant } = require('../../database/models');

exports.creerUE = async (donneesUE) => {
  return UE.create(donneesUE);
};

exports.obtenirToutesUEs = async () => {
  return UE.findAll({
    include: [{ model: Niveau, attributes: ['id_niveau', 'libelle_niveau'] }],
    order: [['id_UE', 'ASC']]
  });
};

exports.obtenirUEParId = async (id) => {
  return UE.findByPk(id, {
    include: [{ model: Niveau, attributes: ['id_niveau', 'libelle_niveau'] }]
  });
};

exports.creerNote = async (donneesNote) => {
  if (donneesNote.valeur_note === undefined || donneesNote.valeur_note === null) {
    throw new Error('La valeur de la note est requise');
  }

  const valeurNote = Number(donneesNote.valeur_note);
  if (Number.isNaN(valeurNote) || valeurNote < 0 || valeurNote > 20) {
    throw new Error('La note doit être un nombre entre 0 et 20');
  }

  if (!donneesNote.id_inscription || !donneesNote.id_UE || !donneesNote.id_enseignant) {
    throw new Error('id_inscription, id_UE et id_enseignant sont requis');
  }

  return Note.create({
    valeur_note: valeurNote,
    session: donneesNote.session || null,
    date_examen: donneesNote.date_examen || new Date(),
    id_inscription: donneesNote.id_inscription,
    id_UE: donneesNote.id_UE,
    id_enseignant: donneesNote.id_enseignant
  });
};

exports.obtenirNotes = async (filtres = {}) => {
  const condition = {};
  if (filtres.id_inscription) condition.id_inscription = filtres.id_inscription;
  if (filtres.id_UE) condition.id_UE = filtres.id_UE;
  if (filtres.id_enseignant) condition.id_enseignant = filtres.id_enseignant;

  return Note.findAll({
    where: condition,
    include: [
      {
        model: Inscription,
        include: [{ model: Etudiant, attributes: ['id_etudiant', 'matricule', 'nom_etud', 'prenom_etud'] }]
      },
      { model: UE, attributes: ['id_UE', 'code_UE', 'libelle_UE', 'credits_ECTS'] },
      { model: Enseignant, attributes: ['id_enseignant', 'nom_ens', 'prenom_ens'] }
    ],
    order: [['date_examen', 'DESC']]
  });
};

exports.obtenirNoteParId = async (id) => {
  return Note.findByPk(id, {
    include: [
      {
        model: Inscription,
        include: [{ model: Etudiant, attributes: ['id_etudiant', 'matricule', 'nom_etud', 'prenom_etud'] }]
      },
      { model: UE, attributes: ['id_UE', 'code_UE', 'libelle_UE', 'credits_ECTS'] },
      { model: Enseignant, attributes: ['id_enseignant', 'nom_ens', 'prenom_ens'] }
    ]
  });
};

/*
exports.obtenirMoyennePourInscription = async (id_inscription) => {
  const notes = await Note.findAll({ where: { id_inscription } });
  if (!notes.length) {
    return null;
  }

  const somme = notes.reduce((acc, note) => acc + Number(note.valeur_note), 0);
  return Number((somme / notes.length).toFixed(2));
};
*/

exports.obtenirMoyennePourUE = async (id_UE) => {
  const notes = await Note.findAll({ where: { id_UE } });
  if (!notes.length) {
    return null;
  }

  const somme = notes.reduce((acc, note) => acc + Number(note.valeur_note), 0);
  return Number((somme / notes.length).toFixed(2));
};

exports.obtenirNotesPourEnseignant = async (id_enseignant) => {
  return exports.obtenirNotes({ id_enseignant });
};
