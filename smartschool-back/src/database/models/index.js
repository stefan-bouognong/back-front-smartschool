const Sequelize = require("sequelize");
const sequelize = require("../../config/database");

// Import modèles
const Utilisateur = require("./utilisateur.model");
const Enseignant = require("./enseignant.model");
const Etudiant = require("./etudiant.model");
const Inscription = require("./inscription.model");
const UE = require("./ue.model");
const Note = require("./note.model");
const Tranche = require("./tranche.model");
const PayerTranche = require("./payerTranche.model");
const Departement = require("./departement.model");
const Annee = require("./annee.model");
const Niveau = require("./niveau.model");
const Etablissement = require("./etablissement.model");




// ================= RELATIONS =================

// Utilisateur → Enseignant
Utilisateur.belongsTo(Enseignant, { foreignKey: "id_enseignant" });

// Etablissement → Departement → Niveau (hiérarchie académique)
Departement.belongsTo(Etablissement, { foreignKey: "id_etablissement" });
Etablissement.hasMany(Departement, { foreignKey: "id_etablissement" });

Niveau.belongsTo(Departement, { foreignKey: "id_departement" });
Departement.hasMany(Niveau, { foreignKey: "id_departement" });

// Inscription relations
Inscription.belongsTo(Etudiant, { foreignKey: 'id_etudiant' });
Inscription.belongsTo(Annee, { foreignKey: 'id_annee' });
Inscription.belongsTo(Niveau, { foreignKey: 'id_niveau' });

// UE relations
UE.belongsTo(Niveau, { foreignKey: 'id_niveau' });

Inscription.belongsTo(Etudiant, { foreignKey: "id_etudiant" });
Inscription.belongsTo(Niveau, { foreignKey: "id_niveau" });
Inscription.belongsTo(Annee, { foreignKey: "id_annee" });

Etudiant.hasMany(Inscription, { foreignKey: "id_etudiant" });
Niveau.hasMany(Inscription, { foreignKey: "id_niveau" });

// UE → Niveau
UE.belongsTo(Niveau, { foreignKey: "id_niveau" });
Niveau.hasMany(UE, { foreignKey: "id_niveau" });

// Note relations
Note.belongsTo(Inscription, { foreignKey: "id_inscription" });
Note.belongsTo(UE, { foreignKey: "id_UE" });
Note.belongsTo(Enseignant, { foreignKey: "id_enseignant" });

Inscription.hasMany(Note, { foreignKey: "id_inscription" });
UE.hasMany(Note, { foreignKey: "id_UE" });

// Paiement
PayerTranche.belongsTo(Inscription, { foreignKey: "id_inscription" });
PayerTranche.belongsTo(Tranche, { foreignKey: "id_tranche" });

Inscription.hasMany(PayerTranche, { foreignKey: "id_inscription" });
Tranche.hasMany(PayerTranche, { foreignKey: "id_tranche" });


//annee
Annee.hasMany(Inscription, { foreignKey: 'id_annee' });



module.exports = {
  sequelize,
  Utilisateur,
  Enseignant,
  Etudiant,
  Inscription,
  UE,
  Note,
  Tranche,
  PayerTranche,
  Annee,
  Niveau,
  Departement,
  Etablissement


};


