import { useState, useEffect } from 'react';
import { getAllEtudiants, type Etudiant, type Inscription } from '../../api/scolarite';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

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
    return paye ? <FaCheckCircle className="text-lg text-green-600" /> : <FaTimesCircle className="text-lg text-red-600" />;
  };

  // Aplatir les inscriptions pour afficher une ligne par inscription
  const inscriptionsList = filtered.flatMap(etudiant =>
    (etudiant.Inscriptions || []).map(inscription => ({
      ...inscription,
      etudiant
    }))
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Étudiants et inscriptions</h1>
      </div>

      <div className="p-4 mb-6 bg-white rounded shadow">
        <input
          type="text"
          placeholder="Rechercher par matricule, nom, prénom ou email..."
          className="w-full px-3 py-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Matricule</th>
                <th className="p-2 border">Nom complet</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Année académique</th>
                <th className="p-2 border">Niveau</th>
                <th className="p-2 border">1ʳᵉ tranche</th>
                <th className="p-2 border">2ᵉ tranche</th>
                <th className="p-2 border">Totalité</th>
              </tr>
            </thead>
            <tbody>
              {inscriptionsList.map((ins) => (
                <tr key={ins.id_inscription}>
                  <td className="p-2 border">{ins.etudiant.matricule || '-'}</td>
                  <td className="p-2 border">{ins.etudiant.prenom_etud} {ins.etudiant.nom_etud}</td>
                  <td className="p-2 border">{ins.etudiant.email}</td>
                  <td className="p-2 border">{ins.Annee?.libelle_annee || '-'}</td>
                  <td className="p-2 border">{ins.Niveau?.libelle_niveau || '-'}</td>
                  <td className="p-2 text-center border">{getPaiementIcon(ins, 1)}</td>
                  <td className="p-2 text-center border">{getPaiementIcon(ins, 2)}</td>
                  <td className="p-2 text-center border">
                    {ins.statut_paiement ? <FaCheckCircle className="text-lg text-green-600" /> : <FaTimesCircle className="text-lg text-red-600" />}
                  </td>
                </tr>
              ))}
              {inscriptionsList.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-4 text-center">Aucune donnée</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Etudiants;