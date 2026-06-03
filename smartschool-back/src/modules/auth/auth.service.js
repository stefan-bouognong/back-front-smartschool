const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Utilisateur, Enseignant } = require('../../database/models');
const config = require('../../config/env');

exports.register = async (data) => {
  const existing = await Utilisateur.findOne({ where: { email: data.email } });
  if (existing) throw new Error('Email déjà utilisé');

  const hashed = await bcrypt.hash(data.mot_de_passe, 10);
  let id_enseignant = null;

  if (data.role === 'ENSEIGNANT') {
    const enseignant = await Enseignant.create({
      nom_ens: data.nom,
      prenom_ens: data.prenom,
      email: data.email,
      specialite: data.specialite || null,
      telephone: data.telephone || null
    });
    id_enseignant = enseignant.id_enseignant;
  }

  const user = await Utilisateur.create({
    nom: data.nom,
    prenom: data.prenom,
    email: data.email,
    mot_de_passe: hashed,
    role: data.role,
    id_enseignant
  });

  return {
    id: user.id_utilisateur,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    role: user.role
  };
};

exports.login = async (email, password) => {
  const user = await Utilisateur.findOne({ where: { email } });
  if (!user) throw new Error('Utilisateur introuvable');

  const valid = await bcrypt.compare(password, user.mot_de_passe);
  if (!valid) throw new Error('Mot de passe incorrect');

  const token = jwt.sign(
    {
      id: user.id_utilisateur,
      role: user.role,
      id_enseignant: user.id_enseignant   // ← crucial
    },
    config.jwtSecret,
    { expiresIn: '1d' }
  );

  return {
    id: user.id_utilisateur,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    role: user.role,
    token
  };
};