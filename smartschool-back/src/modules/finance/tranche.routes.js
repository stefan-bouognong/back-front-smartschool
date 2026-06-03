const express = require("express");

const router = express.Router();

const {
  createTranche,
  getAllTranches,
  getTrancheById,
  updateTranche,
  deleteTranche,
} = require("./tranche.controller");

// Créer une tranche
router.post("/", createTranche);

// Liste des tranches
router.get("/", getAllTranches);

// Une tranche par ID
router.get("/:id", getTrancheById);

// Modifier une tranche
router.put("/:id", updateTranche);

// Supprimer une tranche
router.delete("/:id", deleteTranche);

module.exports = router;