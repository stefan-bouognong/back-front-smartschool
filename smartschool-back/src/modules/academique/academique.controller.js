const service = require('./academique.service');

exports.creerUE = async (req, res) => {
  try {
    const ueCree = await service.creerUE(req.body);
    res.status(201).json(ueCree);
  } catch (err) {
    res.status(400).json({ erreur: err.message });
  }
};

exports.listerUEs = async (req, res) => {
  try {
    const ues = await service.obtenirToutesUEs();
    res.json(ues);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
};

exports.obtenirUEParId = async (req, res) => {
  try {
    const ue = await service.obtenirUEParId(req.params.id);
    if (!ue) {
      return res.status(404).json({ message: 'UE introuvable' });
    }
    res.json(ue);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
};

exports.creerNote = async (req, res) => {
  try {
    const donneesNote = {
      ...req.body,
      id_enseignant: req.user.id_enseignant || req.body.id_enseignant
    };
    const noteCree = await service.creerNote(donneesNote);
    res.status(201).json(noteCree);
  } catch (err) {
    res.status(400).json({ erreur: err.message });
  }
};

exports.listerNotes = async (req, res) => {
  try {
    const filtres = {
      id_inscription: req.params.id_inscription || req.query.id_inscription,
      id_UE: req.params.id_UE || req.query.id_UE,
      id_enseignant: req.query.id_enseignant
    };
    const notes = await service.obtenirNotes(filtres);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
};

exports.obtenirNoteParId = async (req, res) => {
  try {
    const note = await service.obtenirNoteParId(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note introuvable' });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
};

exports.listerNotesPourEnseignant = async (req, res) => {
  try {
    const idEnseignant = req.user.id_enseignant;
    if (!idEnseignant) {
      return res.status(403).json({ message: 'Accès réservé aux enseignants' });
    }

    const notes = await service.obtenirNotesPourEnseignant(idEnseignant);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
};

exports.obtenirMoyennePourInscription = async (req, res) => {
  try {
    const moyenne = await service.obtenirMoyennePourInscription(req.params.id_inscription);
    if (moyenne === null) {
      return res.status(404).json({ message: 'Aucune note trouvée pour cette inscription' });
    }
    res.json({ moyenne });
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
};

exports.obtenirMoyennePourUE = async (req, res) => {
  try {
    const moyenne = await service.obtenirMoyennePourUE(req.params.id_UE);
    if (moyenne === null) {
      return res.status(404).json({ message: 'Aucune note trouvée pour cette UE' });
    }
    res.json({ moyenne });
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
};
