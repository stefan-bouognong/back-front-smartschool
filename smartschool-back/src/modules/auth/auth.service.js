const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Utilisateur } = require('../../database/models');
const config = require('../../config/env');

exports.register = async (data) => {
  const existing = await Utilisateur.findOne({
    where: { email: data.email }
  });

  if (existing) {
    throw new Error('Email déjà utilisé');
  }

  const hashed = await bcrypt.hash(data.mot_de_passe, 10);

  const user = await Utilisateur.create({
    nom: data.nom,
    prenom: data.prenom,
    email: data.email,
    mot_de_passe: hashed,
    role: data.role,
    id_enseignant: data.id_enseignant || null
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

  if (!user) {
    throw new Error('Utilisateur introuvable');
  }

  const valid = await bcrypt.compare(password, user.mot_de_passe);

  if (!valid) {
    throw new Error('Mot de passe incorrect');
  }

  const token = jwt.sign(
    {
      id: user.id_utilisateur,
      role: user.role
    },
    config.jwtSecret,
    { expiresIn: '1d' }
  );

  return {   id: user.id_utilisateur,
  nom: user.nom,
  prenom: user.prenom,
  email: user.email,
  role: user.role, token
  }
};