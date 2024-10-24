import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const CategoryModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [nom, setName] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.nom);
      } else {
        setName(""); // Effacer l'état lorsque initialData est nul ou indéfini
      }
    }
  }, [initialData, isOpen]); // S'assurer qu'il se met à jour lorsque initialData ou isOpen change

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nom }); // Envoyer les données de la catégorie au composant parent
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-gray-800 text-gray-300 p-6 rounded shadow-lg">
          <h2 className="text-lg font-bold mb-4">
            {initialData ? "Modifier la Catégorie" : "Ajouter une Catégorie"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium">
                Nom de la catégorie
              </label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-600 bg-gray-700 text-gray-300 rounded w-full px-3 py-2"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose} // Fermer la fenêtre modale sans sauvegarder
                className="mr-2 bg-gray-600 hover:bg-gray-500 text-gray-300 font-bold py-2 px-4 rounded"
              >
                Fermer
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                {initialData ? "Mettre à Jour" : "Ajouter"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

// Validation des Prop Types
CategoryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    nom: PropTypes.string,
  }),
};

export default CategoryModal;
