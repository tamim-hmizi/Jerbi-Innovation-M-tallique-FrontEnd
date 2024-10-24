import { useEffect, useState } from "react";
import axios from "axios";
import CategoryModal from "./CategoryModal";
import env from "../config";

function Categorie() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(""); // Réinitialiser l'erreur
      try {
        const response = await axios.get(`${env.BACKEND_URL}api/categories`);
        setCategories(response.data);
      } catch (error) {
        setError("Échec du chargement des catégories");
        console.error("Échec du chargement des catégories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const openModal = (category = null) => {
    setCurrentCategory(category); // Définir la catégorie actuelle pour modifier ou null pour en ajouter une nouvelle
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentCategory(null); // Effacer la catégorie actuelle
    setIsModalOpen(false); // Fermer la fenêtre modale
  };

  const handleAddOrUpdateCategory = async (category) => {
    setError(""); // Réinitialiser l'erreur
    try {
      if (currentCategory) {
        // Mettre à jour la catégorie
        const response = await axios.put(
          `${env.BACKEND_URL}api/categories/${currentCategory._id}`,
          category
        );
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === response.data._id ? response.data : cat
          )
        );
      } else {
        // Ajouter une nouvelle catégorie
        const response = await axios.post(
          `${env.BACKEND_URL}api/categories`,
          category
        );
        setCategories((prev) => [...prev, response.data]);
      }
    } catch (error) {
      setError(
        "Une erreur s'est produite lors de l'enregistrement de la catégorie."
      );
      console.error("Échec de l'enregistrement de la catégorie:", error);
    } finally {
      closeModal(); // Fermer la fenêtre modale et effacer currentCategory
    }
  };

  const handleDeleteCategory = async (id) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")
    ) {
      setError(""); // Réinitialiser l'erreur
      try {
        await axios.delete(`${env.BACKEND_URL}api/categories/${id}`);
        setCategories((prev) => prev.filter((cat) => cat._id !== id));
      } catch (error) {
        setError(
          "Une erreur s'est produite lors de la suppression de la catégorie."
        );
        console.error("Échec de la suppression de la catégorie:", error);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-300">Catégories</h1>

      <button
        onClick={() => openModal()} // Ouvrir la fenêtre modale pour ajouter une nouvelle catégorie
        className="mb-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Ajouter une Catégorie
      </button>

      {loading ? (
        <p>Chargement des catégories...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((category) => (
            <li
              key={category._id}
              className="flex justify-between items-center border bg-gray-700 p-2 rounded shadow text-gray-300"
            >
              {category.nom}
              <div>
                <button
                  onClick={() => openModal(category)} // Ouvrir la fenêtre modale pour modification
                  className="mr-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDeleteCategory(category._id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <CategoryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleAddOrUpdateCategory}
        initialData={currentCategory}
      />
    </div>
  );
}

export default Categorie;
