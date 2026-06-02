const adminService = require('./admin.service');

// ---------- ETABLISSEMENT ----------
exports.getAllEtablissements = async (req, res, next) => {
  try {
    const data = await adminService.getAllEtablissements();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getEtablissementById = async (req, res, next) => {
  try {
    const data = await adminService.getEtablissementById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Établissement non trouvé' });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.createEtablissement = async (req, res, next) => {
  try {
    const data = await adminService.createEtablissement(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

exports.updateEtablissement = async (req, res, next) => {
  try {
    const data = await adminService.updateEtablissement(req.params.id, req.body);
    if (!data) return res.status(404).json({ message: 'Établissement non trouvé' });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.deleteEtablissement = async (req, res, next) => {
  try {
    const deleted = await adminService.deleteEtablissement(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Établissement non trouvé' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// ---------- DEPARTEMENT ----------
exports.getAllDepartements = async (req, res, next) => {
  try {
    const data = await adminService.getAllDepartements();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getDepartementById = async (req, res, next) => {
  try {
    const data = await adminService.getDepartementById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Département non trouvé' });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.createDepartement = async (req, res, next) => {
  try {
    const data = await adminService.createDepartement(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

exports.updateDepartement = async (req, res, next) => {
  try {
    const data = await adminService.updateDepartement(req.params.id, req.body);
    if (!data) return res.status(404).json({ message: 'Département non trouvé' });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.deleteDepartement = async (req, res, next) => {
  try {
    const deleted = await adminService.deleteDepartement(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Département non trouvé' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// ---------- NIVEAU ----------
exports.getAllNiveaux = async (req, res, next) => {
  try {
    const data = await adminService.getAllNiveaux();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getNiveauById = async (req, res, next) => {
  try {
    const data = await adminService.getNiveauById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Niveau non trouvé' });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.createNiveau = async (req, res, next) => {
  try {
    const data = await adminService.createNiveau(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

exports.updateNiveau = async (req, res, next) => {
  try {
    const data = await adminService.updateNiveau(req.params.id, req.body);
    if (!data) return res.status(404).json({ message: 'Niveau non trouvé' });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.deleteNiveau = async (req, res, next) => {
  try {
    const deleted = await adminService.deleteNiveau(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Niveau non trouvé' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// ---------- UE ----------
exports.getAllUEs = async (req, res, next) => {
  try {
    const data = await adminService.getAllUEs();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getUEById = async (req, res, next) => {
  try {
    const data = await adminService.getUEById(req.params.id);
    if (!data) return res.status(404).json({ message: 'UE non trouvée' });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.createUE = async (req, res, next) => {
  try {
    const data = await adminService.createUE(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

exports.updateUE = async (req, res, next) => {
  try {
    const data = await adminService.updateUE(req.params.id, req.body);
    if (!data) return res.status(404).json({ message: 'UE non trouvée' });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.deleteUE = async (req, res, next) => {
  try {
    const deleted = await adminService.deleteUE(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'UE non trouvée' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// ---------- ANNEE ACADEMIQUE ----------
exports.getAllAnnees = async (req, res, next) => {
  try {
    const data = await adminService.getAllAnnees();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getAnneeById = async (req, res, next) => {
  try {
    const data = await adminService.getAnneeById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Année non trouvée' });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.createAnnee = async (req, res, next) => {
  try {
    const data = await adminService.createAnnee(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

exports.updateAnnee = async (req, res, next) => {
  try {
    const data = await adminService.updateAnnee(req.params.id, req.body);
    if (!data) return res.status(404).json({ message: 'Année non trouvée' });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.deleteAnnee = async (req, res, next) => {
  try {
    const deleted = await adminService.deleteAnnee(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Année non trouvée' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// ---------- ENSEIGNANT ----------
exports.getAllEnseignants = async (req, res, next) => {
  try {
    const data = await adminService.getAllEnseignants();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getEnseignantById = async (req, res, next) => {
  try {
    const data = await adminService.getEnseignantById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Enseignant non trouvé' });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.createEnseignant = async (req, res, next) => {
  try {
    const data = await adminService.createEnseignant(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

exports.updateEnseignant = async (req, res, next) => {
  try {
    const data = await adminService.updateEnseignant(req.params.id, req.body);
    if (!data) return res.status(404).json({ message: 'Enseignant non trouvé' });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.deleteEnseignant = async (req, res, next) => {
  try {
    const deleted = await adminService.deleteEnseignant(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Enseignant non trouvé' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};