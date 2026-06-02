const express = require("express");
const reportingController = require("./reporting.controller");

const router = express.Router();

router.get("/releve/:etudiantId", reportingController.downloadReleve);
// router.get("/certificat/:etudiantId", reportingController.downloadCertificate);

module.exports = router;
