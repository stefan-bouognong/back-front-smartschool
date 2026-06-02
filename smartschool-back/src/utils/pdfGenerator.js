const PDFDocument = require("pdfkit");

// ─── Helpers d'affichage uniquement ─────────────────────────────────────────
function formatDate(date) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("fr-FR");
}

function formatNumber(value, decimals = 2) {
  if (typeof value !== "number" || Number.isNaN(value)) return "0,00";
  return value.toFixed(decimals).replace(".", ",");
}

function pipePdf(res, doc, filename) {
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
  doc.pipe(res);
  doc.end();
}

// ─── En-tête officielle bilingue ─────────────────────────────────────────────
// nomEtablissement est maintenant dynamique via reportData.inscription.etablissement
function drawOfficialHeader(doc, nomEtablissement, titreDocument) {
  const pageW = doc.page.width;
  const margin = 40;

  doc.fillColor("#000000").font("Helvetica-Bold").fontSize(9);
  doc.text("RÉPUBLIQUE DU CAMEROUN", margin, 20, { align: "left" });
  doc.font("Helvetica").fontSize(7);
  doc.text("Paix – Travail – Patrie", margin, 32, { align: "left" });

  doc.font("Helvetica-Bold").fontSize(9);
  doc.text("REPUBLIC OF CAMEROON", pageW - margin - 150, 20, {
    align: "right",
  });
  doc.font("Helvetica").fontSize(7);
  doc.text("Peace – Work – Fatherland", pageW - margin - 150, 32, {
    align: "right",
  });

  doc
    .moveTo(margin, 44)
    .lineTo(pageW - margin, 44)
    .lineWidth(0.3)
    .stroke("#CCCCCC");

  doc.fillColor("#000000").font("Helvetica").fontSize(14);
  doc.text(nomEtablissement, margin, 55, {
    align: "center",
    width: pageW - margin * 2,
  });

  doc.font("Helvetica-Bold").fontSize(16);
  doc.text(titreDocument, margin, 85, {
    align: "center",
    width: pageW - margin * 2,
  });

  doc
    .moveTo(margin, 108)
    .lineTo(pageW - margin, 108)
    .lineWidth(0.5)
    .stroke("#000000");

  doc.y = 130;
}

// ─── Fiche étudiant ──────────────────────────────────────────────────────────
function drawStudentBox(doc, reportData) {
  const margin = 40;
  let y = doc.y;

  const s = reportData.student;
  const i = reportData.inscription;
  const col1 = margin;
  const col2 = margin + 340;

  doc.font("Helvetica-Bold").fontSize(9);
  doc.text("Noms et Prénoms :", col1, y);
  doc.font("Helvetica").fontSize(9);
  doc.text(`${s.nom} ${s.prenom}`, col1 + 90, y);
  doc.font("Helvetica").fontSize(7);
  doc.text("Surname and Name :", col1, y + 8);

  doc.font("Helvetica-Bold").fontSize(9);
  doc.text("Né(e) le :", col2, y);
  doc.font("Helvetica").fontSize(9);
  doc.text(formatDate(s.date_naissance), col2 + 45, y);
  doc.font("Helvetica").fontSize(7);
  doc.text("Born on :", col2, y + 8);

  y += 22;

  doc.font("Helvetica-Bold").fontSize(9);
  doc.text("Matricule :", col1, y);
  doc.font("Helvetica").fontSize(9);
  doc.text(s.matricule, col1 + 52, y);
  doc.font("Helvetica").fontSize(7);
  doc.text("Registration N°:", col1, y + 8);

  doc.font("Helvetica-Bold").fontSize(9);
  doc.text("Niveau :", col2, y);
  doc.font("Helvetica").fontSize(9);
  doc.text(i.niveau || "N/A", col2 + 42, y);
  doc.font("Helvetica").fontSize(7);
  doc.text("Level :", col2, y + 8);

  y += 22;

  doc.font("Helvetica-Bold").fontSize(9);
  doc.text("Filière :", col1, y);
  doc.font("Helvetica").fontSize(9);
  doc.text(i.departement || "N/A", col1 + 40, y);
  doc.font("Helvetica").fontSize(7);
  doc.text("Discipline :", col1, y + 8);

  doc.font("Helvetica-Bold").fontSize(9);
  doc.text("Année Académique :", col2, y);
  doc.font("Helvetica").fontSize(9);
  doc.text(i.annee_scolaire || "N/A", col2 + 95, y);
  doc.font("Helvetica").fontSize(7);
  doc.text("Academic Year :", col2, y + 8);

  doc.y = y + 30;
}

// ─── Tableau des notes ───────────────────────────────────────────────────────
function drawNotesTable(doc, notes) {
  const margin = 40;
  let y = doc.y;

  const rowH = 20;
  const cols = [
    { title: "Code UE", w: 45 },
    { title: "Intitulé de l'UE", w: 240 },
    { title: "Crédit", w: 38 },
    { title: "Moy/100", w: 38 },
    { title: "Mention", w: 38 },
    { title: "Session", w: 43 },
    { title: "Année", w: 38 },
    { title: "Décision", w: 38 },
  ];

  const tableX = margin;
  const tableW = cols.reduce((sum, col) => sum + col.w, 0);
  const tableH = rowH * (notes.length + 1);

  // En-tête
  let currentX = tableX;
  doc.rect(tableX, y, tableW, rowH).fill("#F5F5F5").stroke("#000000");
  doc.font("Helvetica-Bold").fontSize(7).fillColor("#000000");
  cols.forEach((col) => {
    doc.rect(currentX, y, col.w, rowH).stroke("#000000");
    doc.text(col.title, currentX + 4, y + 7, {
      width: col.w - 8,
      align: "center",
    });
    currentX += col.w;
  });

  // Lignes de données
  notes.forEach((note, idx) => {
    const ue = note.ue || {};
    const annee = note.date_examen
      ? new Date(note.date_examen).getFullYear()
      : "N/A";
    const yPos = y + rowH * (idx + 1);

    currentX = tableX;
    doc.font("Helvetica").fontSize(7);

    const cellContents = [
      ue.code_UE || "N/A",
      ue.libelle_UE || "N/A",
      String(ue.credits_ECTS || ""),
      formatNumber(note.valeur_note, 0),
      note.gradeInfo?.cote || "N/A",
      note.session || "C",
      String(annee),
      note.decision || "N/A",
    ];

    cellContents.forEach((content, i) => {
      doc.rect(currentX, yPos, cols[i].w, rowH).stroke("#000000");
      const align = i === 1 ? "left" : "center";
      doc.text(content, currentX + (align === "center" ? 4 : 2), yPos + 6, {
        width: cols[i].w - (align === "center" ? 8 : 4),
        align,
      });
      currentX += cols[i].w;
    });
  });

  doc.y = y + tableH + 25;
}

// ─── Bilan récapitulatif ─────────────────────────────────────────────────────
function drawSummary(doc, summary, rang) {
  const margin = 40;
  const pageW = doc.page.width;
  let y = doc.y;

  // Colonne gauche
  const colGauche = margin;
  const colDroite = pageW - margin - 150;

  // Ligne 1: Crédits capitalisés (gauche)
  doc.font("Helvetica").fontSize(9);
  doc.text("Crédits capitalisés : ", colGauche, y, { continued: true });
  doc.font("Helvetica-Bold").fontSize(9);
  doc.text(`${summary.creditsCapitalises}`, { continued: true });
  doc.font("Helvetica").fontSize(9);
  doc.text(` / ${summary.creditsTotaux} (`, { continued: true });
  doc.font("Helvetica-Bold").fontSize(9);
  doc.text(`${formatNumber(summary.pourcentage, 2)}`, { continued: true });
  doc.font("Helvetica").fontSize(9);
  doc.text(" %)", { continued: false });

  // Ligne 1 (droite): Moyenne Générale
  doc.font("Helvetica").fontSize(9);
  doc.text("Moyenne Générale : ", colDroite, y, { continued: true });
  doc.font("Helvetica-Bold").fontSize(9);
  doc.text(`${formatNumber(summary.moyenneGenerale, 2)}`, {
    continued: true,
  });
  doc.font("Helvetica").fontSize(9);
  doc.text(" / 20", { continued: false });

  y += 18;

  // Ligne 2: MGP (gauche)
  doc.font("Helvetica").fontSize(9);
  doc.text("Moyenne Générale Pondérée (MGP) : ", colGauche, y, {
    continued: true,
  });
  doc.font("Helvetica-Bold").fontSize(9);
  doc.text(`${formatNumber(summary.mgp, 2)}`, { continued: true });
  doc.font("Helvetica").fontSize(9);
  doc.text(" / 4", { continued: false });

  // Ligne 2 (droite): Rang
  if (rang) {
    doc.font("Helvetica").fontSize(9);
    doc.text("Rang : ", colDroite, y, { continued: true });
    doc.font("Helvetica-Bold").fontSize(9);
    doc.text(`${rang}`, { continued: false });
  }

  y += 18;

  // Ligne 3: Décision (gauche)
  doc.font("Helvetica").fontSize(9);
  doc.text("Décision : ", colGauche, y, { continued: true });
  if (summary.estAdmis) {
    doc.font("Helvetica-Bold").fontSize(10).text("ADMIS", { continued: false });
  } else {
    doc.font("Helvetica-Bold").fontSize(10).text("ECHEC", { continued: false });
  }

  doc.y = y + 30;
}

// ─── Pied de page avec signatures ────────────────────────────────────────────
function drawFooter(doc, presidentJury = "Le Président du Jury") {
  const pageW = doc.page.width;
  const margin = 40;
  let y = doc.y;

  const colGauche = margin;
  const colCentre = pageW / 2 - 60;
  const colDroite = pageW - margin - 150;

  doc
    .moveTo(margin, y)
    .lineTo(pageW - margin, y)
    .lineWidth(0.3)
    .stroke("#CCCCCC");

  y += 12;

  doc.font("Helvetica").fontSize(9).fillColor("#000000");
  doc.text(presidentJury, colGauche, y);
  doc.font("Helvetica").fontSize(7);
  doc.text("The President of the Jury", colGauche, y + 10);
  doc
    .moveTo(colGauche, y + 28)
    .lineTo(colGauche + 140, y + 28)
    .lineWidth(0.3)
    .stroke("#999999");

  doc.font("Helvetica").fontSize(9);
  doc.text(`Yaoundé, le `, colCentre, y + 10, {
    continued: true,
  });
  doc.font("Helvetica-Bold").fontSize(9);
  doc.text(`${formatDate(new Date())}`, { continued: false });

  doc.font("Helvetica").fontSize(9);
  doc.text("Le Chef de Département", colDroite, y);
  doc.font("Helvetica").fontSize(7);
  doc.text("The Head of Department", colDroite, y + 10);
  doc
    .moveTo(colDroite, y + 28)
    .lineTo(colDroite + 140, y + 28)
    .lineWidth(0.3)
    .stroke("#999999");

  y += 220;

  doc.font("Helvetica").fontSize(7).fillColor("#555555");
  doc.text(
    "NB : Il n'est délivré qu'un seul relevé de notes. Le titulaire peut établir et faire certifier des copies conformes.",
    margin,
    y,
    { width: pageW - margin * 2, align: "center" },
  );
}

// ─── Génération du relevé de notes ───────────────────────────────────────────
function generateRelevePdf(reportData, res) {
  const doc = new PDFDocument({
    size: "A4",
    margin: 40,
    info: {
      Title: "Relevé de Notes",
      Author: "Université de Yaoundé I",
      Subject: `Relevé de notes – ${reportData.student.matricule}`,
    },
  });

  const nomEtablissement = reportData.inscription.etablissement;

  drawOfficialHeader(doc, nomEtablissement, "RELEVÉ DE NOTES / TRANSCRIPT");
  drawStudentBox(doc, reportData);

  const notes = reportData.notes || [];
  if (notes.length > 0) {
    drawNotesTable(doc, notes);
    drawSummary(doc, reportData.summary, reportData.rang);
  } else {
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#555555")
      .text("Aucune note disponible pour cette inscription.", 40, doc.y, {
        align: "center",
      });
    doc.moveDown();
  }

  drawFooter(doc, reportData.presidentJury);

  pipePdf(res, doc, `releve_${reportData.student.matricule}.pdf`);
}

// ─── Génération du certificat de scolarité ───────────────────────────────────
// function generateCertificatePdf(reportData, res) {
//   const doc = new PDFDocument({
//     size: "A4",
//     margin: 40,
//     info: {
//       Title: "Certificat de Scolarité",
//       Author: "Université de Yaoundé I",
//       Subject: `Certificat de scolarité – ${reportData.student.matricule}`,
//     },
//   });

//   const pageW = doc.page.width;
//   const margin = 40;
//   const s = reportData.student;
//   const i = reportData.inscription;
//   const p = reportData.payments;

//   const nomEtablissement = i.etablissement || "UNIVERSITÉ DE YAOUNDÉ I";

//   // ── En-tête
//   drawOfficialHeader(doc, nomEtablissement, "CERTIFICAT DE SCOLARITÉ");

//   // ── Accroche officielle
//   doc.moveDown(0.5);
//   doc.font("Helvetica-Bold").fontSize(10).fillColor("#000000");
//   doc.text(
//     `Le Chef du ${i.departement || "N/A"} de la ${nomEtablissement}`,
//     margin,
//     doc.y,
//     { align: "center", width: pageW - margin * 2 },
//   );
//   doc.moveDown(0.3);
//   doc.font("Helvetica").fontSize(9);
//   doc.text("certifie que l'étudiant(e) :", margin, doc.y, {
//     align: "center",
//     width: pageW - margin * 2,
//   });

//   // ── Encadré identité étudiant
//   doc.moveDown(0.6);
//   const boxY = doc.y;
//   const boxW = pageW - margin * 2 - 80;
//   const boxX = margin + 40;
//   const boxH = 62;

//   doc.rect(boxX, boxY, boxW, boxH).stroke("#000000");

//   doc.font("Helvetica-Bold").fontSize(13).fillColor("#000000");
//   doc.text(`${s.nom.toUpperCase()} ${s.prenom}`, boxX, boxY + 10, {
//     width: boxW,
//     align: "center",
//   });

//   doc.font("Helvetica").fontSize(9);
//   doc.text(
//     `Matricule : ${s.matricule}     |     Né(e) le : ${formatDate(s.date_naissance)}`,
//     boxX,
//     boxY + 30,
//     { width: boxW, align: "center" },
//   );

//   doc.font("Helvetica-Bold").fontSize(9);
//   doc.text(
//     `${i.departement || "N/A"}   –   ${i.niveau || "N/A"}`,
//     boxX,
//     boxY + 48,
//     { width: boxW, align: "center" },
//   );

//   doc.y = boxY + boxH + 20;

//   // ── Corps du certificat
//   doc.font("Helvetica").fontSize(10).fillColor("#000000").lineGap(5);
//   doc.text(
//     `est régulièrement inscrit(e) en ${nomEtablissement} pour l'année académique ${i.annee_scolaire || "N/A"}.`,
//     margin,
//     doc.y,
//     { width: pageW - margin * 2, align: "justify" },
//   );

//   doc.moveDown(0.6);
//   doc.text(
//     "Le présent certificat est délivré à l'intéressé(e) pour servir et valoir ce que de droit, notamment dans toute démarche administrative, bancaire ou académique.",
//     margin,
//     doc.y,
//     { width: pageW - margin * 2, align: "justify" },
//   );

//   // ── Statut paiement
//   doc.moveDown(0.8);
//   const statusLabel = p.isEligible ? "À JOUR" : "INSUFFISANT";
//   const statusColor = p.isEligible ? "#1A7A1A" : "#CC0000";

//   doc.font("Helvetica").fontSize(9).fillColor("#000000");
//   doc.text("Statut de la scolarité : ", margin, doc.y, { continued: true });
//   doc.font("Helvetica-Bold").fillColor(statusColor).text(statusLabel);
//   doc.fillColor("#000000");

//   // ── Pied de page (réutilise le même footer que le relevé)
//   doc.fillColor("#000000");
//   drawFooter(doc, "Le Président du Jury");

//   doc.moveDown(0.4);
//   doc.font("Helvetica").fontSize(8).fillColor("#555555");
//   doc.text(`Document imprimé le ${formatDate(new Date())}`, margin, doc.y, {
//     align: "center",
//   });

//   pipePdf(res, doc, `certificat_${s.matricule || s.id_etudiant}.pdf`);
// }

module.exports = {
  generateRelevePdf,
  // generateCertificatePdf,
};
