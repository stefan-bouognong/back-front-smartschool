const express = require('express');
// const { createGatewayChargeController } = require('./finance.controller');

const router = express.Router();

// router.post('/gateway-charges-router', createGatewayChargeController);

const { createGatewayCharge,getstatus,validatePayment} = require('./finance.controller');

router.post('/charge', createGatewayCharge);
router.get('/status', getstatus);
router.post("/validate", validatePayment);

module.exports = router;
