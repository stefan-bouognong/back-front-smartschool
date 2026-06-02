const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');

// ---------- ETABLISSEMENTS ----------
router.get('/etablissements', adminController.getAllEtablissements);
router.get('/etablissements/:id', adminController.getEtablissementById);
router.post('/etablissements', adminController.createEtablissement);
router.put('/etablissements/:id', adminController.updateEtablissement);
router.delete('/etablissements/:id', adminController.deleteEtablissement);

// ---------- DEPARTEMENTS ----------
router.get('/departements', adminController.getAllDepartements);
router.get('/departements/:id', adminController.getDepartementById);
router.post('/departements', adminController.createDepartement);
router.put('/departements/:id', adminController.updateDepartement);
router.delete('/departements/:id', adminController.deleteDepartement);

// ---------- NIVEAUX ----------
router.get('/niveaux', adminController.getAllNiveaux);
router.get('/niveaux/:id', adminController.getNiveauById);
router.post('/niveaux', adminController.createNiveau);
router.put('/niveaux/:id', adminController.updateNiveau);
router.delete('/niveaux/:id', adminController.deleteNiveau);

// ---------- UNITES D'ENSEIGNEMENT ----------
router.get('/ues', adminController.getAllUEs);
router.get('/ues/:id', adminController.getUEById);
router.post('/ues', adminController.createUE);
router.put('/ues/:id', adminController.updateUE);
router.delete('/ues/:id', adminController.deleteUE);

// ---------- ANNEES ACADEMIQUES ----------
router.get('/annees', adminController.getAllAnnees);
router.get('/annees/:id', adminController.getAnneeById);
router.post('/annees', adminController.createAnnee);
router.put('/annees/:id', adminController.updateAnnee);
router.delete('/annees/:id', adminController.deleteAnnee);

// ---------- ENSEIGNANTS ----------
router.get('/enseignants', adminController.getAllEnseignants);
router.get('/enseignants/:id', adminController.getEnseignantById);
router.post('/enseignants', adminController.createEnseignant);
router.put('/enseignants/:id', adminController.updateEnseignant);
router.delete('/enseignants/:id', adminController.deleteEnseignant);

module.exports = router;