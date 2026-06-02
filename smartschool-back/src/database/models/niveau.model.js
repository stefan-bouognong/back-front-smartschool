const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Niveau = sequelize.define('Niveau', {
id_niveau: {
type: DataTypes.INTEGER,
autoIncrement: true,
primaryKey: true
},
libelle_niveau: {
type: DataTypes.STRING,
allowNull: false
},id_departement: DataTypes.INTEGER
}, {
tableName: 'Niveau',
timestamps: false
});
module.exports = Niveau;