const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Annee = sequelize.define('Annee', {
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
tableName: 'Annee',
timestamps: false
});
module.exports = Annee;