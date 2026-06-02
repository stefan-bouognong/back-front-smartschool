const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');const Enseignant = sequelize.define('Enseignant', {
id_enseignant: {
type: DataTypes.INTEGER,
autoIncrement: true,
primaryKey: true
},
nom_ens: DataTypes.STRING,
prenom_ens: DataTypes.STRING,
specialite: DataTypes.STRING,
email: DataTypes.STRING,
telephone: DataTypes.STRING
}, {
tableName: 'Enseignant',
timestamps: false
});
module.exports = Enseignant;