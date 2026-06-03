const axios = require('axios');
const { PayerTranche, Tranche, Inscription, Etudiant } = require('../../database/models');

const CAMPAY_BASE_URL = process.env.CAMPAY_BASE_URL || 'https://demo.campay.net/api';
const CAMPAY_API_KEY = process.env.CAMPAY_API_KEY;

exports.initierPaiement = async (matricule, amount, customer_phone, id_tranche) => {
  const etudiant = await Etudiant.findOne({ where: { matricule } });
  if (!etudiant) throw new Error('Étudiant introuvable');

  const tranche = await Tranche.findByPk(id_tranche);
  if (!tranche) throw new Error('Tranche introuvable');

  const inscription = await Inscription.findOne({
    where: { id_etudiant: etudiant.id_etudiant },
    order: [['date_inscription', 'DESC']]
  });
  if (!inscription) throw new Error('Aucune inscription trouvée');

  const external_reference = `SMARTSCHOOL_${Date.now()}`;
  const response = await axios.post(
    `${CAMPAY_BASE_URL}/collect/`,
    {
      amount: String(amount),
      currency: 'XAF',
      from: customer_phone,
      description: `Paiement tranche ${tranche.libelle_tranche || id_tranche} - ${matricule}`,
      external_reference
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${CAMPAY_API_KEY}`
      }
    }
  );

  const camPayReference = response.data.reference;
  if (!camPayReference) throw new Error('CamPay n\'a pas retourné de référence');

  return { reference: camPayReference, external_reference };
};

exports.verifierStatutPaiement = async (reference) => {
  const response = await axios.get(
    `${CAMPAY_BASE_URL}/transaction/${reference}/`,
    { headers: { Authorization: `Token ${CAMPAY_API_KEY}` } }
  );
  return response.data;
};

exports.validerPaiement = async (reference, matricule, id_tranche, montant_verse, mode_paiement) => {
  const etudiant = await Etudiant.findOne({ where: { matricule } });
  if (!etudiant) throw new Error('Étudiant introuvable');

  const inscription = await Inscription.findOne({
    where: { id_etudiant: etudiant.id_etudiant },
    order: [['date_inscription', 'DESC']]
  });
  if (!inscription) throw new Error('Inscription introuvable');

  const existing = await PayerTranche.findOne({
    where: { id_inscription: inscription.id_inscription, id_tranche }
  });
  if (existing) throw new Error('Cette tranche a déjà été payée');

  const payerTranche = await PayerTranche.create({
    id_inscription: inscription.id_inscription,
    id_tranche,
    montant_verse,
    date_paiement: new Date(),
    mode_paiement,
    reference_paiement: reference
  });

  // Mettre à jour le statut global d’inscription si toutes les tranches sont payées
  const toutesTranches = await Tranche.findAll();
  const tranchesPayees = await PayerTranche.findAll({
    where: { id_inscription: inscription.id_inscription }
  });
  if (toutesTranches.length === tranchesPayees.length) {
    await inscription.update({ statut_paiement: true });
  }

  return payerTranche;
};