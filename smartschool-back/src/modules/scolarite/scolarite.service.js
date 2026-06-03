const { Etudiant, Inscription, Niveau, Annee, Departement, sequelize } = require('../../database/models');

/**
 * Génère un matricule unique pour un étudiant.
 * Format: <année sur 2 chiffres><code département (3 lettres)><niveau sans espaces><id_etudiant>
 * Exemple: 26INFMASTER1 (pour étudiant id 1)
 */
const genererMatricule = (id_etudiant, nom_dept, libelle_niveau) => {
  const anneeCourante = new Date().getFullYear().toString().slice(-2); // "26"
  const codeDept = nom_dept.substring(0, 3).toUpperCase(); // "INF"
  const niveauClean = libelle_niveau.replace(/\s/g, ''); // "MASTER" ou "M1"
  return `${anneeCourante}${codeDept}${niveauClean}${id_etudiant}`;
};

exports.creerInscription = async ({ nom, prenom, email, filiere, niveau, anneeLibelle, date_naissance }) => {
  const t = await sequelize.transaction();
  try {
    // 1. Département (filière)
    const departement = await Departement.findOne({ where: { nom_dept: filiere } });
    if (!departement) throw new Error(`Filière ${filiere} introuvable`);

    // 2. Niveau
    const niveauObj = await Niveau.findOne({
      where: { libelle_niveau: niveau, id_departement: departement.id_departement },
      include: [Departement]
    });
    if (!niveauObj) throw new Error(`Niveau ${niveau} introuvable pour ${filiere}`);

    // 3. Année académique
    let annee;
    if (anneeLibelle) {
      annee = await Annee.findOne({ where: { libelle_annee: anneeLibelle } });
    } else {
      annee = await Annee.findOne();
    }
    if (!annee) throw new Error('Année académique non configurée');

    // 4. Étudiant : findOrCreate avec date_naissance
    const [etudiant, created] = await Etudiant.findOrCreate({
      where: { email },
      defaults: { 
        nom_etud: nom, 
        prenom_etud: prenom, 
        email,
        date_naissance: date_naissance || null   // ← Ajout de la date de naissance
      },
      transaction: t
    });

    // 5. Gérer le matricule (uniquement si l'étudiant n'en a pas)
    let matricule = etudiant.matricule;
    if (!matricule) {
      matricule = genererMatricule(etudiant.id_etudiant, filiere, niveau);
      await etudiant.update({ matricule }, { transaction: t });
    }

    // 6. Créer l'inscription
    const inscription = await Inscription.create({
      id_etudiant: etudiant.id_etudiant,
      id_annee: annee.id_annee,
      id_niveau: niveauObj.id_niveau
    }, { transaction: t });

    await t.commit();

    // Retourner l'inscription avec toutes ses relations
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
        include: [{
          model: Departement,
          where: Object.keys(whereDepartement).length ? whereDepartement : undefined
        }]
      },
      Annee
    ]
  });
};

exports.getInscriptionById = async (id) => {
  return Inscription.findByPk(id, {
    include: [Etudiant, { model: Niveau, include: [Departement] }, Annee]
  });
};

exports.supprimerInscription = async (id) => {
  const inscription = await Inscription.findByPk(id);
  if (!inscription) throw new Error('Inscription non trouvée');
  await inscription.destroy();
  return { message: 'Inscription supprimée avec succès' };
};

// Recherche d'un étudiant par son matricule
exports.getEtudiantByMatricule = async (matricule) => {
  return Etudiant.findOne({
    where: { matricule },
    include: [{ model: Inscription, include: [Niveau, Annee] }]
  });
};