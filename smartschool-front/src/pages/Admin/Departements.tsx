import { useState, useEffect } from 'react';
import { getAllDepartements, createDepartement, updateDepartement, deleteDepartement, getAllEtablissements, type Departement, type Etablissement} from '../../api/admin';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

import Sidebar from '../../components/Layout/Sidebar';

const Departements = () => {
  const [data, setData] = useState<Departement[]>([]);
  const [etablissements, setEtablissements] = useState<Etablissement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Departement | null>(null);
  const [form, setForm] = useState<Partial<Departement>>({});

  const load = async () => {
    setLoading(true);
    try {
      const [depRes, etabRes] = await Promise.all([getAllDepartements(), getAllEtablissements()]);
      setData(depRes.data);
      setEtablissements(etabRes.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({}); setModalOpen(true); };
  const openEdit = (item: Departement) => { setEditing(item); setForm(item); setModalOpen(true); };
  const handleDelete = async (id: number) => { if (confirm('Supprimer ?')) { await deleteDepartement(id); load(); } };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) await updateDepartement(editing.id_departement, form);
      else await createDepartement(form);
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
        <div className="flex justify-between items-center mb-4"><h1 className="text-2xl font-bold">Départements</h1><button onClick={openCreate} className="bg-green-600 text-white px-3 py-2 rounded flex items-center gap-2"><FiPlus /> Ajouter</button></div>
        {loading ? <p>Chargement...</p> : (
          <div className="overflow-x-auto"><table className="min-w-full border"><thead><tr className="bg-gray-100"><th className="border p-2">ID</th><th className="border p-2">Nom</th><th className="border p-2">Établissement</th><th className="border p-2">Actions</th></tr></thead><tbody>{data.map(item => (<tr key={item.id_departement}><td className="border p-2">{item.id_departement}</td><td className="border p-2">{item.nom_dept}</td><td className="border p-2">{etablissements.find(e => e.id_etablissement === item.id_etablissement)?.nom_etablissement || item.id_etablissement}</td><td className="border p-2"><button onClick={() => openEdit(item)} className="text-blue-600 mr-2"><FiEdit /></button><button onClick={() => handleDelete(item.id_departement)} className="text-red-600"><FiTrash2 /></button></td></tr>))}</tbody></table></div>
        )}
      </div>
      {modalOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="bg-white rounded p-6 w-full max-w-md"><h2 className="text-xl font-bold mb-4">{editing ? 'Modifier' : 'Ajouter'} un département</h2><form onSubmit={handleSubmit}><div className="mb-3"><label>Nom *</label><input type="text" required className="w-full border rounded px-2 py-1" value={form.nom_dept || ''} onChange={e => setForm({ ...form, nom_dept: e.target.value })} /></div><div className="mb-3"><label>Établissement *</label><select required className="w-full border rounded px-2 py-1" value={form.id_etablissement || ''} onChange={e => setForm({ ...form, id_etablissement: parseInt(e.target.value) })}><option value="">Sélectionner</option>{etablissements.map(e => <option key={e.id_etablissement} value={e.id_etablissement}>{e.nom_etablissement}</option>)}</select></div><div className="flex justify-end gap-2"><button type="button" onClick={() => setModalOpen(false)} className="bg-gray-300 px-4 py-1 rounded">Annuler</button><button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Enregistrer</button></div></form></div></div>)}
    </div>
        </div>
    </div>
  );
};

export default Departements;