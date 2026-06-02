const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Etudiant = sequelize.define('Etudiant', {
id_etudiant: {
type: DataTypes.INTEGER,
autoIncrement: true,primaryKey: true
},
matricule: DataTypes.STRING,
nom_etud: DataTypes.STRING,
prenom_etud: DataTypes.STRING,
date_naissance: DataTypes.DATE,
sexe: DataTypes.STRING,
adresse: DataTypes.TEXT,
email: DataTypes.STRING
}, {
tableName: 'Etudiant',
timestamps: false
});
Etudiant.associate = (models) =>{
Etudiant.hasMany(models.Inscription, {foreignKey: 'id_etudiant'});
}
module.exports = Etudiant;