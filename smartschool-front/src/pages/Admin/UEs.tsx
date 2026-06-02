import { useState, useEffect } from 'react';
import { getAllUEs, createUE, updateUE, deleteUE, getAllNiveaux, type  UE, type Niveau } from '../../api/admin';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import Sidebar from '../../components/Layout/Sidebar';

const UEs = () => {
  const [data, setData] = useState<UE[]>([]);
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<UE | null>(null);
  const [form, setForm] = useState<Partial<UE>>({});

  const load = async () => {
    setLoading(true);
    try {
      const [ueRes, nivRes] = await Promise.all([getAllUEs(), getAllNiveaux()]);
      setData(ueRes.data);
      setNiveaux(nivRes.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({}); setModalOpen(true); };
  const openEdit = (item: UE) => { setEditing(item); setForm(item); setModalOpen(true); };
  const handleDelete = async (id: number) => { if (confirm('Supprimer ?')) { await deleteUE(id); load(); } };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) await updateUE(editing.id_UE, form);
      else await createUE(form);
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
        <div className="flex justify-between items-center mb-4"><h1 className="text-2xl font-bold">Unités d'Enseignement</h1><button onClick={openCreate} className="bg-green-600 text-white px-3 py-2 rounded flex items-center gap-2"><FiPlus /> Ajouter</button></div>
        {loading ? <p>Chargement...</p> : (
          <div className="overflow-x-auto"><table className="min-w-full border"><thead><tr className="bg-gray-100"><th className="border p-2">ID</th><th className="border p-2">Code</th><th className="border p-2">Libellé</th><th className="border p-2">Crédits ECTS</th><th className="border p-2">Niveau</th><th className="border p-2">Actions</th></tr></thead><tbody>{data.map(item => (<tr key={item.id_UE}><td className="border p-2">{item.id_UE}</td><td className="border p-2">{item.code_UE}</td><td className="border p-2">{item.libelle_UE}</td><td className="border p-2">{item.credits_ECTS}</td><td className="border p-2">{niveaux.find(n => n.id_niveau === item.id_niveau)?.libelle_niveau || item.id_niveau}</td><td className="border p-2"><button onClick={() => openEdit(item)} className="text-blue-600 mr-2"><FiEdit /></button><button onClick={() => handleDelete(item.id_UE)} className="text-red-600"><FiTrash2 /></button></td></tr>))}</tbody></table></div>
        )}
      </div>
      {modalOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="bg-white rounded p-6 w-full max-w-md"><h2 className="text-xl font-bold mb-4">{editing ? 'Modifier' : 'Ajouter'} une UE</h2><form onSubmit={handleSubmit}><div className="mb-3"><label>Code *</label><input type="text" required className="w-full border rounded px-2 py-1" value={form.code_UE || ''} onChange={e => setForm({ ...form, code_UE: e.target.value })} /></div><div className="mb-3"><label>Libellé *</label><input type="text" required className="w-full border rounded px-2 py-1" value={form.libelle_UE || ''} onChange={e => setForm({ ...form, libelle_UE: e.target.value })} /></div><div className="mb-3"><label>Crédits ECTS</label><input type="number" className="w-full border rounded px-2 py-1" value={form.credits_ECTS || ''} onChange={e => setForm({ ...form, credits_ECTS: parseInt(e.target.value) })} /></div><div className="mb-3"><label>Niveau *</label><select required className="w-full border rounded px-2 py-1" value={form.id_niveau || ''} onChange={e => setForm({ ...form, id_niveau: parseInt(e.target.value) })}><option value="">Sélectionner</option>{niveaux.map(n => <option key={n.id_niveau} value={n.id_niveau}>{n.libelle_niveau}</option>)}</select></div><div className="flex justify-end gap-2"><button type="button" onClick={() => setModalOpen(false)} className="bg-gray-300 px-4 py-1 rounded">Annuler</button><button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Enregistrer</button></div></form></div></div>)}
    </div>
        </div>

    </div>
  );
};

export default UEs;