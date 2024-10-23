import { useState } from "react";
import { setUser } from "../store/userSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import env from "../config";
import { useDispatch } from "react-redux";

function SignIn() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.post(
        `${env.BACKEND_URL}api/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true } 
      );

      const { token, user } = response.data;
      dispatch(setUser({ token, user }));

      // Redirect based on user role
      if (user.role === "admin") {
        navigate("/dashboard"); // Redirect to the admin dashboard
      } else {
        navigate("/"); // Redirect to the home page for regular users
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(
          error.response.data.message ||
            "Login failed. Please check your credentials."
        );
      } else {
        setErrorMessage("An error occurred during login. Please try again.");
      }
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="flex items-center justify-center mt-32 bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Se connecter
        </h2>
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}
        <form onSubmit={handleSubmit}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-white"
              placeholder="Entrez votre email"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-white"
              placeholder="Entrez votre mot de passe"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded transition duration-300"
          >
            Se connecter
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-400">Pas encore inscrit?</p>
          <Link
            to="/register"
            className="text-red-500 hover:text-red-600 font-bold transition duration-300"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
