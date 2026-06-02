const {
  Etudiant,
  Inscription,
  Note,
  UE,
  PayerTranche,
  Tranche,
  Departement,
  Etablissement,
  Niveau,
  Annee,
} = require("../../database/models");

const PAYMENT_THRESHOLD = Number(process.env.PENSION_PAYMENT_THRESHOLD || 100);

// ─── Barème officiel UY1 (Note/100 → Cote → Qualité points) ─────────────────

const BAREME = [
  { min: 80, max: 100, cote: "A", points: 4.0, mention: "Très bien" },
  { min: 75, max: 79, cote: "A-", points: 3.7, mention: "Bien" },
  { min: 70, max: 74, cote: "B+", points: 3.3, mention: "Bien" },
  { min: 65, max: 69, cote: "B", points: 3.0, mention: "Assez Bien" },
  { min: 60, max: 64, cote: "B-", points: 2.7, mention: "Assez Bien" },
  { min: 55, max: 59, cote: "C+", points: 2.3, mention: "Passable" },
  { min: 50, max: 54, cote: "C", points: 2.0, mention: "Passable" },
  {
    min: 45,
    max: 49,
    cote: "C-",
    points: 1.7,
    mention: "Crédits capitalisés mais non transférable",
  },
  {
    min: 40,
    max: 44,
    cote: "D+",
    points: 1.3,
    mention: "Crédits capitalisés mais non transférable",
  },
  {
    min: 35,
    max: 39,
    cote: "D",
    points: 1.0,
    mention: "Crédits capitalisés mais non transférable",
  },
  { min: 30, max: 34, cote: "E", points: 0.0, mention: "Échec" },
  { min: 0, max: 29, cote: "F", points: 0.0, mention: "Échec" },
];

// ─── Logique métier : barème ─────────────────────────────────────────────────

function getGradeInfo(noteSur100) {
  const grade = BAREME.find((g) => noteSur100 >= g.min && noteSur100 <= g.max);
  return grade || { cote: "F", points: 0.0, mention: "Échec" };
}

function getDecision(noteSur100) {
  if (noteSur100 >= 50) return "CA";
  if (noteSur100 >= 35) return "CANT";
  return "NC";
}

function computeAverage(mgp) {
  return (mgp * 20) / 4;
}

function computeSummary(notes) {
  let totalPointsPonderes = 0;
  let totalCredits = 0;
  let creditsCapitalises = 0;

  notes.forEach((note) => {
    const ue = note.ue || {};
    const credits = parseFloat(ue.credits_ECTS) || 0;
    const noteSur100 = parseFloat(note.valeur_note);
    const gradeInfo = getGradeInfo(noteSur100);
    const decision = getDecision(noteSur100);

    totalCredits += credits;
    totalPointsPonderes += gradeInfo.points * credits;

    if (decision === "CA" || decision === "CANT") {
      creditsCapitalises += credits;
    }
  });

  const mgp = totalCredits > 0 ? totalPointsPonderes / totalCredits : 0;
  const pourcentage =
    totalCredits > 0 ? (creditsCapitalises / totalCredits) * 100 : 0;
  const estAdmis = mgp >= 2.0;
  const moyenneGenerale = computeAverage(mgp);

  return {
    creditsCapitalises,
    creditsTotaux: totalCredits,
    pourcentage: Number(pourcentage.toFixed(2)),
    mgp: Number(mgp.toFixed(2)),
    moyenneGenerale: Number(moyenneGenerale.toFixed(2)),
    estAdmis,
  };
}

// ─── Helpers internes ────────────────────────────────────────────────────────

function normalizeNumber(value) {
  return typeof value === "number" && !Number.isNaN(value) ? value : 0;
}

async function computeMGPForInscription(id_inscription, selectedSession) {
  const notes = await Note.findAll({
    where: {
      id_inscription,
      ...(selectedSession ? { session: selectedSession } : {}),
    },
    include: [UE],
  });

  const noteRows = notes.map((note) => ({
    valeur_note: normalizeNumber(note.valeur_note),
    ue: note.UE ? { credits_ECTS: note.UE.credits_ECTS } : null,
  }));

  return computeSummary(noteRows);
}

// ─── Paiements ───────────────────────────────────────────────────────────────

async function buildPaymentSummary(inscription) {
  const [tranches, payerTranches] = await Promise.all([
    Tranche.findAll({ raw: true }),
    PayerTranche.findAll({
      where: { id_inscription: inscription.id_inscription },
      include: [Tranche],
    }),
  ]);

  const totalExpected = tranches.reduce(
    (sum, t) => sum + normalizeNumber(t.montant_exigible),
    0,
  );
  const totalPaid = payerTranches.reduce(
    (sum, p) => sum + normalizeNumber(p.montant_verse),
    0,
  );
  const paidPercentage =
    totalExpected === 0
      ? 100
      : Math.min(100, (totalPaid / totalExpected) * 100);

  return {
    totalExpected,
    totalPaid,
    paidPercentage: Number(paidPercentage.toFixed(2)),
    threshold: PAYMENT_THRESHOLD,
    isEligible: paidPercentage >= PAYMENT_THRESHOLD,
    statutPaiement: Boolean(inscription.statut_paiement),
  };
}

// ─── Rang ────────────────────────────────────────────────────────────────────

async function computeRank(inscription, selectedSession) {
  // On charge uniquement les inscriptions, sans jointure sur Etudiant
  const peerInscriptions = await Inscription.findAll({
    where: {
      id_niveau: inscription.id_niveau,
      id_annee: inscription.id_annee,
    },
  });

  if (!peerInscriptions || peerInscriptions.length === 0) return null;

  const inscriptionsWithMGP = await Promise.all(
    peerInscriptions.map(async (item) => {
      const summary = await computeMGPForInscription(
        item.id_inscription,
        selectedSession,
      );
      return {
        id_inscription: item.id_inscription,
        mgp: summary.mgp,
      };
    }),
  );

  const sorted = [...inscriptionsWithMGP].sort((a, b) => b.mgp - a.mgp);

  const rank = sorted.findIndex(
    (item) => item.id_inscription === inscription.id_inscription,
  );

  return rank >= 0 ? rank + 1 : null;
}

// ─── Résolution de la hiérarchie académique ──────────────────────────────────

async function resolveAcademicHierarchy(niveauId) {
  const niveau = await Niveau.findByPk(niveauId);
  if (!niveau) return { niveau: null, departement: null, etablissement: null };

  const departement = niveau.id_departement
    ? await Departement.findByPk(niveau.id_departement)
    : null;

  const etablissement =
    departement && departement.id_etablissement
      ? await Etablissement.findByPk(departement.id_etablissement)
      : null;

  return { niveau, departement, etablissement };
}

// ─── Point d'entrée principal ────────────────────────────────────────────────

async function getReportingData(etudiantId, selectedSession) {
  const etudiant = await Etudiant.findByPk(etudiantId);
  if (!etudiant) {
    const error = new Error("Étudiant introuvable");
    error.status = 404;
    throw error;
  }

  const inscription = await Inscription.findOne({
    where: { id_etudiant: etudiant.id_etudiant },
    order: [["date_inscription", "DESC"]],
  });

  if (!inscription) {
    const error = new Error("Inscription introuvable pour cet étudiant");
    error.status = 404;
    throw error;
  }

  const [{ niveau, departement, etablissement }, annee, notes] =
    await Promise.all([
      resolveAcademicHierarchy(inscription.id_niveau),
      Annee.findByPk(inscription.id_annee),
      Note.findAll({
        where: {
          id_inscription: inscription.id_inscription,
          ...(selectedSession ? { session: selectedSession } : {}),
        },
        include: [UE],
      }),
    ]);

  const noteRows = notes.map((note) => ({
    id_note: note.id_note,
    valeur_note: normalizeNumber(note.valeur_note),
    session: note.session,
    date_examen: note.date_examen,
    gradeInfo: getGradeInfo(normalizeNumber(note.valeur_note)),
    decision: getDecision(normalizeNumber(note.valeur_note)),
    ue: note.UE
      ? {
          id_UE: note.UE.id_UE,
          code_UE: note.UE.code_UE,
          libelle_UE: note.UE.libelle_UE,
          credits_ECTS: note.UE.credits_ECTS,
        }
      : null,
  }));

  const rang = await computeRank(inscription, selectedSession);
  const payments = await buildPaymentSummary(inscription);
  const summary = computeSummary(noteRows);

  return {
    student: {
      id_etudiant: etudiant.id_etudiant,
      matricule: etudiant.matricule,
      nom: etudiant.nom_etud,
      prenom: etudiant.prenom_etud,
      date_naissance: etudiant.date_naissance,
      sexe: etudiant.sexe,
      adresse: etudiant.adresse,
      email: etudiant.email,
    },
    inscription: {
      id_inscription: inscription.id_inscription,
      date_inscription: inscription.date_inscription,
      id_niveau: inscription.id_niveau,
      id_annee: inscription.id_annee,
      niveau: niveau ? niveau.libelle_niveau : null,
      departement: departement ? departement.nom_dept : null,
      etablissement: etablissement ? etablissement.nom_etablissement : null,
      annee_scolaire: annee ? annee.libelle_annee : null,
    },
    payments,
    notes: noteRows,
    rang,
    summary,
    session: selectedSession || "tous",
  };
}

module.exports = {
  getReportingData,
  BAREME,
  getGradeInfo,
  getDecision,
  computeSummary,
  computeAverage,
  computeMGPForInscription,
};
