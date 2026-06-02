const reportingService = require("./reporting.service");
const pdfGenerator = require("../../utils/pdfGenerator");

async function downloadReleve(req, res) {
  try {
    const { etudiantId } = req.params;
    const { session } = req.query;
    const reportData = await reportingService.getReportingData(
      etudiantId,
      session,
    );

    if (!reportData.payments.isEligible) {
      return res.status(403).json({
        message:
          "Impression du relevé de notes bloquée : pension non payée au seuil requis.",
        payments: reportData.payments,
      });
    }

    return pdfGenerator.generateRelevePdf(reportData, res);
  } catch (error) {
    const status = error.status || 400;
    return res.status(status).json({
      message: error.message || "Erreur lors de la génération du relevé",
    });
  }
}

// async function downloadCertificate(req, res) {
//   try {
//     const { etudiantId } = req.params;
//     const { session } = req.query;
//     const reportData = await reportingService.getReportingData(
//       etudiantId,
//       session,
//     );
//     return pdfGenerator.generateCertificatePdf(reportData, res);
//   } catch (error) {
//     const status = error.status || 400;
//     return res.status(status).json({
//       message: error.message || "Erreur lors de la génération du certificat",
//     });
//   }
// }

module.exports = {
  downloadReleve,
  // downloadCertificate,
};
