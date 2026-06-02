const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Departement = sequelize.define('Departement', {
id_departement: {
type: DataTypes.INTEGER,
autoIncrement: true,
primaryKey: true
},
nom_dept: {
type: DataTypes.STRING,
allowNull: false
},
id_etablissement: DataTypes.INTEGER
}, {
tableName: 'Departement',
timestamps: false
});
module.exports = Departement;