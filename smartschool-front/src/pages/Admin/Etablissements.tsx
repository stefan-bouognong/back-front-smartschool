import { useState, useEffect } from 'react';
import { getAllEtablissements, createEtablissement, updateEtablissement, deleteEtablissement } from '../../api/admin';
import type { Etablissement } from '../../api/admin';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import Sidebar from '../../components/Layout/Sidebar';

const Etablissements = () => {
  const [data, setData] = useState<Etablissement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Etablissement | null>(null);
  const [form, setForm] = useState<Partial<Etablissement>>({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllEtablissements();
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({}); setModalOpen(true); };
  const openEdit = (item: Etablissement) => { setEditing(item); setForm(item); setModalOpen(true); };
  const handleDelete = async (id: number) => {
    if (confirm('Supprimer cet établissement ?')) {
      await deleteEtablissement(id);
      load();
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) await updateEtablissement(editing.id_etablissement, form);
      else await createEtablissement(form);
      setModalOpen(false);
      load();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur');
    }
  };

  return (
    <div className="flex">
    <Sidebar />
    <div className="flex-1 ml-64">
        <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Établissements</h1>
          <button onClick={openCreate} className="bg-green-600 text-white px-3 py-2 rounded flex items-center gap-2"><FiPlus /> Ajouter</button>
        </div>
        {loading ? <p className="text-center">Chargement...</p> : (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead><tr className="bg-gray-100"><th className="border p-2">ID</th><th className="border p-2">Nom</th><th className="border p-2">Adresse</th><th className="border p-2">Ville</th><th className="border p-2">Téléphone</th><th className="border p-2">Actions</th></tr></thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.id_etablissement}>
                    <td className="border p-2">{item.id_etablissement}</td>
                    <td className="border p-2">{item.nom_etablissement}</td>
                    <td className="border p-2">{item.adresse || '-'}</td>
                    <td className="border p-2">{item.ville || '-'}</td>
                    <td className="border p-2">{item.telephone || '-'}</td>
                    <td className="border p-2">
                      <button onClick={() => openEdit(item)} className="text-blue-600 mr-2"><FiEdit /></button>
                      <button onClick={() => handleDelete(item.id_etablissement)} className="text-red-600"><FiTrash2 /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editing ? 'Modifier' : 'Ajouter'} un établissement</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3"><label className="block">Nom *</label><input type="text" required className="w-full border rounded px-2 py-1" value={form.nom_etablissement || ''} onChange={e => setForm({ ...form, nom_etablissement: e.target.value })} /></div>
              <div className="mb-3"><label className="block">Adresse</label><textarea className="w-full border rounded px-2 py-1" value={form.adresse || ''} onChange={e => setForm({ ...form, adresse: e.target.value })} /></div>
              <div className="mb-3"><label className="block">Ville</label><input type="text" className="w-full border rounded px-2 py-1" value={form.ville || ''} onChange={e => setForm({ ...form, ville: e.target.value })} /></div>
              <div className="mb-3"><label className="block">Téléphone</label><input type="text" className="w-full border rounded px-2 py-1" value={form.telephone || ''} onChange={e => setForm({ ...form, telephone: e.target.value })} /></div>
              <div className="flex justify-end gap-2"><button type="button" onClick={() => setModalOpen(false)} className="bg-gray-300 px-4 py-1 rounded">Annuler</button><button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Enregistrer</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
    </div>
  );
};

export default Etablissements;