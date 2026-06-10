import { useState, useEffect } from 'react';
import { getAllDepartements, createDepartement, updateDepartement, deleteDepartement, getAllEtablissements } from '../../api/admin';
import type { Departement, Etablissement } from '../../api/admin';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { PageTable } from '../../components/Common/PageTable';
import { AppModal } from '../../components/Common/Modal';

const Departements = () => {
  const [data, setData] = useState<Departement[]>([]);
  const [etablissements, setEtablissements] = useState<Etablissement[]>([]);
  const [filtered, setFiltered] = useState<Departement[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Departement | null>(null);
  const [form, setForm] = useState<Partial<Departement>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [depRes, etabRes] = await Promise.all([getAllDepartements(), getAllEtablissements()]);
      setData(depRes.data);
      setFiltered(depRes.data);
      setEtablissements(etabRes.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!search.trim()) { setFiltered(data); return; }
    const t = search.toLowerCase();
    setFiltered(data.filter(d => d.nom_dept?.toLowerCase().includes(t)));
  }, [search, data]);

  const getEtab = (id?: number) => etablissements.find(e => e.id_etablissement === id)?.nom_etablissement || '—';

  const openCreate = () => { setEditing(null); setForm({}); setError(''); setModalOpen(true); };
  const openEdit = (item: Departement) => { setEditing(item); setForm({ ...item }); setError(''); setModalOpen(true); };
  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce département ?')) return;
    try { await deleteDepartement(id); load(); } catch { alert('Erreur'); }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      if (editing) await updateDepartement(editing.id_departement, form);
      else await createDepartement(form);
      setModalOpen(false); load();
    } catch (err: any) { setError(err.response?.data?.message || 'Erreur'); }
    finally { setSaving(false); }
  };

  const columns = [
    { key: 'id', label: '#', render: (row: Departement) => <span className="badge badge-gray">#{row.id_departement}</span> },
    { key: 'nom_dept', label: 'Département', render: (row: Departement) => <span style={{ fontWeight: 600 }}>{row.nom_dept}</span> },
    { key: 'etablissement', label: 'Établissement', render: (row: Departement) => (
      <span className="badge badge-primary">{getEtab(row.id_etablissement)}</span>
    )},
    { key: 'actions', label: 'Actions', align: 'center' as const, render: (row: Departement) => (
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button className="btn btn-icon btn-icon-edit" onClick={() => openEdit(row)}><FiEdit size={15} /></button>
        <button className="btn btn-icon btn-icon-delete" onClick={() => handleDelete(row.id_departement)}><FiTrash2 size={15} /></button>
      </div>
    )},
  ];

  return (
    <>
      <PageTable
        title="Départements"
        subtitle="Gérez les départements et leurs établissements"
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="Aucun département trouvé"
        searchValue={search}
        onSearch={setSearch}
        searchPlaceholder="Rechercher par nom..."
        getKey={row => row.id_departement}
        actions={
          <button className="btn btn-success" onClick={openCreate}>
            <FiPlus size={16} /> Ajouter
          </button>
        }
      />

      <AppModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier le département' : 'Nouveau département'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Annuler</button>
            <button className="btn btn-primary" form="dept-form" type="submit" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </>
        }
      >
        {error && <div className="alert alert-error">{error}</div>}
        <form id="dept-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nom du département <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input type="text" required className="form-control" value={form.nom_dept || ''} onChange={e => setForm({ ...form, nom_dept: e.target.value })} placeholder="Ex: Informatique" />
          </div>
          <div className="form-group">
            <label className="form-label">Établissement <span style={{ color: 'var(--danger)' }}>*</span></label>
            <select required className="form-control" value={form.id_etablissement || ''} onChange={e => setForm({ ...form, id_etablissement: parseInt(e.target.value) })}>
              <option value="">Sélectionner un établissement</option>
              {etablissements.map(e => <option key={e.id_etablissement} value={e.id_etablissement}>{e.nom_etablissement}</option>)}
            </select>
          </div>
        </form>
      </AppModal>
    </>
  );
};

export default Departements;