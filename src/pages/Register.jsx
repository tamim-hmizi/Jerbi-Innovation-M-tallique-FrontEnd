// src/pages/Register.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Use React Router for navigation
import env from "../config";

const Register = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    numero: "",
    age: "",
    motdepasse: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

      try {
      const response = await axios.post(
        `${env.BACKEND_URL}api/auth/register`,
        formData
      );
      setSuccess(response.data.message);
      // Navigate to another page after successful registration
      navigate("/signin"); // Change this to the correct path for your Sign In page
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Server error, please try again later.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          S&apos;inscrire
        </h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {success && <div className="mb-4 text-green-500">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="nom"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Nom
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className="w-full p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-white"
              placeholder="Entrez votre nom"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="prenom"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Prénom
            </label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
              className="w-full p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-white"
              placeholder="Entrez votre prénom"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-white"
              placeholder="Entrez votre email"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="numero"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Numéro
            </label>
            <input
              type="text"
              id="numero"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              required
              className="w-full p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-white"
              placeholder="Entrez votre numéro"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Âge
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              className="w-full p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-white"
              placeholder="Entrez votre âge"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="motdepasse"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="motdepasse"
              name="motdepasse"
              value={formData.motdepasse}
              onChange={handleChange}
              required
              className="w-full p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-white"
              placeholder="Entrez votre mot de passe"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded transition duration-300"
          >
            S&apos;inscrire
          </button>
        </form>
        <p className="mt-4 text-center text-gray-300">
          Déjà un compte?{" "}
          <a href="/signin" className="text-red-500 hover:underline">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
