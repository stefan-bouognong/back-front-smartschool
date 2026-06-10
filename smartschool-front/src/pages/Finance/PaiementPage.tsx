import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCharge } from "../../api/finance";
import { FiCreditCard, FiPhone, FiUser, FiDollarSign } from 'react-icons/fi';
import { HiAcademicCap } from 'react-icons/hi2';

export default function PaiementPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    matricule: "",
    customer_phone: "",
    amount: "",
    id_tranche: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.matricule || !form.customer_phone || !form.amount || !form.id_tranche) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      setLoading(true);

      const response = await createCharge({
        matricule: form.matricule,
        amount: Number(form.amount),
        customer_phone: form.customer_phone,
        id_tranche: Number(form.id_tranche),
      });

      navigate(
        `/paiement/attente/${response.data.reference}`,
        {
          state: {
            matricule: form.matricule,
            montant: Number(form.amount),
            id_tranche: Number(form.id_tranche),
          },
        }
      );
    } catch (err: any) {
      setError("Erreur de paiement : " + (err.response?.data?.error || "Veuillez vérifier les champs"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px', height: '56px',
            borderRadius: '16px',
            background: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
          }}>
            <HiAcademicCap size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '0.375rem' }}>
            Paiement des Droits Universitaires
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Réglez vos frais en toute sécurité via Mobile Money
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 8px 40px rgba(15,23,42,0.08)',
          border: '1px solid rgba(226,232,240,0.8)',
        }}>
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Matricule Étudiant</label>
              <div style={{ position: 'relative' }}>
                <FiUser size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Ex: 18J1234"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  value={form.matricule}
                  onChange={(e) => setForm({ ...form, matricule: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Numéro de téléphone (Mobile Money)</label>
              <div style={{ position: 'relative' }}>
                <FiPhone size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="2376XXXXXXXX"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  value={form.customer_phone}
                  onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <div className="form-group">
                <label className="form-label">Tranche</label>
                <select
                  className="form-control"
                  value={form.id_tranche}
                  onChange={(e) => setForm({ ...form, id_tranche: e.target.value })}
                >
                  <option value="">Sélectionner</option>
                  <option value="1">1ère tranche</option>
                  <option value="2">2ème tranche</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Montant (XAF)</label>
                <div style={{ position: 'relative' }}>
                  <FiDollarSign size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="number"
                    placeholder="25000"
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-success"
              style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', fontSize: '1rem', marginTop: '1rem' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Initialisation...
                </span>
              ) : (
                <><FiCreditCard size={18} /> Payer maintenant</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}