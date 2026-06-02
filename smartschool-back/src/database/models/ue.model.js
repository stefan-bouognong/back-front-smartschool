const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const UE = sequelize.define('UE', {
id_UE: {
type: DataTypes.INTEGER,
autoIncrement: true,
primaryKey: true
},
code_UE: DataTypes.STRING,
libelle_UE: DataTypes.STRING,
credits_ECTS: DataTypes.INTEGER,
id_niveau: DataTypes.INTEGER
}, {
tableName: 'UE',
timestamps: false
});
module.exports = UE;