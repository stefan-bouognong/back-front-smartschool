import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCharge } from "../../api/finance";

export default function PaiementPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    matricule: "",
    customer_phone: "",
    amount: "",
    id_tranche: "",
  });

  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.matricule || !form.customer_phone || !form.amount || !form.id_tranche) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      setLoading(true);

      const response = await createCharge({
        matricule: form.matricule,
        amount: Number(form.amount),
        customer_phone: form.customer_phone,
        id_tranche: Number(form.id_tranche),   // ← AJOUT OBLIGATOIRE
      });

      console.log("Réponse de l'API:", response);

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
    } catch (error) {
      console.error(error);
      alert("Erreur de paiement: " + (error.response?.data?.error || "Veuillez vérifier les champs"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-xl">
        <h1 className="mb-6 text-3xl font-bold text-center">
          Paiement des Droits Universitaires
        </h1>

        <form onSubmit={submit} className="space-y-4">
          <input
            placeholder="Matricule"
            className="w-full p-3 border rounded"
            value={form.matricule}
            onChange={(e) =>
              setForm({ ...form, matricule: e.target.value })
            }
          />

          <input
            placeholder="Téléphone (ex: 2376XXXXXXXX)"
            className="w-full p-3 border rounded"
            value={form.customer_phone}
            onChange={(e) =>
              setForm({ ...form, customer_phone: e.target.value })
            }
          />

          <select
            className="w-full p-3 border rounded"
            value={form.id_tranche}
            onChange={(e) =>
              setForm({ ...form, id_tranche: e.target.value })
            }
          >
            <option value="">Choisir une tranche</option>
            <option value="1">Première tranche</option>
            <option value="2">Deuxième tranche</option>
          </select>

          <input
            type="number"
            placeholder="Montant (XAF)"
            className="w-full p-3 border rounded"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
          />

          <button
            disabled={loading}
            className="w-full py-3 text-white bg-green-600 rounded"
          >
            {loading ? "Initialisation..." : "Payer maintenant"}
          </button>
        </form>
      </div>
    </div>
  );
}