import { useState, useEffect } from 'react';
import client from '../../api/client';
import { FiDownload } from 'react-icons/fi';
import { getAllEtudiants} from '../../api/scolarite';
import { PageTable } from '../../components/Common/PageTable';

interface Etudiant {
  id_etudiant: number;
  matricule: string;
  nom_etud: string;
  prenom_etud: string;
  email: string;
}

const Releve = () => {
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [generating, setGenerating] = useState<number | null>(null);

  useEffect(() => {
    const loadEtudiants = async () => {
      try {
        const res = await getAllEtudiants();
        setEtudiants(res.data);
      } catch (err) {
        console.error('Erreur chargement étudiants', err);
      } finally {
        setLoading(false);
      }
    };
    loadEtudiants();
  }, []);

  const filteredEtudiants = etudiants.filter(
    (e) =>
      e.matricule?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.nom_etud?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.prenom_etud?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = async (etudiantId: number) => {
    setGenerating(etudiantId);
    try {
      const response = await client.get(`/reporting/releve/${etudiantId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `releve_notes_${etudiantId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 403) {
        alert('Paiement insuffisant : impossible de télécharger le relevé.');
      } else {
        alert('Erreur lors de la génération du relevé.');
      }
    } finally {
      setGenerating(null);
    }
  };

  const columns = [
    { key: 'matricule', label: 'Matricule', render: (row: Etudiant) => (
      <span className="badge badge-gray">{row.matricule || '-'}</span>
    )},
    { key: 'nom', label: 'Nom complet', render: (row: Etudiant) => (
      <span style={{ fontWeight: 600 }}>{row.prenom_etud} {row.nom_etud}</span>
    )},
    { key: 'email', label: 'Email', render: (row: Etudiant) => row.email },
    { key: 'actions', label: 'Action', align: 'center' as const, render: (row: Etudiant) => (
      <button
        onClick={() => handleDownload(row.id_etudiant)}
        disabled={generating === row.id_etudiant}
        className="btn btn-primary btn-sm"
        style={{ width: 'auto' }}
      >
        {generating === row.id_etudiant ? (
          <>
            <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
            Génération...
          </>
        ) : (
          <><FiDownload size={14} /> Relevé PDF</>
        )}
      </button>
    )},
  ];

  return (
    <PageTable
      title="Relevé de notes"
      subtitle="Téléchargez les relevés de notes des étudiants"
      columns={columns}
      data={filteredEtudiants}
      loading={loading}
      emptyMessage="Aucun étudiant trouvé"
      searchValue={searchTerm}
      onSearch={setSearchTerm}
      searchPlaceholder="Rechercher par matricule, nom, prénom ou email..."
      getKey={row => row.id_etudiant}
    />
  );
};

export default Releve;