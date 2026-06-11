const PDFDocument = require('pdfkit');
const { Etudiant, Inscription, PayerTranche, Tranche, Niveau, Departement, Etablissement, Annee } = require('../../database/models');
const { BusinessError } = require('./finance.service');

/**
 * Génère un reçu PDF pour les paiements d'un étudiant identifié par son matricule.
 * Retourne un ReadableStream (le document PDF).
 */
exports.generateReceipt = async (matricule) => {
  // 1. Récupérer l'étudiant
  const etudiant = await Etudiant.findOne({ where: { matricule } });
  if (!etudiant) throw new BusinessError('Étudiant introuvable avec ce matricule');

  // 2. Récupérer la dernière inscription avec les relations
  const inscription = await Inscription.findOne({
    where: { id_etudiant: etudiant.id_etudiant },
    order: [['date_inscription', 'DESC']],
    include: [
      { model: Niveau, include: [{ model: Departement, include: [Etablissement] }] },
      { model: Annee }
    ]
  });
  if (!inscription) throw new BusinessError('Aucune inscription trouvée pour cet étudiant');

  // 3. Récupérer les paiements effectués
  const paiements = await PayerTranche.findAll({
    where: { id_inscription: inscription.id_inscription },
    include: [{ model: Tranche, as: 'Tranche' }],
    order: [['id_tranche', 'ASC']]
  });

  if (!paiements || paiements.length === 0) {
    throw new BusinessError('Aucun paiement enregistré pour cet étudiant');
  }

  // 4. Extraire les infos
  const nomComplet = `${etudiant.nom_etud || ''} ${etudiant.prenom_etud || ''}`.trim();
  const niveau = inscription.Niveau?.libelle_niveau || 'N/A';
  const departement = inscription.Niveau?.Departement?.nom_dept || 'N/A';
  const etablissement = inscription.Niveau?.Departement?.Etablissement?.nom_etablissement || 'Université de Yaoundé I';
  const annee = inscription.Annee?.libelle_annee || 'N/A';

  let totalPaye = 0;
  paiements.forEach(p => { totalPaye += (p.montant_verse || 0); });

  // 5. Générer le PDF
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  // --- En-tête ---
  const primaryColor = '#1e40af';
  const successColor = '#059669';
  const textColor = '#1e293b';
  const mutedColor = '#64748b';
  const borderColor = '#e2e8f0';

  // Barre supérieure
  doc.rect(0, 0, doc.page.width, 6).fill(primaryColor);

  // Titre de l'université
  doc.moveDown(1.5);
  doc.fontSize(11).fillColor(mutedColor).text('RÉPUBLIQUE DU CAMEROUN', { align: 'center' });
  doc.fontSize(9).text('Paix – Travail – Patrie', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(16).fillColor(primaryColor).font('Helvetica-Bold').text(etablissement.toUpperCase(), { align: 'center' });
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor(mutedColor).font('Helvetica').text(`Année Académique : ${annee}`, { align: 'center' });

  // Ligne de séparation
  doc.moveDown(1);
  doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).strokeColor(borderColor).lineWidth(1).stroke();

  // Titre du reçu
  doc.moveDown(1);
  doc.fontSize(20).fillColor(textColor).font('Helvetica-Bold').text('REÇU DE PAIEMENT', { align: 'center' });
  doc.fontSize(10).fillColor(mutedColor).font('Helvetica').text(`Référence : REC-${matricule}-${Date.now().toString(36).toUpperCase()}`, { align: 'center' });
  doc.moveDown(0.3);
  doc.fontSize(10).text(`Date d'émission : ${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}`, { align: 'center' });

  // --- Informations de l'étudiant ---
  doc.moveDown(1.5);
  const infoY = doc.y;
  doc.roundedRect(50, infoY, doc.page.width - 100, 120, 8).fillAndStroke('#f8fafc', borderColor);
  
  doc.moveDown(0.8);
  const leftCol = 70;
  const rightCol = doc.page.width / 2 + 20;
  let yPos = infoY + 15;

  // Titre section
  doc.fontSize(11).fillColor(primaryColor).font('Helvetica-Bold').text('INFORMATIONS DE L\'ÉTUDIANT', leftCol, yPos);
  yPos += 22;

  // Lignes info
  const drawInfoLine = (label, value, x, y) => {
    doc.fontSize(9).fillColor(mutedColor).font('Helvetica').text(label, x, y);
    doc.fontSize(10).fillColor(textColor).font('Helvetica-Bold').text(value, x, y + 13);
  };

  drawInfoLine('Nom Complet', nomComplet, leftCol, yPos);
  drawInfoLine('Matricule', matricule, rightCol, yPos);
  yPos += 38;
  drawInfoLine('Département', departement, leftCol, yPos);
  drawInfoLine('Niveau', niveau, rightCol, yPos);

  // --- Tableau des paiements ---
  doc.y = infoY + 140;
  doc.moveDown(1);

  doc.fontSize(11).fillColor(primaryColor).font('Helvetica-Bold').text('DÉTAIL DES PAIEMENTS', 50);
  doc.moveDown(0.6);

  // En-tête du tableau
  const tableX = 50;
  const tableW = doc.page.width - 100;
  const colWidths = [tableW * 0.30, tableW * 0.25, tableW * 0.25, tableW * 0.20];
  let tableY = doc.y;

  // Header row
  doc.roundedRect(tableX, tableY, tableW, 30, 4).fill(primaryColor);
  doc.fontSize(9).fillColor('white').font('Helvetica-Bold');
  doc.text('Tranche', tableX + 12, tableY + 10, { width: colWidths[0] });
  doc.text('Montant Versé', tableX + colWidths[0] + 8, tableY + 10, { width: colWidths[1] });
  doc.text('Date Paiement', tableX + colWidths[0] + colWidths[1] + 8, tableY + 10, { width: colWidths[2] });
  doc.text('Mode', tableX + colWidths[0] + colWidths[1] + colWidths[2] + 8, tableY + 10, { width: colWidths[3] });

  tableY += 30;

  // Data rows
  paiements.forEach((p, i) => {
    const bg = i % 2 === 0 ? '#ffffff' : '#f8fafc';
    doc.rect(tableX, tableY, tableW, 28).fill(bg);
    doc.rect(tableX, tableY, tableW, 28).strokeColor(borderColor).lineWidth(0.5).stroke();

    const trancheLabel = p.Tranche?.libelle_tranche || `Tranche ${p.id_tranche}`;
    const montant = `${(p.montant_verse || 0).toLocaleString('fr-FR')} XAF`;
    const datePaiement = p.date_paiement
      ? new Date(p.date_paiement).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : 'N/A';
    const mode = p.mode_paiement || 'N/A';

    doc.fontSize(9).fillColor(textColor).font('Helvetica');
    doc.text(trancheLabel, tableX + 12, tableY + 9, { width: colWidths[0] });
    doc.font('Helvetica-Bold').text(montant, tableX + colWidths[0] + 8, tableY + 9, { width: colWidths[1] });
    doc.font('Helvetica').text(datePaiement, tableX + colWidths[0] + colWidths[1] + 8, tableY + 9, { width: colWidths[2] });
    doc.text(mode, tableX + colWidths[0] + colWidths[1] + colWidths[2] + 8, tableY + 9, { width: colWidths[3] });

    tableY += 28;
  });

  // Total row
  doc.rect(tableX, tableY, tableW, 32).fill('#f0fdf4');
  doc.rect(tableX, tableY, tableW, 32).strokeColor(successColor).lineWidth(1).stroke();
  doc.fontSize(11).fillColor(successColor).font('Helvetica-Bold');
  doc.text('TOTAL PAYÉ', tableX + 12, tableY + 10);
  doc.text(`${totalPaye.toLocaleString('fr-FR')} XAF`, tableX + colWidths[0] + 8, tableY + 10);

  // --- Statut ---
  tableY += 50;
  const statusText = inscription.statut_paiement ? '✓ PAIEMENT COMPLET' : '⏳ PAIEMENT PARTIEL';
  const statusBg = inscription.statut_paiement ? '#f0fdf4' : '#fffbeb';
  const statusBorder = inscription.statut_paiement ? successColor : '#f59e0b';
  const statusTextColor = inscription.statut_paiement ? successColor : '#b45309';

  const statusW = 220;
  const statusX = (doc.page.width - statusW) / 2;
  doc.roundedRect(statusX, tableY, statusW, 34, 6).fillAndStroke(statusBg, statusBorder);
  doc.fontSize(12).fillColor(statusTextColor).font('Helvetica-Bold').text(statusText, statusX, tableY + 10, { width: statusW, align: 'center' });

  // --- Pied de page ---
  const footerY = doc.page.height - 80;
  doc.moveTo(50, footerY).lineTo(doc.page.width - 50, footerY).strokeColor(borderColor).lineWidth(0.5).stroke();
  doc.fontSize(8).fillColor(mutedColor).font('Helvetica');
  doc.text('Ce document est généré électroniquement par la plateforme SmartSchool UY1.', 50, footerY + 10, { align: 'center', width: doc.page.width - 100 });
  doc.text('Il constitue une preuve de paiement des droits universitaires.', 50, footerY + 22, { align: 'center', width: doc.page.width - 100 });
  doc.text(`SmartSchool UY1 — ${new Date().getFullYear()}`, 50, footerY + 40, { align: 'center', width: doc.page.width - 100 });

  // Barre inférieure
  doc.rect(0, doc.page.height - 6, doc.page.width, 6).fill(primaryColor);

  doc.end();

  return { doc, nomComplet, matricule };
};
