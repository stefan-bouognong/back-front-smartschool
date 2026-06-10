const axios = require('axios');
const https = require('https');
const { Etudiant, Inscription, PayerTranche, Tranche } = require('../../database/models');

const httpsAgent = new https.Agent({ family: 4 });

const CAMPAY_BASE_URL = process.env.CAMPAY_BASE_URL || 'https://demo.campay.net/api';
const CAMPAY_API_KEY = process.env.CAMPAY_API_KEY;

class BusinessError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

/**
 * Normalise un numéro de téléphone camerounais au format international (237XXXXXXXXX).
 * Accepte : 237XXXXXXXXX, 6XXXXXXXX, 06XXXXXXXX
 * Opérateurs supportés : Orange (69x, 65x), MTN (67x, 68x, 650)
 */
const normaliserTelephone = (phone) => {
  if (!phone) throw new BusinessError('Numéro de téléphone requis');
  // Supprimer espaces, tirets, parenthèses
  let cleaned = String(phone).replace(/[\s\-\(\)\+]/g, '');
  // Si commence par 00237, remplacer par 237
  if (cleaned.startsWith('00237')) cleaned = '237' + cleaned.slice(5);
  // Si commence par 237 et a 12 chiffres → déjà au bon format
  if (/^237[0-9]{9}$/.test(cleaned)) return cleaned;
  // Si commence par 6 ou 5 et a 9 chiffres → ajouter 237
  if (/^[65][0-9]{8}$/.test(cleaned)) return '237' + cleaned;
  // Si commence par 06 ou 05 et a 10 chiffres → ajouter 237
  if (/^0[65][0-9]{8}$/.test(cleaned)) return '237' + cleaned.slice(1);
  throw new BusinessError(`Format de téléphone invalide : "${phone}". Utilisez le format 237XXXXXXXXX ou 6XXXXXXXXX`);
};

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

  // Normaliser le numéro (critique pour Orange Money)
  const phoneNormalized = normaliserTelephone(customer_phone);
  console.log(`[Finance] Initiation paiement pour ${phoneNormalized} (original: ${customer_phone})`);

  const external_reference = `SMARTSCHOOL_${Date.now()}`;
  const response = await axios.post(
    `${CAMPAY_BASE_URL}/collect/`,
    {
      amount: String(amount),
      currency: 'XAF',
      from: phoneNormalized,
      description: `Paiement tranche ${tranche.libelle_tranche} - ${matricule}`,
      external_reference
    },
    {
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Token ${CAMPAY_API_KEY}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 15000,
      httpsAgent
    }
  );

  console.log(`[Finance] CamPay collect response:`, response.data);
  return { reference: response.data.reference, external_reference, id_inscription: inscription.id_inscription, phone: phoneNormalized };
};

exports.verifierStatutPaiement = async (reference) => {
  const response = await axios.get(`${CAMPAY_BASE_URL}/transaction/${reference}/`, {
    headers: { 
      'Authorization': `Token ${CAMPAY_API_KEY}`,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    httpsAgent
  });
  console.log(`[Finance] Status check for ${reference}:`, JSON.stringify(response.data));
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
