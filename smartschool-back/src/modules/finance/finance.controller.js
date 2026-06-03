// const { Status } = require("./Cam.service");
// const { createCharge } = require("./Cam.service");
// const { PayerTranche} = require("../../database/models/payerTranche.model");
// const { tranche } = require("../../database/models/tranche.model");



// const getstatus = async (req, res) => {
//   const {reference} = req.body;

//   try{
//     const result = await Status(reference);
//     return res.status(200).json({
//       success:true,
//       data: result
//     })
//   }catch(error){
//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message: error?.response?.data || error.message || "Erreur interne"
//     });
//   }
// }

// module.exports = {
//   createGatewayCharge,
//   getstatus
// };


const axios = require("axios");
const sequelize = require("../../config/database");

const { Status, createCharge } = require("./Cam.service");

const PayerTranche = require("../../database/models/payerTranche.model");
const Tranche = require("../../database/models/tranche.model");



/**
 * Création d'une demande de paiement CAM
 */
const createGatewayCharge = async (req, res) => {
  console.log("Création d'une demande de paiement CAM avec les données :", req.body);
  try {
    const { matricule, amount, customer_phone } = req.body;

    if (!matricule || !amount || !customer_phone) {
      return res.status(400).json({
        success: false,
        message: "matricule, amount et customer_phone sont requis",
      });
    }

    const result = await createCharge({
      amount,
      customer_phone,
    });

    return res.status(200).json({
      success: true,
      data: {
        matricule,
        ...result,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error?.response?.data ||
        error.message ||
        "Erreur interne du serveur",
    });
  }
};

/**
 * Vérifier le statut d'un paiement CAM
 */
const getstatus = async (req, res) => {
  const { reference } = req.query;

  try {
    const result = await Status(reference);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error?.response?.data ||
        error.message ||
        "Erreur interne",
    });
  }
};

/**
 * Validation et enregistrement du paiement
 */
const validatePayment = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      reference,
      matricule,
      id_tranche,
      montant_verse,
      mode_paiement,
    } = req.body;

    // =========================
    // Validation des paramètres
    // =========================

    if (
      !reference ||
      !matricule ||
      !id_tranche ||
      !montant_verse ||
      !mode_paiement
    ) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message:
          "reference, matricule, id_tranche, montant_verse et mode_paiement sont requis",
      });
    }

    if (montant_verse <= 0) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Le montant doit être supérieur à zéro",
      });
    }

    // =========================
    // Vérification CAM
    // =========================

    const paymentStatus = await Status(reference);

    if (
      paymentStatus.status !== "SUCCESS" &&
      paymentStatus.status !== "SUCCESSFUL"
    ) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Le paiement n'a pas été validé",
        status: paymentStatus.status,
      });
    }

    // =========================
    // Recherche de l'étudiant
    // =========================

    const response = await axios.get(
      `http://localhost:5000/api/scolarite/etudiant/matricule/${matricule}`
    );

    const etudiant = response.data;

    if (!etudiant) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Étudiant introuvable",
      });
    }

    if (!etudiant.id_inscription) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Aucune inscription trouvée pour cet étudiant",
      });
    }

    // =========================
    // Vérification tranche
    // =========================

    const tranche = await Tranche.findByPk(id_tranche);

    if (!tranche) {
      await transaction.rollback();

      return res.status(404).json({
        success: false,
        message: "Tranche introuvable",
      });
    }

    // =========================
    // Vérification doublon
    // =========================

    const existingPayment = await PayerTranche.findOne({
      where: {
        id_inscription: etudiant.id_inscription,
        id_tranche,
      },
      transaction,
    });

    if (existingPayment) {
      await transaction.rollback();

      return res.status(409).json({
        success: false,
        message: "Cette tranche a déjà été payée",
      });
    }

    // =========================
    // Vérification montant
    // =========================

    if (montant_verse < tranche.montant_exigible) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: `Le montant minimum attendu est ${tranche.montant_exigible} FCFA`,
      });
    }

    // =========================
    // Enregistrement
    // =========================

    const paiement = await PayerTranche.create(
      {
        id_inscription: etudiant.id_inscription,
        id_tranche,
        date_paiement: new Date(),
        montant_verse,
        mode_paiement,
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: "Paiement enregistré avec succès",
      data: paiement,
    });
  } catch (error) {
    await transaction.rollback();

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Erreur interne du serveur",
    });
  }
};

module.exports = {
  createGatewayCharge,
  getstatus,
  validatePayment,
};