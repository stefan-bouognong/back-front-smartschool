const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Utilisateur = sequelize.define('Utilisateur', {
id_utilisateur: {
type: DataTypes.INTEGER,
autoIncrement: true,
primaryKey: true
},
nom: DataTypes.STRING,
prenom: DataTypes.STRING,
email: {
type: DataTypes.STRING,
unique: true
},
mot_de_passe: DataTypes.STRING,
role: {
type: DataTypes.ENUM('ADMIN', 'ENSEIGNANT'),
allowNull: false
},
id_enseignant: {
type: DataTypes.INTEGER,
allowNull: true
}
}, {
tableName: 'Utilisateur',
timestamps: false
});
module.exports = Utilisateur;