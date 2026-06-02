const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Tranche = sequelize.define('Tranche', {
id_tranche: {
type: DataTypes.INTEGER,
autoIncrement: true,
primaryKey: true
},
libelle_tranche: DataTypes.STRING,
montant_exigible: DataTypes.FLOAT,
date_limite: DataTypes.DATE
}, {
tableName: 'Tranche',
timestamps: false
});
module.exports = Tranche;