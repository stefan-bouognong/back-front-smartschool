import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../api/auth';
import type { RegisterData } from '../../api/auth';
import { FaUser, FaEnvelope, FaLock, FaUserTag, FaUserPlus } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterData>({
    nom: '',
    prenom: '',
    email: '',
    mot_de_passe: '',
    role: 'ENSEIGNANT',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await register(formData);
      setSuccess('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la création du compte');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          <FaUserPlus /> Créer un compte
        </h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="nom"
              placeholder="Nom"
              className="w-full pl-10 pr-3 py-2 border rounded"
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4 relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="prenom"
              placeholder="Prénom"
              className="w-full pl-10 pr-3 py-2 border rounded"
              value={formData.prenom}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4 relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full pl-10 pr-3 py-2 border rounded"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4 relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              name="mot_de_passe"
              placeholder="Mot de passe"
              className="w-full pl-10 pr-3 py-2 border rounded"
              value={formData.mot_de_passe}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-6 relative">
            <FaUserTag className="absolute left-3 top-3 text-gray-400" />
            <select
              name="role"
              className="w-full pl-10 pr-3 py-2 border rounded appearance-none"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="ENSEIGNANT">Enseignant</option>
              <option value="ADMIN">Administrateur</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            <FaUserPlus /> S'inscrire
          </button>
        </form>
        <p className="mt-4 text-center">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;