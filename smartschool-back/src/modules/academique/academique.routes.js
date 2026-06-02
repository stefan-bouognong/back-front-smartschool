const express = require('express');
const router = express.Router();
const controller = require('./academique.controller');
// const auth = require('../auth/auth.middleware');

// router.use(auth);

router.post('/ue', controller.creerUE);
router.get('/ue', controller.listerUEs);
router.get('/ue/:id', controller.obtenirUEParId);

router.post('/notes', controller.creerNote);
router.get('/notes', controller.listerNotes);
router.get('/notes/id/:id', controller.obtenirNoteParId);
router.get('/notes/inscription/:id_inscription', controller.listerNotes);
router.get('/notes/ue/:id_UE', controller.listerNotes);
router.get('/notes/enseignant/me', controller.listerNotesPourEnseignant);

router.get('/moyenne/inscription/:id_inscription', controller.obtenirMoyennePourInscription);
router.get('/moyenne/ue/:id_UE', controller.obtenirMoyennePourUE);

module.exports = router;
