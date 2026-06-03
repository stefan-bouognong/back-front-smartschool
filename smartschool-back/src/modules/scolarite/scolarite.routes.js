const express = require('express');
const controller = require('./scolarite.controller');
const router = express.Router();

router.post('/inscription', controller.inscrireEtudiant);
router.get('/inscriptions', controller.getAllInscriptions);
router.get('/inscription/:id', controller.getInscription);
router.delete('/inscription/:id', controller.deleteInscription);
router.get('/etudiant/matricule/:matricule', controller.getEtudiantByMatricule); // NOUVELLE ROUTE
router.get('/etudiants', controller.getAllEtudiants);

module.exports = router;