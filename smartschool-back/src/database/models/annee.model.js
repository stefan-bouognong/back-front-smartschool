const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Annee = sequelize.define('Annee_Academique', {
id_annee: {
type: DataTypes.INTEGER,
autoIncrement: true,
primaryKey: true
},
libelle_annee: {
type: DataTypes.STRING,
allowNull: false
}
}, {
tableName: 'Annee_Academique',
timestamps: false
});
module.exports = Annee;