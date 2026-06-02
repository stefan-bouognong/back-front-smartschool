const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Etablissement = sequelize.define('Etablissement', {
id_etablissement: {
type: DataTypes.INTEGER,
autoIncrement: true,
primaryKey: true
},
nom_etablissement: {
type: DataTypes.STRING,
allowNull: false
},
adresse: DataTypes.TEXT,
ville: DataTypes.STRING,
telephone: DataTypes.STRING
}, {
tableName: 'Etablissement',
timestamps: false
});
module.exports = Etablissement;