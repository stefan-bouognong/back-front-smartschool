const express = require('express');
// const { createGatewayChargeController } = require('./finance.controller');

const router = express.Router();

// router.post('/gateway-charges-router', createGatewayChargeController);

const { createGatewayCharge,getstatus} = require('./finance.controller');

router.post('/charge', createGatewayCharge);
router.get('/status', getstatus);

module.exports = router;
