const { Etudiant, Inscription, Niveau, Annee, Departement, PayerTranche, Tranche, sequelize } = require('../../database/models');

const genererMatricule = (id_etudiant, nom_dept, libelle_niveau) => {
  const anneeCourante = new Date().getFullYear().toString().slice(-2);
  const codeDept = nom_dept.substring(0, 3).toUpperCase();
  const niveauClean = libelle_niveau.replace(/\s/g, '');
  return `${anneeCourante}${codeDept}${niveauClean}${id_etudiant}`;
};

exports.creerInscription = async ({ nom, prenom, email, filiere, niveau, anneeLibelle, date_naissance }) => {
  const t = await sequelize.transaction();
  try {
    const departement = await Departement.findOne({ where: { nom_dept: filiere } });
    if (!departement) throw new Error(`Filière ${filiere} introuvable`);

    const niveauObj = await Niveau.findOne({
      where: { libelle_niveau: niveau, id_departement: departement.id_departement },
      include: [Departement]
    });
    if (!niveauObj) throw new Error(`Niveau ${niveau} introuvable pour ${filiere}`);

    let annee;
    if (anneeLibelle) annee = await Annee.findOne({ where: { libelle_annee: anneeLibelle } });
    else annee = await Annee.findOne();
    if (!annee) throw new Error('Année académique non configurée');

    const [etudiant, created] = await Etudiant.findOrCreate({
      where: { email },
      defaults: { nom_etud: nom, prenom_etud: prenom, email, date_naissance: date_naissance || null },
      transaction: t
    });

    let matricule = etudiant.matricule;
    if (!matricule) {
      matricule = genererMatricule(etudiant.id_etudiant, filiere, niveau);
      await etudiant.update({ matricule }, { transaction: t });
    }

    const inscription = await Inscription.create({
      id_etudiant: etudiant.id_etudiant,
      id_annee: annee.id_annee,
      id_niveau: niveauObj.id_niveau
    }, { transaction: t });

    await t.commit();

    return Inscription.findByPk(inscription.id_inscription, {
      include: [Etudiant, { model: Niveau, include: [Departement] }, Annee]
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
        where: Object.keys(whereNiveau).length ? whereNiveau : undefined,
        include: [{ model: Departement, where: Object.keys(whereDepartement).length ? whereDepartement : undefined }]
      },
      Annee,
      { model: PayerTranche, as: 'PayerTranches', include: [{ model: Tranche, as: 'Tranche' }] }
    ]
  });
};

exports.getInscriptionById = async (id) => {
  return Inscription.findByPk(id, {
    include: [Etudiant, { model: Niveau, include: [Departement] }, Annee, { model: PayerTranche, as: 'PayerTranches', include: [{ model: Tranche, as: 'Tranche' }] }]
  });
};

exports.supprimerInscription = async (id) => {
  const inscription = await Inscription.findByPk(id);
  if (!inscription) throw new Error('Inscription non trouvée');
  await inscription.destroy();
  return { message: 'Inscription supprimée avec succès' };
};

exports.getEtudiantByMatricule = async (matricule) => {
  return Etudiant.findOne({
    where: { matricule },
    include: [{ model: Inscription, include: [Niveau, Annee, { model: PayerTranche, as: 'PayerTranches', include: [{ model: Tranche, as: 'Tranche' }] }] }]
  });
};