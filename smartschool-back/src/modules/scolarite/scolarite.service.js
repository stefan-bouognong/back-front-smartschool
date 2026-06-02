
const { Etudiant, Inscription, Niveau, Annee_Academique, Departement, sequelize } = require('../../database/models');
/**
* Génère matricule: 26INFM10001
*/
const genererMatricule = async (nom_dept, libelle_niveau, id_annee) => {
  const annee = new Date().getFullYear().toString().slice(-2); // 26
  const codeDept = nom_dept.substring(0, 3).toUpperCase(); // INF
  const niveau = libelle_niveau; // M1
  const count = await Inscription.count({
    include: [{
      model: Niveau,
      include: [{ model: Departement, where: { nom_dept } }],
      where: { libelle_niveau }
    }],
    where: { id_annee }
  });
  const numero = String(count + 1).padStart(4, '0'); // 0001
  return `${annee}${codeDept}${niveau}${numero}`;
};
exports.creerInscription = async ({ nom, prenom, email, filiere, niveau }) => {
  const t = await sequelize.transaction();
  try {
    // 1. Trouver le département = filière
    const departement = await Departement.findOne({
      where: { nom_dept: filiere }
    });
    if (!departement) throw { status: 404, message: `Filière ${filiere} introuvable` };
    // 2. Trouver le niveau lié à ce département
    const niveauObj = await Niveau.findOne({
      where: {
        libelle_niveau: niveau,
        id_departement: departement.id_departement
      },
      include: [Departement]
    });
    if (!niveauObj) throw { status: 404, message: `Niveau ${niveau} introuvable pour ${filiere}` };
    // 3. Année académique courante
    const annee = await Annee_Academique.findOne({
      where: { libelle_annee: '2025-2026' }
    });
    if (!annee) throw { status: 404, message: 'Année académique non configurée' };
    // 4. FindOrCreate étudiant
    const [etudiant] = await Etudiant.findOrCreate({
      where: { email },
      defaults: { nom_etud: nom, prenom_etud: prenom, email },
      transaction: t
    });
    // 5. Générer matricule
    const matricule = await genererMatricule(filiere, niveau, annee.id_annee);
    // 6. Créer inscription
    const inscription = await Inscription.create({
      matricule,
      id_etudiant: etudiant.id_etudiant,
      id_annee: annee.id_annee,
      id_niveau: niveauObj.id_niveau
    }, { transaction: t });
    await t.commit();
    return Inscription.findByPk(inscription.id_inscription, {
      include: [
        Etudiant,
        { model: Niveau, include: [Departement] },
        Annee_Academique
      ]
    });
  } catch (err) {
    await t.rollback();
    throw err;
  }
};
exports.getInscriptions = async ({ niveau, filiere }) => {
  const whereNiveau = {};
  const whereDepartement = {};
  if (niveau) whereNiveau.libelle_niveau = niveau;
  if (filiere) whereDepartement.nom_dept = filiere;
  return Inscription.findAll({
    include: [
      Etudiant,
      {
        model: Niveau,
        where: whereNiveau,
        include: [{
          model: Departement,
          where: whereDepartement
        }]
      },
      Annee_Academique
    ]
  });
};
exports.getInscriptionById = async (id) => {
  return Inscription.findByPk(id, {
    include: [
      Etudiant,
      { model: Niveau, include: [Departement] },
      Annee_Academique
    ]
  });
};