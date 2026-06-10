import { useState, useEffect } from 'react';
import { getAllEtablissements, createEtablissement, updateEtablissement, deleteEtablissement } from '../../api/admin';
import type { Etablissement } from '../../api/admin';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { PageTable } from '../../components/Common/PageTable';
import { AppModal } from '../../components/Common/Modal';

const Etablissements = () => {
  const [data, setData] = useState<Etablissement[]>([]);
  const [filtered, setFiltered] = useState<Etablissement[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Etablissement | null>(null);
  const [form, setForm] = useState<Partial<Etablissement>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllEtablissements();
      setData(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(data);
    } else {
      const t = search.toLowerCase();
      setFiltered(data.filter(e =>
        e.nom_etablissement?.toLowerCase().includes(t) ||
        e.ville?.toLowerCase().includes(t) ||
        e.adresse?.toLowerCase().includes(t)
      ));
    }
  }, [search, data]);

  const openCreate = () => { setEditing(null); setForm({}); setError(''); setModalOpen(true); };
  const openEdit = (item: Etablissement) => { setEditing(item); setForm({ ...item }); setError(''); setModalOpen(true); };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet établissement ?')) return;
    try {
      await deleteEtablissement(id);
      load();
    } catch {
      alert('Erreur lors de la suppression');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) await updateEtablissement(editing.id_etablissement, form);
      else await createEtablissement(form);
      setModalOpen(false);
      load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: 'id_etablissement', label: '#', render: (row: Etablissement) => (
      <span className="badge badge-gray">#{row.id_etablissement}</span>
    )},
    { key: 'nom_etablissement', label: 'Nom de l\'établissement', render: (row: Etablissement) => (
      <span style={{ fontWeight: 600 }}>{row.nom_etablissement}</span>
    )},
    { key: 'adresse', label: 'Adresse', render: (row: Etablissement) => row.adresse || <span style={{ color: 'var(--text-muted)' }}>—</span> },
    { key: 'ville', label: 'Ville', render: (row: Etablissement) => row.ville ? (
      <span className="badge badge-primary">{row.ville}</span>
    ) : <span style={{ color: 'var(--text-muted)' }}>—</span> },
    { key: 'telephone', label: 'Téléphone', render: (row: Etablissement) => row.telephone || <span style={{ color: 'var(--text-muted)' }}>—</span> },
    { key: 'actions', label: 'Actions', align: 'center' as const, render: (row: Etablissement) => (
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button className="btn btn-icon btn-icon-edit" onClick={() => openEdit(row)} title="Modifier"><FiEdit size={15} /></button>
        <button className="btn btn-icon btn-icon-delete" onClick={() => handleDelete(row.id_etablissement)} title="Supprimer"><FiTrash2 size={15} /></button>
      </div>
    )},
  ];

  return (
    <>
      <PageTable
        title="Établissements"
        subtitle="Gérez les établissements de l'université"
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="Aucun établissement trouvé"
        searchValue={search}
        onSearch={setSearch}
        searchPlaceholder="Rechercher par nom, ville, adresse..."
        getKey={row => row.id_etablissement}
        actions={
          <button className="btn btn-success" onClick={openCreate}>
            <FiPlus size={16} /> Ajouter
          </button>
        }
      />

      <AppModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier l\'établissement' : 'Nouvel établissement'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Annuler</button>
            <button className="btn btn-primary" form="etab-form" type="submit" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </>
        }
      >
        {error && <div className="alert alert-error">{error}</div>}
        <form id="etab-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nom de l'établissement <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input type="text" required className="form-control" value={form.nom_etablissement || ''} onChange={e => setForm({ ...form, nom_etablissement: e.target.value })} placeholder="Ex: Faculté des Sciences" />
          </div>
          <div className="form-group">
            <label className="form-label">Adresse</label>
            <textarea className="form-control" value={form.adresse || ''} onChange={e => setForm({ ...form, adresse: e.target.value })} placeholder="Adresse complète" style={{ resize: 'vertical', minHeight: '70px' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div className="form-group">
              <label className="form-label">Ville</label>
              <input type="text" className="form-control" value={form.ville || ''} onChange={e => setForm({ ...form, ville: e.target.value })} placeholder="Yaoundé" />
            </div>
            <div className="form-group">
              <label className="form-label">Téléphone</label>
              <input type="text" className="form-control" value={form.telephone || ''} onChange={e => setForm({ ...form, telephone: e.target.value })} placeholder="+237 6XX XXX XXX" />
            </div>
          </div>
        </form>
      </AppModal>
    </>
  );
};

export default Etablissements;