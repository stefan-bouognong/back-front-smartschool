import { useState, useEffect } from 'react';
import { getAllEtudiants, type Etudiant, type Inscription } from '../../api/scolarite';
import { FiCheck, FiX } from 'react-icons/fi';
import { PageTable } from '../../components/Common/PageTable';

const Etudiants = () => {
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtered, setFiltered] = useState<Etudiant[]>([]);

  const loadEtudiants = async () => {
    setLoading(true);
    try {
      const res = await getAllEtudiants();
      setEtudiants(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEtudiants();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFiltered(etudiants);
    } else {
      const term = searchTerm.toLowerCase();
      setFiltered(etudiants.filter(e =>
        e.matricule?.toLowerCase().includes(term) ||
        e.nom_etud?.toLowerCase().includes(term) ||
        e.prenom_etud?.toLowerCase().includes(term) ||
        e.email?.toLowerCase().includes(term)
      ));
    }
  }, [searchTerm, etudiants]);

  const getPaiementIcon = (inscription: Inscription, trancheId: number) => {
    const tranches = inscription.PayerTranches ?? [];
    const paye = tranches.some(pt => Number(pt.id_tranche) === trancheId);
    return paye ? (
      <span className="badge badge-success"><FiCheck /> Payé</span>
    ) : (
      <span className="badge badge-danger"><FiX /> Impayé</span>
    );
  };

  // Aplatir les inscriptions pour afficher une ligne par inscription
  const inscriptionsList = filtered.flatMap(etudiant =>
    (etudiant.Inscriptions || []).map(inscription => ({
      ...inscription,
      etudiant
    }))
  );

  const columns = [
    { key: 'matricule', label: 'Matricule', render: (row: any) => <span className="badge badge-gray">{row.etudiant.matricule || '-'}</span> },
    { key: 'nom', label: 'Nom complet', render: (row: any) => <span style={{ fontWeight: 600 }}>{row.etudiant.prenom_etud} {row.etudiant.nom_etud}</span> },
    { key: 'email', label: 'Email', render: (row: any) => row.etudiant.email },
    { key: 'annee', label: 'Année académique', render: (row: any) => row.Annee?.libelle_annee || '-' },
    { key: 'niveau', label: 'Niveau', render: (row: any) => <span className="badge badge-primary">{row.Niveau?.libelle_niveau || '-'}</span> },
    { key: 'tranche1', label: '1ʳᵉ tranche', align: 'center' as const, render: (row: any) => getPaiementIcon(row, 1) },
    { key: 'tranche2', label: '2ᵉ tranche', align: 'center' as const, render: (row: any) => getPaiementIcon(row, 2) },
    { key: 'totalite', label: 'Totalité', align: 'center' as const, render: (row: any) => row.statut_paiement ? (
      <span className="badge badge-success"><FiCheck /> Payé</span>
    ) : (
      <span className="badge badge-danger"><FiX /> Impayé</span>
    ) },
  ];

  return (
    <PageTable
      title="Étudiants et inscriptions"
      subtitle="Consultez la liste des étudiants et le statut de leurs paiements"
      columns={columns}
      data={inscriptionsList}
      loading={loading}
      emptyMessage="Aucune inscription trouvée"
      searchValue={searchTerm}
      onSearch={setSearchTerm}
      searchPlaceholder="Rechercher par matricule, nom, prénom ou email..."
      getKey={row => row.id_inscription}
    />
  );
};

export default Etudiants;