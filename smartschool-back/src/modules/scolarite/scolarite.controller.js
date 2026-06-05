const service = require('./scolarite.service');
const { Etudiant, Inscription, Niveau, Annee, PayerTranche, Tranche, Departement } = require('../../database/models');

exports.inscrireEtudiant = async (req, res) => {
  try {
    const data = await service.creerInscription(req.body);
    res.status(201).json({ message: 'Inscription reussie', data });
  } catch (err) {
    const code = err.message.includes('introuvable') || err.message.includes('invalide') ? 404 : 400;
    res.status(code).json({ error: err.message });
  }
};

exports.getAllInscriptions = async (req, res) => {
  try {
    const data = await service.getInscriptions(req.query);
    res.json({ total: data.length, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInscription = async (req, res) => {
  try {
    const data = await service.getInscriptionById(req.params.id);
    res.json({ data });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.deleteInscription = async (req, res) => {
  try {
    const data = await service.supprimerInscription(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.getEtudiantByMatricule = async (req, res) => {
  try {
    const etudiant = await service.getEtudiantByMatricule(req.params.matricule);
    if (!etudiant) return res.status(404).json({ error: 'Étudiant non trouvé' });
    res.json(etudiant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllEtudiants = async (req, res) => {
  try {
    const etudiants = await Etudiant.findAll({
      include: [
        {
          model: Inscription,
          include: [
            { model: Niveau, include: [Departement] },
            { model: Annee },
            { model: PayerTranche, as: 'PayerTranches', include: [{ model: Tranche, as: 'Tranche' }] }
          ]
        }
      ]
    });
    res.json(etudiants);
  } catch (err) {
    console.error("Erreur détaillée:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};