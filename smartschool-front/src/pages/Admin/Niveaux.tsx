import { useState, useEffect } from 'react';
import { getAllNiveaux, createNiveau, updateNiveau, deleteNiveau, getAllDepartements, type Niveau, type Departement } from '../../api/admin';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

import Sidebar from '../../components/Layout/Sidebar';
const Niveaux = () => {
  const [data, setData] = useState<Niveau[]>([]);
  const [departements, setDepartements] = useState<Departement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Niveau | null>(null);
  const [form, setForm] = useState<Partial<Niveau>>({});

  const load = async () => {
    setLoading(true);
    try {
      const [nivRes, depRes] = await Promise.all([getAllNiveaux(), getAllDepartements()]);
      setData(nivRes.data);
      setDepartements(depRes.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({}); setModalOpen(true); };
  const openEdit = (item: Niveau) => { setEditing(item); setForm(item); setModalOpen(true); };
  const handleDelete = async (id: number) => { if (confirm('Supprimer ?')) { await deleteNiveau(id); load(); } };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) await updateNiveau(editing.id_niveau, form);
      else await createNiveau(form);
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
        <div className="flex justify-between items-center mb-4"><h1 className="text-2xl font-bold">Niveaux</h1><button onClick={openCreate} className="bg-green-600 text-white px-3 py-2 rounded flex items-center gap-2"><FiPlus /> Ajouter</button></div>
        {loading ? <p>Chargement...</p> : (
          <div className="overflow-x-auto"><table className="min-w-full border"><thead><tr className="bg-gray-100"><th className="border p-2">ID</th><th className="border p-2">Libellé</th><th className="border p-2">Département</th><th className="border p-2">Actions</th></tr></thead><tbody>{data.map(item => (<tr key={item.id_niveau}><td className="border p-2">{item.id_niveau}</td><td className="border p-2">{item.libelle_niveau}</td><td className="border p-2">{departements.find(d => d.id_departement === item.id_departement)?.nom_dept || item.id_departement}</td><td className="border p-2"><button onClick={() => openEdit(item)} className="text-blue-600 mr-2"><FiEdit /></button><button onClick={() => handleDelete(item.id_niveau)} className="text-red-600"><FiTrash2 /></button></td></tr>))}</tbody></table></div>
        )}
      </div>
      {modalOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="bg-white rounded p-6 w-full max-w-md"><h2 className="text-xl font-bold mb-4">{editing ? 'Modifier' : 'Ajouter'} un niveau</h2><form onSubmit={handleSubmit}><div className="mb-3"><label>Libellé *</label><input type="text" required className="w-full border rounded px-2 py-1" value={form.libelle_niveau || ''} onChange={e => setForm({ ...form, libelle_niveau: e.target.value })} /></div><div className="mb-3"><label>Département *</label><select required className="w-full border rounded px-2 py-1" value={form.id_departement || ''} onChange={e => setForm({ ...form, id_departement: parseInt(e.target.value) })}><option value="">Sélectionner</option>{departements.map(d => <option key={d.id_departement} value={d.id_departement}>{d.nom_dept}</option>)}</select></div><div className="flex justify-end gap-2"><button type="button" onClick={() => setModalOpen(false)} className="bg-gray-300 px-4 py-1 rounded">Annuler</button><button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Enregistrer</button></div></form></div></div>)}
    </div>
        </div>
    </div>
  );
};

export default Niveaux;