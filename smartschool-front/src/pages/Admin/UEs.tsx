import { useState, useEffect } from 'react';
import { getAllUEs, createUE, updateUE, deleteUE, getAllNiveaux } from '../../api/admin';
import type { UE, Niveau } from '../../api/admin';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { PageTable } from '../../components/Common/PageTable';
import { AppModal } from '../../components/Common/Modal';

const UEs = () => {
  const [data, setData] = useState<UE[]>([]);
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [filtered, setFiltered] = useState<UE[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<UE | null>(null);
  const [form, setForm] = useState<Partial<UE>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [ueRes, nivRes] = await Promise.all([getAllUEs(), getAllNiveaux()]);
      setData(ueRes.data); setFiltered(ueRes.data); setNiveaux(nivRes.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!search.trim()) { setFiltered(data); return; }
    const t = search.toLowerCase();
    setFiltered(data.filter(u => u.code_UE?.toLowerCase().includes(t) || u.libelle_UE?.toLowerCase().includes(t)));
  }, [search, data]);

  const getNiveau = (id?: number) => niveaux.find(n => n.id_niveau === id)?.libelle_niveau || '—';

  const openCreate = () => { setEditing(null); setForm({}); setError(''); setModalOpen(true); };
  const openEdit = (item: UE) => { setEditing(item); setForm({ ...item }); setError(''); setModalOpen(true); };
  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette UE ?')) return;
    try { await deleteUE(id); load(); } catch { alert('Erreur'); }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      if (editing) await updateUE(editing.id_UE, form);
      else await createUE(form);
      setModalOpen(false); load();
    } catch (err: any) { setError(err.response?.data?.message || 'Erreur'); }
    finally { setSaving(false); }
  };

  const columns = [
    { key: 'code', label: 'Code', render: (row: UE) => (
      <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8125rem', color: 'var(--primary)', background: 'var(--primary-bg)', padding: '2px 8px', borderRadius: '4px' }}>{row.code_UE}</span>
    )},
    { key: 'libelle_UE', label: 'Intitulé', render: (row: UE) => <span style={{ fontWeight: 500 }}>{row.libelle_UE}</span> },
    { key: 'credits', label: 'ECTS', align: 'center' as const, render: (row: UE) => (
      <span className="badge badge-warning">{row.credits_ECTS} crédits</span>
    )},
    { key: 'niveau', label: 'Niveau', render: (row: UE) => (
      <span className="badge badge-primary">{getNiveau(row.id_niveau)}</span>
    )},
    { key: 'actions', label: 'Actions', align: 'center' as const, render: (row: UE) => (
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button className="btn btn-icon btn-icon-edit" onClick={() => openEdit(row)}><FiEdit size={15} /></button>
        <button className="btn btn-icon btn-icon-delete" onClick={() => handleDelete(row.id_UE)}><FiTrash2 size={15} /></button>
      </div>
    )},
  ];

  return (
    <>
      <PageTable
        title="Unités d'Enseignement"
        subtitle="Gérez les UE et leurs crédits ECTS"
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="Aucune UE trouvée"
        searchValue={search}
        onSearch={setSearch}
        searchPlaceholder="Rechercher par code ou intitulé..."
        getKey={row => row.id_UE}
        actions={<button className="btn btn-success" onClick={openCreate}><FiPlus size={16} /> Ajouter</button>}
      />

      <AppModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier l\'UE' : 'Nouvelle UE'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Annuler</button>
            <button className="btn btn-primary" form="ue-form" type="submit" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </>
        }
      >
        {error && <div className="alert alert-error">{error}</div>}
        <form id="ue-form" onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div className="form-group">
              <label className="form-label">Code UE <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input type="text" required className="form-control" value={form.code_UE || ''} onChange={e => setForm({ ...form, code_UE: e.target.value })} placeholder="Ex: INF301" />
            </div>
            <div className="form-group">
              <label className="form-label">Crédits ECTS</label>
              <input type="number" className="form-control" value={form.credits_ECTS || ''} onChange={e => setForm({ ...form, credits_ECTS: parseInt(e.target.value) })} placeholder="3" min="1" max="30" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Intitulé <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input type="text" required className="form-control" value={form.libelle_UE || ''} onChange={e => setForm({ ...form, libelle_UE: e.target.value })} placeholder="Ex: Bases de données avancées" />
          </div>
          <div className="form-group">
            <label className="form-label">Niveau <span style={{ color: 'var(--danger)' }}>*</span></label>
            <select required className="form-control" value={form.id_niveau || ''} onChange={e => setForm({ ...form, id_niveau: parseInt(e.target.value) })}>
              <option value="">Sélectionner un niveau</option>
              {niveaux.map(n => <option key={n.id_niveau} value={n.id_niveau}>{n.libelle_niveau}</option>)}
            </select>
          </div>
        </form>
      </AppModal>
    </>
  );
};

export default UEs;