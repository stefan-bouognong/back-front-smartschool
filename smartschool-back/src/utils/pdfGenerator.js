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

// ─── En-tête officielle bilingue (Université, Faculté, Département) ─────────
function drawOfficialHeader(doc, titreDocument) {
  const pageW = doc.page.width;
  const margin = 40;

  // Ligne 1 : République du Cameroun (gauche) / Republic of Cameroon (droite)
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

  // Ligne 2 : Université (français à gauche, anglais à droite)
  doc.font("Helvetica-Bold").fontSize(11);
  doc.text("UNIVERSITÉ DE YAOUNDÉ I", margin, 45, { align: "left" });
  doc.text("UNIVERSITY OF YAOUNDÉ I", pageW - margin - 150, 45, {
    align: "right",
  });

  // Ligne 3 : Faculté
  doc.font("Helvetica-Bold").fontSize(10);
  doc.text("FACULTÉ DES SCIENCES", margin, 62, { align: "left" });
  doc.text("FACULTY OF SCIENCE", pageW - margin - 150, 62, { align: "right" });

  // Ligne 4 : Département
  doc.font("Helvetica-Bold").fontSize(10);
  doc.text("DÉPARTEMENT D'INFORMATIQUE", margin, 79, { align: "left" });
  doc.text("DEPARTMENT OF COMPUTER SCIENCE", pageW - margin - 150, 79, {
    align: "right",
  });

  // Trait séparateur
  doc
    .moveTo(margin, 98)
    .lineTo(pageW - margin, 98)
    .lineWidth(0.5)
    .stroke("#CCCCCC");

  // Titre du document (Relevé de notes / Transcript)
  doc.fillColor("#000000").font("Helvetica-Bold").fontSize(16);
  doc.text(titreDocument, margin, 115, {
    align: "center",
    width: pageW - margin * 2,
  });

  doc
    .moveTo(margin, 138)
    .lineTo(pageW - margin, 138)
    .lineWidth(0.5)
    .stroke("#000000");

  doc.y = 160;
}

// ─── Fiche étudiant (inchangée, mais on ajuste les positions Y) ────────────
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

// ─── Tableau des notes (inchangé) ──────────────────────────────────────────
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

// ─── Bilan récapitulatif (inchangé) ────────────────────────────────────────
function drawSummary(doc, summary, rang) {
  const margin = 40;
  const pageW = doc.page.width;
  let y = doc.y;

  const colGauche = margin;
  const colDroite = pageW - margin - 150;

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

  doc.font("Helvetica").fontSize(9);
  doc.text("Moyenne Générale : ", colDroite, y, { continued: true });
  doc.font("Helvetica-Bold").fontSize(9);
  doc.text(`${formatNumber(summary.moyenneGenerale, 2)}`, {
    continued: true,
  });
  doc.font("Helvetica").fontSize(9);
  doc.text(" / 20", { continued: false });

  y += 18;

  doc.font("Helvetica").fontSize(9);
  doc.text("Moyenne Générale Pondérée (MGP) : ", colGauche, y, {
    continued: true,
  });
  doc.font("Helvetica-Bold").fontSize(9);
  doc.text(`${formatNumber(summary.mgp, 2)}`, { continued: true });
  doc.font("Helvetica").fontSize(9);
  doc.text(" / 4", { continued: false });

  if (rang) {
    doc.font("Helvetica").fontSize(9);
    doc.text("Rang : ", colDroite, y, { continued: true });
    doc.font("Helvetica-Bold").fontSize(9);
    doc.text(`${rang}`, { continued: false });
  }

  y += 18;

  doc.font("Helvetica").fontSize(9);
  doc.text("Décision : ", colGauche, y, { continued: true });
  if (summary.estAdmis) {
    doc.font("Helvetica-Bold").fontSize(10).text("ADMIS", { continued: false });
  } else {
    doc.font("Helvetica-Bold").fontSize(10).text("ECHEC", { continued: false });
  }

  doc.y = y + 30;
}

// ─── Pied de page avec signatures (inchangé) ────────────────────────────────
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

// ─── Génération du relevé de notes (appel modifié) ─────────────────────────
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

  // On utilise la nouvelle fonction d'en-tête (sans paramètre d'établissement)
  drawOfficialHeader(doc, "RELEVÉ DE NOTES / TRANSCRIPT");
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

// ─── (Optionnel) Certificat de scolarité (commenté, inchangé) ──────────────
// ...

module.exports = {
  generateRelevePdf,
  // generateCertificatePdf,
};