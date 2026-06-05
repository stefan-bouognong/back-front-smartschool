const service = require('./finance.service');

const getStatusCode = (err) => err.statusCode || 500;

exports.createCharge = async (req, res) => {
  try {
    const { matricule, amount, customer_phone, id_tranche } = req.body;
    if (!matricule || !amount || !customer_phone || !id_tranche) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }
    const result = await service.initierPaiement(matricule, amount, customer_phone, id_tranche);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(getStatusCode(err)).json({ error: err.message });
  }
};

exports.checkStatus = async (req, res) => {
  try {
    const { reference } = req.query;
    if (!reference) return res.status(400).json({ error: 'Référence requise' });
    const statusData = await service.verifierStatutPaiement(reference);
    res.json(statusData);
  } catch (err) {
    res.status(getStatusCode(err)).json({ error: err.message });
  }
};

exports.validatePayment = async (req, res) => {
  try {
    const { reference, matricule, id_tranche, montant_verse, mode_paiement } = req.body;
    if (!reference || !matricule || !id_tranche || !montant_verse || !mode_paiement) {
      return res.status(400).json({ error: 'Champs manquants' });
    }
    const result = await service.validerPaiement(reference, matricule, id_tranche, montant_verse, mode_paiement);
    res.status(201).json(result);
  } catch (err) {
    res.status(getStatusCode(err)).json({ error: err.message });
  }
};
