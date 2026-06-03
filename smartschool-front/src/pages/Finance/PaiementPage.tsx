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

    try {
      setLoading(true);

      const response = await createCharge({
        matricule: form.matricule,
        amount: Number(form.amount),
        customer_phone: form.customer_phone,
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
      alert("Erreur de paiement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Paiement des Droits Universitaires
        </h1>

        <form onSubmit={submit} className="space-y-4">

          <input
            placeholder="Matricule"
            className="w-full border p-3 rounded"
            value={form.matricule}
            onChange={(e) =>
              setForm({
                ...form,
                matricule: e.target.value,
              })
            }
          />

          <input
            placeholder="Téléphone"
            className="w-full border p-3 rounded"
            value={form.customer_phone}
            onChange={(e) =>
              setForm({
                ...form,
                customer_phone: e.target.value,
              })
            }
          />

          <select
            className="w-full border p-3 rounded"
            value={form.id_tranche}
            onChange={(e) =>
              setForm({
                ...form,
                id_tranche: e.target.value,
              })
            }
          >
            <option value="">
              Choisir une tranche
            </option>

            <option value="1">
              Première tranche
            </option>

            <option value="2">
              Deuxième tranche
            </option>
          </select>

          <input
            type="number"
            placeholder="Montant"
            className="w-full border p-3 rounded"
            value={form.amount}
            onChange={(e) =>
              setForm({
                ...form,
                amount: e.target.value,
              })
            }
          />

          <button
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded"
          >
            {loading
              ? "Initialisation..."
              : "Payer maintenant"}
          </button>
        </form>
      </div>
    </div>
  );
}