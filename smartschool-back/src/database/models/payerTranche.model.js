const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const PayerTranche = sequelize.define('Payer_Tranche', {
  id_inscription: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
  id_tranche: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
  date_paiement: { type: DataTypes.DATE, allowNull: true },
  montant_verse: { type: DataTypes.FLOAT, allowNull: true },
  mode_paiement: { type: DataTypes.STRING, allowNull: true }
}, { tableName: 'Payer_Tranche', timestamps: false });
module.exports = PayerTranche;