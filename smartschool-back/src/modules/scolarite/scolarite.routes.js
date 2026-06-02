const express =require('express');
const controller = require('./scolarite.controller');
const router = express.Router();
console.log("=== SCOLARITE ROUTES LOADED ===");
router.post('/inscription', controller.inscrireEtudiant);
router.get('/inscriptions',controller.getAllInscriptions);
router.get('/inscription/:id',controller.getInscription);
router.delete('/inscription/:id',controller.deleteInscription);
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Route test OK'
  });
});
module.exports = {
  router
};