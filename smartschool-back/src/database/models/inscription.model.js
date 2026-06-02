const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Inscription = sequelize.define('Inscription', {
id_inscription: {
type: DataTypes.INTEGER,
autoIncrement: true,
primaryKey: true
},
date_inscription: DataTypes.DATE,
statut_paiement: {
type: DataTypes.BOOLEAN,
defaultValue: false
},
id_etudiant: DataTypes.INTEGER,
id_annee: DataTypes.INTEGER,
id_niveau: DataTypes.INTEGER
}, {
tableName: 'Inscription',
timestamps: false
});
module.exports = Inscription;