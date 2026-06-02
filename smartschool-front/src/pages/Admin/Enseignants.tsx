import { useState, useEffect } from 'react';
import { getAllEnseignants, createEnseignant, updateEnseignant, deleteEnseignant, type Enseignant } from '../../api/admin';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

import Sidebar from '../../components/Layout/Sidebar';

const Enseignants = () => {
  const [data, setData] = useState<Enseignant[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Enseignant | null>(null);
  const [form, setForm] = useState<Partial<Enseignant>>({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllEnseignants();
      setData(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({}); setModalOpen(true); };
  const openEdit = (item: Enseignant) => { setEditing(item); setForm(item); setModalOpen(true); };
  const handleDelete = async (id: number) => { if (confirm('Supprimer ?')) { await deleteEnseignant(id); load(); } };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) await updateEnseignant(editing.id_enseignant, form);
      else await createEnseignant(form);
      setModalOpen(false);
      load();
    } catch (err: any) { alert(err.response?.data?.message || 'Erreur'); }
  };

  return (
    <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
                <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded shadow p-4">
        <div className="flex justify-between items-center mb-4"><h1 className="text-2xl font-bold">Enseignants</h1><button onClick={openCreate} className="bg-green-600 text-white px-3 py-2 rounded flex items-center gap-2"><FiPlus /> Ajouter</button></div>
        {loading ? <p>Chargement...</p> : (
          <div className="overflow-x-auto"><table className="min-w-full border"><thead><tr className="bg-gray-100"><th className="border p-2">ID</th><th className="border p-2">Nom</th><th className="border p-2">Prénom</th><th className="border p-2">Spécialité</th><th className="border p-2">Email</th><th className="border p-2">Téléphone</th><th className="border p-2">Actions</th></tr></thead><tbody>{data.map(item => (<tr key={item.id_enseignant}><td className="border p-2">{item.id_enseignant}</td><td className="border p-2">{item.nom_ens}</td><td className="border p-2">{item.prenom_ens}</td><td className="border p-2">{item.specialite || '-'}</td><td className="border p-2">{item.email || '-'}</td><td className="border p-2">{item.telephone || '-'}</td><td className="border p-2"><button onClick={() => openEdit(item)} className="text-blue-600 mr-2"><FiEdit /></button><button onClick={() => handleDelete(item.id_enseignant)} className="text-red-600"><FiTrash2 /></button></td></tr>))}</tbody></table></div>
        )}
      </div>
      {modalOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="bg-white rounded p-6 w-full max-w-md"><h2 className="text-xl font-bold mb-4">{editing ? 'Modifier' : 'Ajouter'} un enseignant</h2><form onSubmit={handleSubmit}><div className="mb-3"><label>Nom *</label><input type="text" required className="w-full border rounded px-2 py-1" value={form.nom_ens || ''} onChange={e => setForm({ ...form, nom_ens: e.target.value })} /></div><div className="mb-3"><label>Prénom *</label><input type="text" required className="w-full border rounded px-2 py-1" value={form.prenom_ens || ''} onChange={e => setForm({ ...form, prenom_ens: e.target.value })} /></div><div className="mb-3"><label>Spécialité</label><input type="text" className="w-full border rounded px-2 py-1" value={form.specialite || ''} onChange={e => setForm({ ...form, specialite: e.target.value })} /></div><div className="mb-3"><label>Email</label><input type="email" className="w-full border rounded px-2 py-1" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} /></div><div className="mb-3"><label>Téléphone</label><input type="text" className="w-full border rounded px-2 py-1" value={form.telephone || ''} onChange={e => setForm({ ...form, telephone: e.target.value })} /></div><div className="flex justify-end gap-2"><button type="button" onClick={() => setModalOpen(false)} className="bg-gray-300 px-4 py-1 rounded">Annuler</button><button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Enregistrer</button></div></form></div></div>)}
    </div>
        </div>
    </div>
  );
};

export default Enseignants;