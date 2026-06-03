import { useState, useEffect } from 'react';
import { getAllUEs, createUE, type UE } from '../../api/academique';
import { getAllNiveaux,type  Niveau } from '../../api/admin';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const UEs = () => {
  const [data, setData] = useState<UE[]>([]);
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<UE | null>(null);
  const [form, setForm] = useState<Partial<UE>>({});
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [ueRes, nivRes] = await Promise.all([getAllUEs(), getAllNiveaux()]);
      setData(ueRes.data);
      setNiveaux(nivRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({}); setModalOpen(true); };
  const openEdit = (item: UE) => { setEditing(item); setForm(item); setModalOpen(true); };
  const handleDelete = async (id: number) => {
    if (confirm('Supprimer cette UE ?')) {
      // Note : votre backend n'a pas encore de DELETE pour UE, à ajouter si besoin
      alert('Fonction de suppression non implémentée dans le backend');
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        // Pas de update dans le backend pour l'instant
        alert('Modification non implémentée');
      } else {
        await createUE(form);
      }
      setModalOpen(false);
      load();
    } catch (err: any) {
      setError(err.response?.data?.erreur || 'Erreur');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Unités d'Enseignement</h1>
        <button onClick={openCreate} className="bg-green-600 text-white px-3 py-2 rounded flex items-center gap-2"><FiPlus /> Ajouter UE</button>
      </div>
      {loading ? <p>Chargement...</p> : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full border">
            <thead><tr className="bg-gray-100"><th className="border p-2">Code</th><th className="border p-2">Libellé</th><th className="border p-2">Crédits</th><th className="border p-2">Niveau</th><th className="border p-2">Actions</th></tr></thead>
            <tbody>
              {data.map(ue => (
                <tr key={ue.id_UE}>
                  <td className="border p-2">{ue.code_UE}</td>
                  <td className="border p-2">{ue.libelle_UE}</td>
                  <td className="border p-2">{ue.credits_ECTS}</td>
                  <td className="border p-2">{ue.Niveau?.libelle_niveau || '-'}</td>
                  <td className="border p-2">
                    <button onClick={() => openEdit(ue)} className="text-blue-600 mr-2"><FiEdit /></button>
                    <button onClick={() => handleDelete(ue.id_UE)} className="text-red-600"><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal création */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editing ? 'Modifier UE' : 'Ajouter UE'}</h2>
            {error && <div className="bg-red-100 p-2 mb-2">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-2"><label>Code *</label><input type="text" required className="w-full border px-2 py-1" value={form.code_UE || ''} onChange={e => setForm({...form, code_UE: e.target.value})} /></div>
              <div className="mb-2"><label>Libellé *</label><input type="text" required className="w-full border px-2 py-1" value={form.libelle_UE || ''} onChange={e => setForm({...form, libelle_UE: e.target.value})} /></div>
              <div className="mb-2"><label>Crédits ECTS</label><input type="number" step="0.5" className="w-full border px-2 py-1" value={form.credits_ECTS || ''} onChange={e => setForm({...form, credits_ECTS: parseFloat(e.target.value)})} /></div>
              <div className="mb-2"><label>Niveau *</label><select required className="w-full border px-2 py-1" value={form.id_niveau || ''} onChange={e => setForm({...form, id_niveau: parseInt(e.target.value)})}><option value="">Sélectionner</option>{niveaux.map(n => <option key={n.id_niveau} value={n.id_niveau}>{n.libelle_niveau}</option>)}</select></div>
              <div className="flex justify-end gap-2 mt-4"><button type="button" onClick={() => setModalOpen(false)} className="bg-gray-300 px-3 py-1">Annuler</button><button type="submit" className="bg-blue-600 text-white px-3 py-1">Enregistrer</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default UEs;