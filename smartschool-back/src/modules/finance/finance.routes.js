const express = require('express');
const router = express.Router();
const controller = require('./finance.controller');


router.post('/charge', controller.createCharge);
router.get('/status', controller.checkStatus);
router.post('/validate', controller.validatePayment);
router.get('/receipt/:matricule', controller.downloadReceipt);

module.exports = router;