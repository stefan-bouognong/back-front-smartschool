import { Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { FaDownload, FaMoneyBillWave, FaUserPlus } from 'react-icons/fa';
import { useState } from 'react';
import { inscrireEtudiant,type InscriptionData } from '../api/scolarite';
import { createCharge } from '../api/finance';

type PaymentOption = 'full' | 'half';

const Home = () => {
  const { user } = useAuth();

  // État pour le formulaire d'inscription
  const [form, setForm] = useState<InscriptionData>({
    nom: '',
    prenom: '',
    email: '',
    filiere: '',
    niveau: '',
    telephone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // État après inscription
  const [student, setStudent] = useState<{
    matricule: string;
    nom: string;
    prenom: string;
    telephone: string;
  } | null>(null);

  // État pour le paiement
  const [paymentOption, setPaymentOption] = useState<PaymentOption>('full');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Inscription
  const handleInscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await inscrireEtudiant(form);
      const studentData = result.data;
      setStudent({
        matricule: studentData.matricule,
        nom: studentData.nom,
        prenom: studentData.prenom,
        telephone: form.telephone!,
      });
      setSuccess(`Inscription réussie ! Votre matricule : ${studentData.matricule}`);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  // Paiement
  const handlePayment = async () => {
    if (!student) return;
    setPaymentLoading(true);
    setPaymentResult(null);
    setError(null);

    const amount = paymentOption === 'full' ? 50000 : 25000;
    try {
      const result = await createCharge({
        matricule: student.matricule,
        amount,
        customer_phone: student.telephone,
      });
      setPaymentResult(result.data);
      setSuccess(`Paiement de ${amount} FCFA effectué. Référence : ${result.data.reference}`);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Erreur lors du paiement");
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header avec logo et authentification */}
        <div className="flex justify-between items-center mb-12 flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <img src="/uy1-logo.png" alt="UY1" className="h-12 w-12" />
            <span className="text-xl font-bold text-gray-800">Université de Yaoundé I</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-900">Accueil</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Aide</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">English</a>
            {!user ? (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Connexion Administrateur
              </Link>
            ) : (
              <span className="text-green-600 font-semibold">Bonjour, {user.prenom}</span>
            )}
          </div>
        </div>

        {/* Hero / Titre principal */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Inscription et Paiement en ligne
          </h1>
          <p className="text-xl text-gray-600">
            Université de Yaoundé I – Rentrée académique 2025-2026
          </p>
        </div>

        {/* Carte principale : formulaire d'inscription ou paiement */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-8">
            {!student ? (
              // Formulaire d'inscription
              <>
                <div className="flex items-center gap-2 mb-6">
                  <FaUserPlus className="text-indigo-600 text-2xl" />
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Nouvelle inscription
                  </h2>
                </div>
                <form onSubmit={handleInscription} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nom *</label>
                      <input
                        type="text"
                        name="nom"
                        value={form.nom}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Prénom *</label>
                      <input
                        type="text"
                        name="prenom"
                        value={form.prenom}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Téléphone *</label>
                      <input
                        type="tel"
                        name="telephone"
                        value={form.telephone}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Filière *</label>
                      <input
                        type="text"
                        name="filiere"
                        value={form.filiere}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Niveau *</label>
                      <input
                        type="text"
                        name="niveau"
                        value={form.niveau}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  {error && <div className="text-red-600 text-sm">{error}</div>}
                  {success && <div className="text-green-600 text-sm">{success}</div>}
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-8 rounded-md transition disabled:opacity-50 flex items-center gap-2"
                    >
                      {loading ? 'Inscription en cours...' : "S'inscrire"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              // Section paiement après inscription
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-green-800">
                    <strong>Bienvenue {student.prenom} {student.nom} !</strong><br />
                    Matricule : <span className="font-mono">{student.matricule}</span>
                  </p>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FaMoneyBillWave className="text-green-600 text-2xl" />
                    <h2 className="text-2xl font-semibold text-gray-800">
                      Paiement de la pension
                    </h2>
                  </div>
                  <p className="text-gray-600 mb-4">Montant total : 50 000 FCFA</p>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Choisissez votre option :
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="full"
                          checked={paymentOption === 'full'}
                          onChange={() => setPaymentOption('full')}
                          className="form-radio text-indigo-600"
                        />
                        <span className="ml-2">Payer 50 000 FCFA (une seule fois)</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="half"
                          checked={paymentOption === 'half'}
                          onChange={() => setPaymentOption('half')}
                          className="form-radio text-indigo-600"
                        />
                        <span className="ml-2">Payer 25 000 FCFA (1ʳᵉ tranche)</span>
                      </label>
                    </div>
                  </div>

                  {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
                  {success && <div className="text-green-600 text-sm mb-4">{success}</div>}
                  {paymentResult && (
                    <div className="bg-gray-50 rounded-md p-3 text-sm">
                      <p><strong>Référence transaction :</strong> {paymentResult.reference}</p>
                      <p><strong>Statut :</strong> {paymentResult.status || 'Succès'}</p>
                    </div>
                  )}

                  <div className="flex justify-center">
                    <button
                      onClick={handlePayment}
                      disabled={paymentLoading}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded-md transition disabled:opacity-50 flex items-center gap-2"
                    >
                      {paymentLoading ? 'Traitement en cours...' : 'Procéder au paiement'}
                    </button>
                  </div>

                  {paymentOption === 'half' && paymentResult && (
                    <div className="mt-4 text-center text-sm text-gray-500">
                      Vous pourrez payer la deuxième tranche de 25 000 FCFA ultérieurement depuis votre espace personnel.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions rapides (optionnelles) */}
        <div className="flex justify-center gap-6 mt-12">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2">
            <FaMoneyBillWave /> Payer ses DU
          </button>
          <button className="bg-gray-700 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition flex items-center gap-2">
            <FaDownload /> Télécharger son Reçu
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;