// Importer directement les modèles depuis leur fichier (ou depuis index.js)
const Etablissement = require('../../database/models/etablissement.model');
const Departement = require('../../database/models/departement.model');
const Niveau = require('../../database/models/niveau.model');
const UE = require('../../database/models/ue.model');
const Annee = require('../../database/models/annee.model');
const Enseignant = require('../../database/models/enseignant.model');

// ------------------- ETABLISSEMENTS -------------------
const getAllEtablissements = async () => {
  return await Etablissement.findAll();
};

const getEtablissementById = async (id) => {
  return await Etablissement.findByPk(id);
};

const createEtablissement = async (data) => {
  return await Etablissement.create(data);
};

const updateEtablissement = async (id, data) => {
  const etab = await Etablissement.findByPk(id);
  if (!etab) return null;
  return await etab.update(data);
};

const deleteEtablissement = async (id) => {
  const etab = await Etablissement.findByPk(id);
  if (!etab) return null;
  await etab.destroy();
  return true;
};

// ------------------- DEPARTEMENTS -------------------
const getAllDepartements = async () => {
  return await Departement.findAll();
};

const getDepartementById = async (id) => {
  return await Departement.findByPk(id);
};

const createDepartement = async (data) => {
  // Vérifier que l'établissement parent existe
  if (data.id_etablissement) {
    const etab = await Etablissement.findByPk(data.id_etablissement);
    if (!etab) throw new Error('Établissement parent introuvable');
  }
  return await Departement.create(data);
};

const updateDepartement = async (id, data) => {
  const dept = await Departement.findByPk(id);
  if (!dept) return null;
  return await dept.update(data);
};

const deleteDepartement = async (id) => {
  const dept = await Departement.findByPk(id);
  if (!dept) return null;
  await dept.destroy();
  return true;
};

// ------------------- NIVEAUX -------------------
const getAllNiveaux = async () => {
  return await Niveau.findAll();
};

const getNiveauById = async (id) => {
  return await Niveau.findByPk(id);
};

const createNiveau = async (data) => {
  if (data.id_departement) {
    const dept = await Departement.findByPk(data.id_departement);
    if (!dept) throw new Error('Département parent introuvable');
  }
  return await Niveau.create(data);
};

const updateNiveau = async (id, data) => {
  const niveau = await Niveau.findByPk(id);
  if (!niveau) return null;
  return await niveau.update(data);
};

const deleteNiveau = async (id) => {
  const niveau = await Niveau.findByPk(id);
  if (!niveau) return null;
  await niveau.destroy();
  return true;
};

// ------------------- UE -------------------
const getAllUEs = async () => {
  return await UE.findAll();
};

const getUEById = async (id) => {
  return await UE.findByPk(id);
};

const createUE = async (data) => {
  if (data.id_niveau) {
    const niveau = await Niveau.findByPk(data.id_niveau);
    if (!niveau) throw new Error('Niveau parent introuvable');
  }
  return await UE.create(data);
};

const updateUE = async (id, data) => {
  const ue = await UE.findByPk(id);
  if (!ue) return null;
  return await ue.update(data);
};

const deleteUE = async (id) => {
  const ue = await UE.findByPk(id);
  if (!ue) return null;
  await ue.destroy();
  return true;
};

// ------------------- ANNÉES ACADÉMIQUES -------------------
const getAllAnnees = async () => {
  return await Annee.findAll();
};

const getAnneeById = async (id) => {
  return await Annee.findByPk(id);
};

const createAnnee = async (data) => {
  return await Annee.create(data);
};

const updateAnnee = async (id, data) => {
  const annee = await Annee.findByPk(id);
  if (!annee) return null;
  return await annee.update(data);
};

const deleteAnnee = async (id) => {
  const annee = await Annee.findByPk(id);
  if (!annee) return null;
  await annee.destroy();
  return true;
};

// ------------------- ENSEIGNANTS -------------------
const getAllEnseignants = async () => {
  return await Enseignant.findAll();
};

const getEnseignantById = async (id) => {
  return await Enseignant.findByPk(id);
};

const createEnseignant = async (data) => {
  return await Enseignant.create(data);
};

const updateEnseignant = async (id, data) => {
  const ens = await Enseignant.findByPk(id);
  if (!ens) return null;
  return await ens.update(data);
};

const deleteEnseignant = async (id) => {
  const ens = await Enseignant.findByPk(id);
  if (!ens) return null;
  await ens.destroy();
  return true;
};

module.exports = {
  getAllEtablissements,
  getEtablissementById,
  createEtablissement,
  updateEtablissement,
  deleteEtablissement,
  getAllDepartements,
  getDepartementById,
  createDepartement,
  updateDepartement,
  deleteDepartement,
  getAllNiveaux,
  getNiveauById,
  createNiveau,
  updateNiveau,
  deleteNiveau,
  getAllUEs,
  getUEById,
  createUE,
  updateUE,
  deleteUE,
  getAllAnnees,
  getAnneeById,
  createAnnee,
  updateAnnee,
  deleteAnnee,
  getAllEnseignants,
  getEnseignantById,
  createEnseignant,
  updateEnseignant,
  deleteEnseignant,
};