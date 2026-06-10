import { useState, useEffect } from 'react';
import { getAllUEs, getNotesForEnseignant, createNote, type UE, type Note } from '../../api/academique';
import { getAllInscriptions, type Inscription } from '../../api/scolarite';
import { FiPlus, FiCalendar, FiBook } from 'react-icons/fi';
import { PageTable } from '../../components/Common/PageTable';
import { AppModal } from '../../components/Common/Modal';

const Notes = () => {
  const [ues, setUes] = useState<UE[]>([]);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({
    id_inscription: 0,
    id_UE: 0,
    valeur_note: 0,
    session: '',
    date_examen: new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [uesRes, inscriptionsRes] = await Promise.all([
        getAllUEs(),
        getAllInscriptions(),
      ]);
      setUes(uesRes.data);
      setInscriptions(inscriptionsRes.data.data);

      try {
        const notesRes = await getNotesForEnseignant();
        setNotes(notesRes.data);
      } catch (err) {
        console.warn('Impossible de charger les notes pour cet enseignant', err);
        setNotes([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setForm({
      id_inscription: 0,
      id_UE: 0,
      valeur_note: 0,
      session: '',
      date_examen: new Date().toISOString().slice(0, 10),
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (form.id_inscription === 0 || form.id_UE === 0) {
      setError('Veuillez sélectionner une inscription et une UE');
      return;
    }
    const noteValue = Number(form.valeur_note);
    if (isNaN(noteValue) || noteValue < 0 || noteValue > 20) {
      setError('La note doit être un nombre compris entre 0 et 20');
      return;
    }

    setSaving(true);
    try {
      await createNote({
        id_inscription: form.id_inscription,
        id_UE: form.id_UE,
        valeur_note: noteValue,
        session: form.session || undefined,
        date_examen: form.date_examen,
      });
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.erreur || 'Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const getStudentName = (id_inscription: number) => {
    const ins = inscriptions.find(i => i.id_inscription === id_inscription);
    if (ins && ins.Etudiant) return `${ins.Etudiant.prenom_etud} ${ins.Etudiant.nom_etud}`;
    return `ID ${id_inscription}`;
  };

  const getUELabel = (id_UE: number) => {
    const ue = ues.find(u => u.id_UE === id_UE);
    return ue ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{ue.code_UE}</span>
        <span style={{ color: 'var(--text-muted)' }}>-</span>
        <span>{ue.libelle_UE}</span>
      </div>
    ) : `UE ${id_UE}`;
  };

  const columns = [
    { key: 'etudiant', label: 'Étudiant', render: (row: Note) => (
      <span style={{ fontWeight: 600 }}>{getStudentName(row.id_inscription)}</span>
    )},
    { key: 'ue', label: 'Unité d\'Enseignement', render: (row: Note) => getUELabel(row.id_UE) },
    { key: 'note', label: 'Note (/20)', align: 'center' as const, render: (row: Note) => {
      const isPass = row.valeur_note >= 10;
      return (
        <span className={`badge ${isPass ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.875rem' }}>
          {row.valeur_note}
        </span>
      );
    }},
    { key: 'session', label: 'Session', render: (row: Note) => row.session ? (
      <span className="badge badge-gray">{row.session}</span>
    ) : '-' },
    { key: 'date', label: 'Date examen', render: (row: Note) => row.date_examen ? (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)' }}>
        <FiCalendar size={13} />
        {new Date(row.date_examen).toLocaleDateString()}
      </div>
    ) : '-' },
  ];

  return (
    <>
      <PageTable
        title="Gestion des notes"
        subtitle="Saisissez et consultez les notes des étudiants"
        columns={columns}
        data={notes}
        loading={loading}
        emptyMessage="Aucune note saisie"
        getKey={row => row.id_note}
        actions={
          <button className="btn btn-success" onClick={openCreate}>
            <FiPlus size={16} /> Saisir une note
          </button>
        }
      />

      <AppModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Saisir une nouvelle note"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Annuler</button>
            <button className="btn btn-primary" form="note-form" type="submit" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </>
        }
      >
        {error && <div className="alert alert-error">{error}</div>}
        <form id="note-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Inscription (étudiant) <span style={{ color: 'var(--danger)' }}>*</span></label>
            <select required className="form-control" value={form.id_inscription} onChange={e => setForm({ ...form, id_inscription: parseInt(e.target.value) })}>
              <option value="0">Sélectionner un étudiant</option>
              {inscriptions.map(ins => (
                <option key={ins.id_inscription} value={ins.id_inscription}>
                  {ins.Etudiant?.prenom_etud} {ins.Etudiant?.nom_etud} ({ins.Niveau?.libelle_niveau} - {ins.Annee?.libelle_annee})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Unité d'Enseignement <span style={{ color: 'var(--danger)' }}>*</span></label>
            <select required className="form-control" value={form.id_UE} onChange={e => setForm({ ...form, id_UE: parseInt(e.target.value) })}>
              <option value="0">Sélectionner une UE</option>
              {ues.map(ue => (
                <option key={ue.id_UE} value={ue.id_UE}>{ue.code_UE} - {ue.libelle_UE} ({ue.credits_ECTS} ECTS)</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div className="form-group">
              <label className="form-label">Note (sur 20) <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input type="number" step="0.01" min="0" max="20" required className="form-control" value={form.valeur_note} onChange={e => setForm({ ...form, valeur_note: e.target.value === '' ? 0 : parseFloat(e.target.value) })} />
            </div>
            <div className="form-group">
              <label className="form-label">Date examen <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input type="date" required className="form-control" value={form.date_examen} onChange={e => setForm({ ...form, date_examen: e.target.value })} />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Session (optionnel)</label>
            <input type="text" placeholder="Ex: Septembre 2025" className="form-control" value={form.session} onChange={e => setForm({ ...form, session: e.target.value })} />
          </div>
        </form>
      </AppModal>
    </>
  );
};

export default Notes;