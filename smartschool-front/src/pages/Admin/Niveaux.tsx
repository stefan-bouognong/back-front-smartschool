import { useState, useEffect } from 'react';
import { getAllNiveaux, createNiveau, updateNiveau, deleteNiveau, getAllDepartements } from '../../api/admin';
import type { Niveau, Departement } from '../../api/admin';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { PageTable } from '../../components/Common/PageTable';
import { AppModal } from '../../components/Common/Modal';

const Niveaux = () => {
  const [data, setData] = useState<Niveau[]>([]);
  const [departements, setDepartements] = useState<Departement[]>([]);
  const [filtered, setFiltered] = useState<Niveau[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Niveau | null>(null);
  const [form, setForm] = useState<Partial<Niveau>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [nivRes, depRes] = await Promise.all([getAllNiveaux(), getAllDepartements()]);
      setData(nivRes.data); setFiltered(nivRes.data); setDepartements(depRes.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!search.trim()) { setFiltered(data); return; }
    const t = search.toLowerCase();
    setFiltered(data.filter(n => n.libelle_niveau?.toLowerCase().includes(t)));
  }, [search, data]);

  const getDept = (id?: number) => departements.find(d => d.id_departement === id)?.nom_dept || '—';

  const openCreate = () => { setEditing(null); setForm({}); setError(''); setModalOpen(true); };
  const openEdit = (item: Niveau) => { setEditing(item); setForm({ ...item }); setError(''); setModalOpen(true); };
  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce niveau ?')) return;
    try { await deleteNiveau(id); load(); } catch { alert('Erreur'); }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      if (editing) await updateNiveau(editing.id_niveau, form);
      else await createNiveau(form);
      setModalOpen(false); load();
    } catch (err: any) { setError(err.response?.data?.message || 'Erreur'); }
    finally { setSaving(false); }
  };

  const columns = [
    { key: 'id', label: '#', render: (row: Niveau) => <span className="badge badge-gray">#{row.id_niveau}</span> },
    { key: 'libelle_niveau', label: 'Libellé', render: (row: Niveau) => <span style={{ fontWeight: 600 }}>{row.libelle_niveau}</span> },
    { key: 'departement', label: 'Département', render: (row: Niveau) => (
      <span className="badge badge-primary">{getDept(row.id_departement)}</span>
    )},
    { key: 'actions', label: 'Actions', align: 'center' as const, render: (row: Niveau) => (
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button className="btn btn-icon btn-icon-edit" onClick={() => openEdit(row)}><FiEdit size={15} /></button>
        <button className="btn btn-icon btn-icon-delete" onClick={() => handleDelete(row.id_niveau)}><FiTrash2 size={15} /></button>
      </div>
    )},
  ];

  return (
    <>
      <PageTable
        title="Niveaux"
        subtitle="Gérez les niveaux d'étude par département"
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="Aucun niveau trouvé"
        searchValue={search}
        onSearch={setSearch}
        searchPlaceholder="Rechercher par libellé..."
        getKey={row => row.id_niveau}
        actions={<button className="btn btn-success" onClick={openCreate}><FiPlus size={16} /> Ajouter</button>}
      />

      <AppModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier le niveau' : 'Nouveau niveau'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Annuler</button>
            <button className="btn btn-primary" form="niveau-form" type="submit" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </>
        }
      >
        {error && <div className="alert alert-error">{error}</div>}
        <form id="niveau-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Libellé <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input type="text" required className="form-control" value={form.libelle_niveau || ''} onChange={e => setForm({ ...form, libelle_niveau: e.target.value })} placeholder="Ex: Licence 3 Informatique" />
          </div>
          <div className="form-group">
            <label className="form-label">Département <span style={{ color: 'var(--danger)' }}>*</span></label>
            <select required className="form-control" value={form.id_departement || ''} onChange={e => setForm({ ...form, id_departement: parseInt(e.target.value) })}>
              <option value="">Sélectionner un département</option>
              {departements.map(d => <option key={d.id_departement} value={d.id_departement}>{d.nom_dept}</option>)}
            </select>
          </div>
        </form>
      </AppModal>
    </>
  );
};

export default Niveaux;