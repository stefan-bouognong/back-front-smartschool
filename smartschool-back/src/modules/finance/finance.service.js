const axios = require('axios');
const { Etudiant, Inscription, PayerTranche, Tranche } = require('../../database/models');

const CAMPAY_BASE_URL = process.env.CAMPAY_BASE_URL || 'https://demo.campay.net/api';
const CAMPAY_API_KEY = process.env.CAMPAY_API_KEY;

class BusinessError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

const getInscriptionEtudiant = async (matricule) => {
  const etudiant = await Etudiant.findOne({ where: { matricule } });
  if (!etudiant) throw new BusinessError('Étudiant introuvable');

  const inscription = await Inscription.findOne({
    where: { id_etudiant: etudiant.id_etudiant },
    order: [['date_inscription', 'DESC']]
  });
  if (!inscription) throw new BusinessError('Aucune inscription trouvée');

  return { etudiant, inscription };
};

const verifierEligibilitePaiement = async (matricule, id_tranche) => {
  const trancheId = Number(id_tranche);
  if (![1, 2].includes(trancheId)) throw new BusinessError('Tranche invalide');

  const tranche = await Tranche.findByPk(trancheId);
  if (!tranche) throw new BusinessError('Tranche introuvable');

  const { inscription } = await getInscriptionEtudiant(matricule);

  const existing = await PayerTranche.findOne({
    where: { id_inscription: inscription.id_inscription, id_tranche: trancheId }
  });
  if (existing) throw new BusinessError('Cette tranche a déjà été payée');

  if (trancheId === 2) {
    const premierePayee = await PayerTranche.findOne({
      where: { id_inscription: inscription.id_inscription, id_tranche: 1 }
    });
    if (!premierePayee) throw new BusinessError('Vous devez d’abord payer la première tranche');
  }

  return { inscription, tranche, trancheId };
};

exports.initierPaiement = async (matricule, amount, customer_phone, id_tranche) => {
  const { inscription, tranche } = await verifierEligibilitePaiement(matricule, id_tranche);

  const external_reference = `SMARTSCHOOL_${Date.now()}`;
  const response = await axios.post(
    `${CAMPAY_BASE_URL}/collect/`,
    {
      amount: String(amount),
      currency: 'XAF',
      from: customer_phone,
      description: `Paiement tranche ${tranche.libelle_tranche} - ${matricule}`,
      external_reference
    },
    {
      headers: { 'Content-Type': 'application/json', Authorization: `Token ${CAMPAY_API_KEY}` },
      timeout: 15000
    }
  );
  return { reference: response.data.reference, external_reference, id_inscription: inscription.id_inscription };
};

exports.verifierStatutPaiement = async (reference) => {
  const response = await axios.get(`${CAMPAY_BASE_URL}/transaction/${reference}/`, {
    headers: { Authorization: `Token ${CAMPAY_API_KEY}` }
  });
  return response.data;
};

exports.validerPaiement = async (reference, matricule, id_tranche, montant_verse, mode_paiement) => {
  if (!matricule || !id_tranche || !montant_verse) {
    throw new BusinessError('Paramètres manquants pour validation');
  }

  const { inscription, trancheId } = await verifierEligibilitePaiement(matricule, id_tranche);

  await PayerTranche.create({
    id_inscription: inscription.id_inscription,
    id_tranche: trancheId,
    montant_verse: parseFloat(montant_verse),
    date_paiement: new Date(),
    mode_paiement
  });

  if (trancheId === 2) {
    await inscription.update({ statut_paiement: true });
  }

  return { message: 'Paiement validé', totalPaye: trancheId === 2 };
};

exports.BusinessError = BusinessError;
