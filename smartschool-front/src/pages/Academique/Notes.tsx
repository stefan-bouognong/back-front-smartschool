import { useState, useEffect } from 'react';
import { getAllUEs, getNotesForEnseignant, createNote, type UE, type Note } from '../../api/academique';
import { getAllInscriptions, type Inscription } from '../../api/scolarite';

const Notes = () => {
  const [ues, setUes] = useState<UE[]>([]);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    id_inscription: 0,
    id_UE: 0,
    valeur_note: 0,
    session: '',
    date_examen: new Date().toISOString().slice(0, 10),
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
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
        setMessage({ type: 'error', text: 'Erreur lors du chargement des données' });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    if (form.id_inscription === 0 || form.id_UE === 0) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner une inscription et une UE' });
      return;
    }
    const noteValue = Number(form.valeur_note);
    if (isNaN(noteValue) || noteValue < 0 || noteValue > 20) {
      setMessage({ type: 'error', text: 'La note doit être un nombre compris entre 0 et 20' });
      return;
    }
    try {
      await createNote({
        id_inscription: form.id_inscription,
        id_UE: form.id_UE,
        valeur_note: noteValue,
        session: form.session || undefined,
        date_examen: form.date_examen,
      });
      setMessage({ type: 'success', text: 'Note enregistrée avec succès' });
      const notesRes = await getNotesForEnseignant();
      setNotes(notesRes.data);
      setForm({ ...form, valeur_note: 0, session: '', id_inscription: 0, id_UE: 0 });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.erreur || 'Erreur lors de l\'enregistrement' });
    }
  };

  const getStudentName = (id_inscription: number) => {
    const ins = inscriptions.find(i => i.id_inscription === id_inscription);
    if (ins && ins.Etudiant) return `${ins.Etudiant.prenom_etud} ${ins.Etudiant.nom_etud}`;
    return `ID ${id_inscription}`;
  };

  const getUELabel = (id_UE: number) => {
    const ue = ues.find(u => u.id_UE === id_UE);
    return ue ? `${ue.code_UE} - ${ue.libelle_UE}` : `UE ${id_UE}`;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des notes</h1>

      {message.text && (
        <div className={`p-3 mb-4 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Nouvelle note</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block">Inscription (étudiant)</label>
            <select required className="w-full border rounded px-2 py-1" value={form.id_inscription} onChange={e => setForm({ ...form, id_inscription: parseInt(e.target.value) })}>
              <option value="0">Sélectionner</option>
              {inscriptions.map(ins => (
                <option key={ins.id_inscription} value={ins.id_inscription}>
                  {ins.Etudiant?.prenom_etud} {ins.Etudiant?.nom_etud} ({ins.Niveau?.libelle_niveau} - {ins.Annee?.libelle_annee})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block">Unité d'Enseignement</label>
            <select required className="w-full border rounded px-2 py-1" value={form.id_UE} onChange={e => setForm({ ...form, id_UE: parseInt(e.target.value) })}>
              <option value="0">Sélectionner</option>
              {ues.map(ue => (
                <option key={ue.id_UE} value={ue.id_UE}>{ue.code_UE} - {ue.libelle_UE} ({ue.credits_ECTS} ECTS)</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block">Note (sur 20)</label>
            <input type="number" step="0.01" min="0" max="20" required className="w-full border rounded px-2 py-1" value={form.valeur_note} onChange={e => setForm({ ...form, valeur_note: e.target.value === '' ? 0 : parseFloat(e.target.value) })} />
          </div>
          <div>
            <label className="block">Session (optionnel)</label>
            <input type="text" placeholder="Ex: Septembre 2025" className="w-full border rounded px-2 py-1" value={form.session} onChange={e => setForm({ ...form, session: e.target.value })} />
          </div>
          <div>
            <label className="block">Date examen</label>
            <input type="date" className="w-full border rounded px-2 py-1" value={form.date_examen} onChange={e => setForm({ ...form, date_examen: e.target.value })} />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Enregistrer</button>
        </form>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <h2 className="text-xl font-semibold p-4 border-b">Notes saisies</h2>
        {loading ? <p className="p-4">Chargement...</p> : (
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Étudiant</th>
                <th className="border p-2">UE</th>
                <th className="border p-2">Note</th>
                <th className="border p-2">Session</th>
                <th className="border p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note) => (
                <tr key={note.id_note}>
                  <td className="border p-2">{getStudentName(note.id_inscription)}</td>
                  <td className="border p-2">{getUELabel(note.id_UE)}</td>
                  <td className="border p-2">{note.valeur_note}</td>
                  <td className="border p-2">{note.session || '-'}</td>
                  <td className="border p-2">{note.date_examen ? new Date(note.date_examen).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
              {notes.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-4">Aucune note saisie</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Notes;