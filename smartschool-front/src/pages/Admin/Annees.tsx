import { useState, useEffect } from 'react';
import { getAllAnnees, createAnnee, updateAnnee, deleteAnnee } from '../../api/admin';
import type { AnneeAcademique } from '../../api/admin';
import { FiEdit, FiTrash2, FiPlus, FiCalendar } from 'react-icons/fi';
import { PageTable } from '../../components/Common/PageTable';
import { AppModal } from '../../components/Common/Modal';

const Annees = () => {
  const [data, setData] = useState<AnneeAcademique[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AnneeAcademique | null>(null);
  const [form, setForm] = useState<Partial<AnneeAcademique>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try { const res = await getAllAnnees(); setData(res.data); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({}); setError(''); setModalOpen(true); };
  const openEdit = (item: AnneeAcademique) => { setEditing(item); setForm({ ...item }); setError(''); setModalOpen(true); };
  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette année académique ?')) return;
    try { await deleteAnnee(id); load(); } catch { alert('Erreur'); }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      if (editing) await updateAnnee(editing.id_annee, form);
      else await createAnnee(form);
      setModalOpen(false); load();
    } catch (err: any) { setError(err.response?.data?.message || 'Erreur'); }
    finally { setSaving(false); }
  };

  const columns = [
    { key: 'id', label: '#', render: (row: AnneeAcademique) => <span className="badge badge-gray">#{row.id_annee}</span> },
    { key: 'libelle_annee', label: 'Année académique', render: (row: AnneeAcademique) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FiCalendar size={15} />
        </div>
        <span style={{ fontWeight: 600 }}>{row.libelle_annee}</span>
      </div>
    )},
    { key: 'actions', label: 'Actions', align: 'center' as const, render: (row: AnneeAcademique) => (
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button className="btn btn-icon btn-icon-edit" onClick={() => openEdit(row)}><FiEdit size={15} /></button>
        <button className="btn btn-icon btn-icon-delete" onClick={() => handleDelete(row.id_annee)}><FiTrash2 size={15} /></button>
      </div>
    )},
  ];

  return (
    <>
      <PageTable
        title="Années académiques"
        subtitle="Gérez les années académiques"
        columns={columns}
        data={data}
        loading={loading}
        emptyMessage="Aucune année académique"
        getKey={row => row.id_annee}
        actions={<button className="btn btn-success" onClick={openCreate}><FiPlus size={16} /> Ajouter</button>}
      />

      <AppModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier l\'année' : 'Nouvelle année académique'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Annuler</button>
            <button className="btn btn-primary" form="annee-form" type="submit" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </>
        }
      >
        {error && <div className="alert alert-error">{error}</div>}
        <form id="annee-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Libellé <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input
              type="text" required className="form-control"
              value={form.libelle_annee || ''}
              onChange={e => setForm({ ...form, libelle_annee: e.target.value })}
              placeholder="Ex: 2024-2025"
            />
          </div>
        </form>
      </AppModal>
    </>
  );
};

export default Annees;