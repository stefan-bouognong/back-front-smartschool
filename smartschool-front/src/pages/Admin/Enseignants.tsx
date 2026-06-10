import { useState, useEffect } from 'react';
import { getAllEnseignants, createEnseignant, updateEnseignant, deleteEnseignant } from '../../api/admin';
import type { Enseignant } from '../../api/admin';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { PageTable } from '../../components/Common/PageTable';
import { AppModal } from '../../components/Common/Modal';

const Enseignants = () => {
  const [data, setData] = useState<Enseignant[]>([]);
  const [filtered, setFiltered] = useState<Enseignant[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Enseignant | null>(null);
  const [form, setForm] = useState<Partial<Enseignant>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try { const res = await getAllEnseignants(); setData(res.data); setFiltered(res.data); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!search.trim()) { setFiltered(data); return; }
    const t = search.toLowerCase();
    setFiltered(data.filter(e =>
      e.nom_ens?.toLowerCase().includes(t) ||
      e.prenom_ens?.toLowerCase().includes(t) ||
      e.email?.toLowerCase().includes(t) ||
      e.specialite?.toLowerCase().includes(t)
    ));
  }, [search, data]);

  const openCreate = () => { setEditing(null); setForm({}); setError(''); setModalOpen(true); };
  const openEdit = (item: Enseignant) => { setEditing(item); setForm({ ...item }); setError(''); setModalOpen(true); };
  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet enseignant ?')) return;
    try { await deleteEnseignant(id); load(); } catch { alert('Erreur'); }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      if (editing) await updateEnseignant(editing.id_enseignant, form);
      else await createEnseignant(form);
      setModalOpen(false); load();
    } catch (err: any) { setError(err.response?.data?.message || 'Erreur'); }
    finally { setSaving(false); }
  };

  const getInitials = (ens: Enseignant) =>
    `${ens.prenom_ens?.charAt(0) ?? ''}${ens.nom_ens?.charAt(0) ?? ''}`.toUpperCase();

  const columns = [
    { key: 'name', label: 'Enseignant', render: (row: Enseignant) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
          background: 'var(--primary)',
          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.75rem', fontWeight: 700,
        }}>{getInitials(row)}</div>
        <div>
          <p style={{ fontWeight: 600, margin: 0 }}>{row.prenom_ens} {row.nom_ens}</p>
          {row.email && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{row.email}</p>}
        </div>
      </div>
    )},
    { key: 'specialite', label: 'Spécialité', render: (row: Enseignant) => row.specialite ? (
      <span className="badge badge-gray">{row.specialite}</span>
    ) : <span style={{ color: 'var(--text-muted)' }}>—</span> },
    { key: 'telephone', label: 'Téléphone', render: (row: Enseignant) => row.telephone || <span style={{ color: 'var(--text-muted)' }}>—</span> },
    { key: 'actions', label: 'Actions', align: 'center' as const, render: (row: Enseignant) => (
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button className="btn btn-icon btn-icon-edit" onClick={() => openEdit(row)}><FiEdit size={15} /></button>
        <button className="btn btn-icon btn-icon-delete" onClick={() => handleDelete(row.id_enseignant)}><FiTrash2 size={15} /></button>
      </div>
    )},
  ];

  return (
    <>
      <PageTable
        title="Enseignants"
        subtitle="Gérez le corps enseignant"
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="Aucun enseignant trouvé"
        searchValue={search}
        onSearch={setSearch}
        searchPlaceholder="Rechercher par nom, prénom, email ou spécialité..."
        getKey={row => row.id_enseignant}
        actions={<button className="btn btn-success" onClick={openCreate}><FiPlus size={16} /> Ajouter</button>}
      />

      <AppModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier l\'enseignant' : 'Nouvel enseignant'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Annuler</button>
            <button className="btn btn-primary" form="ens-form" type="submit" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </>
        }
      >
        {error && <div className="alert alert-error">{error}</div>}
        <form id="ens-form" onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div className="form-group">
              <label className="form-label">Nom <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input type="text" required className="form-control" value={form.nom_ens || ''} onChange={e => setForm({ ...form, nom_ens: e.target.value })} placeholder="Dupont" />
            </div>
            <div className="form-group">
              <label className="form-label">Prénom <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input type="text" required className="form-control" value={form.prenom_ens || ''} onChange={e => setForm({ ...form, prenom_ens: e.target.value })} placeholder="Jean" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Spécialité</label>
            <input type="text" className="form-control" value={form.specialite || ''} onChange={e => setForm({ ...form, specialite: e.target.value })} placeholder="Ex: Informatique, Mathématiques..." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@uy1.cm" />
            </div>
            <div className="form-group">
              <label className="form-label">Téléphone</label>
              <input type="text" className="form-control" value={form.telephone || ''} onChange={e => setForm({ ...form, telephone: e.target.value })} placeholder="+237 6XX..." />
            </div>
          </div>
        </form>
      </AppModal>
    </>
  );
};

export default Enseignants;