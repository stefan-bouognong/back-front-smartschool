import { useState, useEffect } from 'react';
import { getAllInscriptions, deleteInscription, createInscription, type Inscription } from '../../api/scolarite';
import { getAllDepartements, getAllNiveaux, getAllAnnees, type Departement, type Niveau, type AnneeAcademique } from '../../api/admin';
import { FiTrash2, FiPlus, FiCheck, FiX } from 'react-icons/fi';
import { PageTable } from '../../components/Common/PageTable';
import { AppModal } from '../../components/Common/Modal';

const Inscriptions = () => {
  const [data, setData] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ niveau: '', filiere: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    date_naissance: '',
    filiere: 0,
    niveau: 0
  });
  const [selectedAnnee, setSelectedAnnee] = useState<number>(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const [departements, setDepartements] = useState<Departement[]>([]);
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [annees, setAnnees] = useState<AnneeAcademique[]>([]);
  const [filteredNiveaux, setFilteredNiveaux] = useState<Niveau[]>([]);

  const loadInscriptions = async () => {
    setLoading(true);
    try {
      const res = await getAllInscriptions(filters);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadSelectData = async () => {
      try {
        const [depRes, nivRes, anneeRes] = await Promise.all([
          getAllDepartements(),
          getAllNiveaux(),
          getAllAnnees()
        ]);
        setDepartements(depRes.data);
        setNiveaux(nivRes.data);
        setAnnees(anneeRes.data);
        if (anneeRes.data.length > 0) setSelectedAnnee(anneeRes.data[0].id_annee);
      } catch (err) {
        console.error(err);
      }
    };
    loadSelectData();
  }, []);

  useEffect(() => {
    loadInscriptions();
  }, [filters]);

  const handleDelete = async (id: number) => {
    if (confirm('Supprimer cette inscription ?')) {
      try {
        await deleteInscription(id);
        loadInscriptions();
      } catch (err) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleFiliereChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deptId = parseInt(e.target.value);
    setForm({ ...form, filiere: deptId, niveau: 0 });
    const filtered = niveaux.filter(n => n.id_departement === deptId);
    setFilteredNiveaux(filtered);
  };

  const resetForm = () => {
    setForm({
      nom: '',
      prenom: '',
      email: '',
      date_naissance: '',
      filiere: 0,
      niveau: 0
    });
    if (annees.length > 0) setSelectedAnnee(annees[0].id_annee);
    setFilteredNiveaux([]);
  };

  const openCreate = () => {
    resetForm();
    setError('');
    setSuccess('');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const selectedDept = departements.find(d => d.id_departement === form.filiere);
    const selectedNiveau = filteredNiveaux.find(n => n.id_niveau === form.niveau);
    const selectedAnneeObj = annees.find(a => a.id_annee === selectedAnnee);

    if (!selectedDept || !selectedNiveau || !selectedAnneeObj) {
      setError('Veuillez remplir tous les champs');
      setSaving(false);
      return;
    }

    if (!form.date_naissance) {
      setError('La date de naissance est obligatoire');
      setSaving(false);
      return;
    }

    const payload = {
      nom: form.nom,
      prenom: form.prenom,
      email: form.email,
      date_naissance: form.date_naissance,
      filiere: selectedDept.nom_dept,
      niveau: selectedNiveau.libelle_niveau,
      anneeLibelle: selectedAnneeObj.libelle_annee
    };

    try {
      await createInscription(payload);
      setSuccess('Inscription créée avec succès');
      setModalOpen(false);
      resetForm();
      loadInscriptions();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la création');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: 'etudiant', label: 'Étudiant', render: (row: Inscription) => (
      <span style={{ fontWeight: 600 }}>{row.Etudiant?.prenom_etud} {row.Etudiant?.nom_etud}</span>
    )},
    { key: 'email', label: 'Email', render: (row: Inscription) => row.Etudiant?.email },
    { key: 'filiere', label: 'Filière', render: (row: Inscription) => row.Niveau?.Departement?.nom_dept },
    { key: 'niveau', label: 'Niveau', render: (row: Inscription) => <span className="badge badge-primary">{row.Niveau?.libelle_niveau}</span> },
    { key: 'annee', label: 'Année', render: (row: Inscription) => row.Annee?.libelle_annee || '-' },
    { key: 'statut', label: 'Statut paiement', align: 'center' as const, render: (row: Inscription) => row.statut_paiement ? (
      <span className="badge badge-success"><FiCheck /> Payé</span>
    ) : (
      <span className="badge badge-danger"><FiX /> Impayé</span>
    )},
    { key: 'actions', label: 'Actions', align: 'center' as const, render: (row: Inscription) => (
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button className="btn btn-icon btn-icon-delete" onClick={() => handleDelete(row.id_inscription)}><FiTrash2 size={15} /></button>
      </div>
    )},
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="page-header">
          <div>
            <h1 className="page-title">Gestion des inscriptions</h1>
            <p className="page-subtitle">Gérez les inscriptions des étudiants</p>
          </div>
          <button className="btn btn-success" onClick={openCreate}>
            <FiPlus size={16} /> Nouvelle inscription
          </button>
        </div>

        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div className="card-body" style={{ padding: '0.875rem 1.25rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label className="form-label">Filière</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ex: INF"
                  value={filters.filiere}
                  onChange={(e) => setFilters({ ...filters, filiere: e.target.value })}
                />
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label className="form-label">Niveau</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ex: M1"
                  value={filters.niveau}
                  onChange={(e) => setFilters({ ...filters, niveau: e.target.value })}
                />
              </div>
              <button
                className="btn btn-ghost"
                onClick={() => setFilters({ niveau: '', filiere: '' })}
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            {loading ? (
              <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '36px', height: '36px',
                  border: '3px solid var(--border)',
                  borderTopColor: 'var(--primary)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Chargement des données...</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    {columns.map(col => (
                      <th key={col.key} style={{ textAlign: col.align ?? 'left' }}>{col.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.length}
                        style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}
                      >
                        Aucune inscription
                      </td>
                    </tr>
                  ) : (
                    data.map(row => (
                      <tr key={row.id_inscription}>
                        {columns.map(col => (
                          <td key={col.key} style={{ textAlign: col.align ?? 'left' }}>
                            {col.render(row)}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
          {!loading && data.length > 0 && (
            <div style={{
              padding: '0.75rem 1.25rem',
              borderTop: '1px solid var(--border)',
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
            }}>
              {data.length} enregistrement{data.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      <AppModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nouvelle inscription"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Annuler</button>
            <button className="btn btn-primary" form="ins-form" type="submit" disabled={saving}>
              {saving ? 'Création...' : 'Créer'}
            </button>
          </>
        }
      >
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form id="ins-form" onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div className="form-group">
              <label className="form-label">Nom <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input type="text" required className="form-control" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Prénom <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input type="text" required className="form-control" value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input type="email" required className="form-control" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Date de naissance <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input
              type="date"
              required
              className="form-control"
              value={form.date_naissance}
              onChange={e => setForm({...form, date_naissance: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Filière <span style={{ color: 'var(--danger)' }}>*</span></label>
            <select required className="form-control" value={form.filiere} onChange={handleFiliereChange}>
              <option value="0">Sélectionner une filière</option>
              {departements.map(dept => (
                <option key={dept.id_departement} value={dept.id_departement}>{dept.nom_dept}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Niveau <span style={{ color: 'var(--danger)' }}>*</span></label>
            <select required className="form-control" value={form.niveau} onChange={e => setForm({...form, niveau: parseInt(e.target.value)})}>
              <option value="0">Sélectionner un niveau</option>
              {filteredNiveaux.map(n => (
                <option key={n.id_niveau} value={n.id_niveau}>{n.libelle_niveau}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Année académique <span style={{ color: 'var(--danger)' }}>*</span></label>
            <select required className="form-control" value={selectedAnnee} onChange={e => setSelectedAnnee(parseInt(e.target.value))}>
              {annees.map(a => (
                <option key={a.id_annee} value={a.id_annee}>{a.libelle_annee}</option>
              ))}
            </select>
          </div>
        </form>
      </AppModal>
    </>
  );
};

export default Inscriptions;