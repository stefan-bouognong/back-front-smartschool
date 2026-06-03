const { UE, Note, Inscription, Enseignant, Niveau, Etudiant, Utilisateur } = require('../../database/models');

/**
 * Helper : retrouve l'id de l'enseignant associé à un utilisateur.
 */
const getEnseignantFromUser = async (id_utilisateur) => {
  const user = await Utilisateur.findByPk(id_utilisateur, {
    include: [{ model: Enseignant, foreignKey: 'id_enseignant' }]
  });
  if (!user) throw new Error('Utilisateur introuvable');
  if (user.role !== 'ENSEIGNANT') throw new Error('Seul un enseignant peut saisir une note');
  if (!user.Enseignant) throw new Error('Cet utilisateur enseignant n\'est pas lié à un enseignant dans la base');
  return user.Enseignant.id_enseignant;
};

// ---------- UE ----------
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

// ---------- Notes ----------
exports.creerNote = async (donneesNote) => {
  let id_enseignant = donneesNote.id_enseignant;

  // Si l'id_enseignant n'est pas fourni, on le déduit de l'utilisateur connecté
  if (!id_enseignant && donneesNote.id_utilisateur) {
    id_enseignant = await getEnseignantFromUser(donneesNote.id_utilisateur);
  }

  if (!id_enseignant) {
    throw new Error('Impossible de déterminer l\'enseignant pour cette note');
  }

  if (donneesNote.valeur_note === undefined || donneesNote.valeur_note === null) {
    throw new Error('La valeur de la note est requise');
  }

  const valeurNote = Number(donneesNote.valeur_note);
  if (isNaN(valeurNote) || valeurNote < 0 || valeurNote > 20) {
    throw new Error('La note doit être un nombre entre 0 et 20');
  }

  if (!donneesNote.id_inscription || !donneesNote.id_UE) {
    throw new Error('id_inscription et id_UE sont requis');
  }

  return Note.create({
    valeur_note: valeurNote,
    session: donneesNote.session || null,
    date_examen: donneesNote.date_examen || new Date(),
    id_inscription: donneesNote.id_inscription,
    id_UE: donneesNote.id_UE,
    id_enseignant: id_enseignant
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

exports.obtenirMoyennePourUE = async (id_UE) => {
  const notes = await Note.findAll({ where: { id_UE } });
  if (!notes.length) return null;
  const somme = notes.reduce((acc, note) => acc + Number(note.valeur_note), 0);
  return Number((somme / notes.length).toFixed(2));
};

exports.obtenirNotesPourEnseignant = async (id_enseignant) => {
  return exports.obtenirNotes({ id_enseignant });
};