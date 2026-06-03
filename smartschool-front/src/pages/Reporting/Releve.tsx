import { useState, useEffect } from 'react';
import client from '../../api/client';
import { FiDownload, FiSearch } from 'react-icons/fi';
import { getAllEtudiants} from '../../api/scolarite';

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
  const [selectedStudent, setSelectedStudent] = useState<Etudiant | null>(null);
  const [generating, setGenerating] = useState(false);

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
    setGenerating(true);
    try {
      // Appel au backend pour générer le PDF
      const response = await client.get(`/reporting/releve/${etudiantId}`, {
        responseType: 'blob', // Important pour recevoir un fichier PDF
      });
      // Créer un lien de téléchargement
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
      setGenerating(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Relevé de notes</h1>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par matricule, nom, prénom ou email..."
            className="w-full border rounded pl-10 pr-3 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center">Chargement des étudiants...</p>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Matricule</th>
                <th className="border p-2">Nom complet</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEtudiants.map((etudiant) => (
                <tr key={etudiant.id_etudiant}>
                  <td className="border p-2">{etudiant.matricule || '-'}</td>
                  <td className="border p-2">{etudiant.prenom_etud} {etudiant.nom_etud}</td>
                  <td className="border p-2">{etudiant.email}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleDownload(etudiant.id_etudiant)}
                      disabled={generating}
                      className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2 hover:bg-blue-700"
                    >
                      <FiDownload /> Télécharger relevé
                    </button>
                  </td>
                </tr>
              ))}
              {filteredEtudiants.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-4">
                    Aucun étudiant trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Releve;