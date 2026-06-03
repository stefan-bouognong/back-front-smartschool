import { useState, useEffect } from 'react';
import client from '../../api/client';

interface Etudiant {
  id_etudiant: number;
  matricule: string;
  nom_etud: string;
  prenom_etud: string;
  email: string;
  Inscriptions?: any[];
}

const Etudiants = () => {
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtered, setFiltered] = useState<Etudiant[]>([]);
  const [selected, setSelected] = useState<Etudiant | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadEtudiants();
  }, []);

  const loadEtudiants = async () => {
    setLoading(true);
    try {
      const res = await client.get('/scolarite/etudiants');
      setEtudiants(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      setFiltered(etudiants);
    } else {
      const term = searchTerm.toLowerCase();
      const filteredList = etudiants.filter(
        e => e.matricule?.toLowerCase().includes(term) ||
             e.nom_etud?.toLowerCase().includes(term) ||
             e.prenom_etud?.toLowerCase().includes(term) ||
             e.email?.toLowerCase().includes(term)
      );
      setFiltered(filteredList);
    }
  }, [searchTerm, etudiants]);

  const handleViewDetails = (etudiant: Etudiant) => {
    setSelected(etudiant);
    setModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Étudiants</h1>
      </div>

      {/* Recherche */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <input
          type="text"
          placeholder="Rechercher par matricule, nom, prénom ou email..."
          className="w-full border rounded px-3 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Matricule</th>
                <th className="border p-2">Nom complet</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(etudiant => (
                <tr key={etudiant.id_etudiant}>
                  <td className="border p-2">{etudiant.matricule || '-'}</td>
                  <td className="border p-2">{etudiant.prenom_etud} {etudiant.nom_etud}</td>
                  <td className="border p-2">{etudiant.email}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleViewDetails(etudiant)}
                      className="bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-4">Aucun étudiant trouvé</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal détails (inchangé) */}
      {modalOpen && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Détails étudiant</h2>
            <div className="space-y-2">
              <p><strong>Matricule :</strong> {selected.matricule || '-'}</p>
              <p><strong>Nom :</strong> {selected.nom_etud}</p>
              <p><strong>Prénom :</strong> {selected.prenom_etud}</p>
              <p><strong>Email :</strong> {selected.email}</p>
              <p><strong>Inscriptions :</strong></p>
              {selected.Inscriptions && selected.Inscriptions.length > 0 ? (
                <ul className="list-disc pl-5">
                  {selected.Inscriptions.map((ins: any) => (
                    <li key={ins.id_inscription}>
                      Année: {ins.Annee?.libelle_annee} - Niveau: {ins.Niveau?.libelle_niveau}
                      {ins.statut_paiement ? ' (Payé)' : ' (Impayé)'}
                    </li>
                  ))}
                </ul>
              ) : <p>Aucune inscription</p>}
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={() => setModalOpen(false)} className="bg-gray-300 px-4 py-1 rounded">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Etudiants;