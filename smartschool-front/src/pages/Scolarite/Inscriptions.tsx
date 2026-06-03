import { useState, useEffect } from 'react';
import { getAllInscriptions, deleteInscription, createInscription, type Inscription } from '../../api/scolarite';
import { getAllDepartements, getAllNiveaux, getAllAnnees, type Departement, type Niveau, type AnneeAcademique } from '../../api/admin';
import { FiTrash2, FiPlus, FiFilter } from 'react-icons/fi';

const Inscriptions = () => {
  const [data, setData] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ niveau: '', filiere: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    date_naissance: '',   // ← AJOUT : date de naissance (format YYYY-MM-DD)
    filiere: 0,
    niveau: 0
  });
  const [selectedAnnee, setSelectedAnnee] = useState<number>(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [departements, setDepartements] = useState<Departement[]>([]);
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [annees, setAnnees] = useState<AnneeAcademique[]>([]);
  const [filteredNiveaux, setFilteredNiveaux] = useState<Niveau[]>([]);

  const loadInscriptions = async () => {
    setLoading(true);
    try {
      const res = await getAllInscriptions(filters);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadSelectData = async () => {
      try {
        const [depRes, nivRes, anneeRes] = await Promise.all([
          getAllDepartements(),
          getAllNiveaux(),
          getAllAnnees()
        ]);
        setDepartements(depRes.data);
        setNiveaux(nivRes.data);
        setAnnees(anneeRes.data);
        if (anneeRes.data.length > 0) setSelectedAnnee(anneeRes.data[0].id_annee);
      } catch (err) {
        console.error(err);
      }
    };
    loadSelectData();
  }, []);

  useEffect(() => {
    loadInscriptions();
  }, [filters]);

  const handleDelete = async (id: number) => {
    if (confirm('Supprimer cette inscription ?')) {
      try {
        await deleteInscription(id);
        loadInscriptions();
      } catch (err) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleFiliereChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deptId = parseInt(e.target.value);
    setForm({ ...form, filiere: deptId, niveau: 0 });
    const filtered = niveaux.filter(n => n.id_departement === deptId);
    setFilteredNiveaux(filtered);
  };

  const resetForm = () => {
    setForm({
      nom: '',
      prenom: '',
      email: '',
      date_naissance: '',
      filiere: 0,
      niveau: 0
    });
    if (annees.length > 0) setSelectedAnnee(annees[0].id_annee);
    setFilteredNiveaux([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const selectedDept = departements.find(d => d.id_departement === form.filiere);
    const selectedNiveau = filteredNiveaux.find(n => n.id_niveau === form.niveau);
    const selectedAnneeObj = annees.find(a => a.id_annee === selectedAnnee);

    if (!selectedDept || !selectedNiveau || !selectedAnneeObj) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (!form.date_naissance) {
      setError('La date de naissance est obligatoire');
      return;
    }

    const payload = {
      nom: form.nom,
      prenom: form.prenom,
      email: form.email,
      date_naissance: form.date_naissance,   // ← AJOUT
      filiere: selectedDept.nom_dept,
      niveau: selectedNiveau.libelle_niveau,
      anneeLibelle: selectedAnneeObj.libelle_annee
    };

    try {
      await createInscription(payload);
      setSuccess('Inscription créée avec succès');
      setModalOpen(false);
      resetForm();
      loadInscriptions();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la création');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des inscriptions</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FiPlus /> Nouvelle inscription
        </button>
      </div>

      {/* Filtres (inchangés) */}
      <div className="bg-white p-4 rounded shadow mb-6 flex gap-4 items-end flex-wrap">
        <div>
          <label className="block text-sm font-medium">Filière</label>
          <input
            type="text"
            placeholder="Ex: INF"
            className="border rounded px-2 py-1"
            value={filters.filiere}
            onChange={(e) => setFilters({ ...filters, filiere: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Niveau</label>
          <input
            type="text"
            placeholder="Ex: M1"
            className="border rounded px-2 py-1"
            value={filters.niveau}
            onChange={(e) => setFilters({ ...filters, niveau: e.target.value })}
          />
        </div>
        <button
          onClick={() => setFilters({ niveau: '', filiere: '' })}
          className="bg-gray-500 text-white px-3 py-1 rounded"
        >
          Réinitialiser
        </button>
      </div>

      {/* Tableau des inscriptions */}
      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Étudiant</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Filière</th>
                <th className="border p-2">Niveau</th>
                <th className="border p-2">Année</th>
                <th className="border p-2">Statut paiement</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((ins) => (
                <tr key={ins.id_inscription}>
                  <td className="border p-2">
                    {ins.Etudiant?.prenom_etud} {ins.Etudiant?.nom_etud}
                  </td>
                  <td className="border p-2">{ins.Etudiant?.email}</td>
                  <td className="border p-2">{ins.Niveau?.Departement?.nom_dept}</td>
                  <td className="border p-2">{ins.Niveau?.libelle_niveau}</td>
                  <td className="border p-2">{ins.Annee?.libelle_annee || '-'}</td>
                  <td className="border p-2">
                    <span className={`px-2 py-1 rounded text-xs ${ins.statut_paiement ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                      {ins.statut_paiement ? 'Payé' : 'Impayé'}
                    </span>
                  </td>
                  <td className="border p-2">
                    <button onClick={() => handleDelete(ins.id_inscription)} className="text-red-600">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center p-4">Aucune inscription</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de création avec champ Date de naissance */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nouvelle inscription</h2>
            {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
            {success && <div className="bg-green-100 text-green-700 p-2 rounded mb-4">{success}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block">Nom *</label>
                <input type="text" required className="w-full border rounded px-2 py-1" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} />
              </div>
              <div className="mb-3">
                <label className="block">Prénom *</label>
                <input type="text" required className="w-full border rounded px-2 py-1" value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} />
              </div>
              <div className="mb-3">
                <label className="block">Email *</label>
                <input type="email" required className="w-full border rounded px-2 py-1" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div className="mb-3">
                <label className="block">Date de naissance *</label>
                <input
                  type="date"
                  required
                  className="w-full border rounded px-2 py-1"
                  value={form.date_naissance}
                  onChange={e => setForm({...form, date_naissance: e.target.value})}
                />
              </div>
              <div className="mb-3">
                <label className="block">Filière *</label>
                <select required className="w-full border rounded px-2 py-1" value={form.filiere} onChange={handleFiliereChange}>
                  <option value="0">Sélectionner une filière</option>
                  {departements.map(dept => (
                    <option key={dept.id_departement} value={dept.id_departement}>{dept.nom_dept}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="block">Niveau *</label>
                <select required className="w-full border rounded px-2 py-1" value={form.niveau} onChange={e => setForm({...form, niveau: parseInt(e.target.value)})}>
                  <option value="0">Sélectionner un niveau</option>
                  {filteredNiveaux.map(n => (
                    <option key={n.id_niveau} value={n.id_niveau}>{n.libelle_niveau}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="block">Année académique *</label>
                <select required className="w-full border rounded px-2 py-1" value={selectedAnnee} onChange={e => setSelectedAnnee(parseInt(e.target.value))}>
                  {annees.map(a => (
                    <option key={a.id_annee} value={a.id_annee}>{a.libelle_annee}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="bg-gray-300 px-4 py-1 rounded">Annuler</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Créer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inscriptions;