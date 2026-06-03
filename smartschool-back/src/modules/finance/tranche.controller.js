const Tranche = require("../../database/models/tranche.model");

/**
 * Créer une tranche
 */
const createTranche = async (req, res) => {
  try {
    const {
      libelle_tranche,
      montant_exigible,
      date_limite,
    } = req.body;

    if (
      !libelle_tranche ||
      !montant_exigible ||
      !date_limite
    ) {
      return res.status(400).json({
        success: false,
        message:
          "libelle_tranche, montant_exigible et date_limite sont requis",
      });
    }

    const tranche = await Tranche.create({
      libelle_tranche,
      montant_exigible,
      date_limite,
    });

    return res.status(201).json({
      success: true,
      message: "Tranche créée avec succès",
      data: tranche,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Liste de toutes les tranches
 */
const getAllTranches = async (req, res) => {
  try {
    const tranches = await Tranche.findAll({
      order: [["id_tranche", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      count: tranches.length,
      data: tranches,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Récupérer une tranche par ID
 */
const getTrancheById = async (req, res) => {
  try {
    const { id } = req.params;

    const tranche = await Tranche.findByPk(id);

    if (!tranche) {
      return res.status(404).json({
        success: false,
        message: "Tranche introuvable",
      });
    }

    return res.status(200).json({
      success: true,
      data: tranche,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Modifier une tranche
 */
const updateTranche = async (req, res) => {
  try {
    const { id } = req.params;

    const tranche = await Tranche.findByPk(id);

    if (!tranche) {
      return res.status(404).json({
        success: false,
        message: "Tranche introuvable",
      });
    }

    const {
      libelle_tranche,
      montant_exigible,
      date_limite,
    } = req.body;

    await tranche.update({
      libelle_tranche:
        libelle_tranche ?? tranche.libelle_tranche,
      montant_exigible:
        montant_exigible ?? tranche.montant_exigible,
      date_limite:
        date_limite ?? tranche.date_limite,
    });

    return res.status(200).json({
      success: true,
      message: "Tranche modifiée avec succès",
      data: tranche,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Supprimer une tranche
 */
const deleteTranche = async (req, res) => {
  try {
    const { id } = req.params;

    const tranche = await Tranche.findByPk(id);

    if (!tranche) {
      return res.status(404).json({
        success: false,
        message: "Tranche introuvable",
      });
    }

    await tranche.destroy();

    return res.status(200).json({
      success: true,
      message: "Tranche supprimée avec succès",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTranche,
  getAllTranches,
  getTrancheById,
  updateTranche,
  deleteTranche,
};