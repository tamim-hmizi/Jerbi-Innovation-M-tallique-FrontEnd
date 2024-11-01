import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const ProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories,
}) => {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");
  const [categorie, setCategorie] = useState("");
  const [image, setImage] = useState("");
  
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setNom(initialData.nom);
        setDescription(initialData.description);
        setPrix(initialData.prix);
        setCategorie(
          categories.find((cat) => cat._id === initialData.categorie)
        );
        setImage(initialData.image);
      } else {
        setNom("");
        setDescription("");
        setPrix("");
        setCategorie("");
        setImage("");
      }
    }
  }, [initialData, isOpen, categories]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result); 
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ image, nom, description, categorie, prix });
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-gray-800 text-gray-300 p-6 rounded shadow-lg">
          <h2 className="text-lg font-bold mb-4">
            {initialData ? "Modifier le Produit" : "Ajouter un Produit"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium">Nom</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="border border-gray-600 bg-gray-700 text-gray-300 rounded w-full px-3 py-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-600 bg-gray-700 text-gray-300 rounded w-full px-3 py-2"
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Prix</label>
              <input
                type="number"
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
                className="border border-gray-600 bg-gray-700 text-gray-300 rounded w-full px-3 py-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Catégorie</label>
              <select
                value={categorie ? categorie._id : ""}
                onChange={(e) => setCategorie(e.target.value)}
                className="border border-gray-600 bg-gray-700 text-gray-300 rounded w-full px-3 py-2"
                required
              >
                <option value="">Sélectionner une catégorie</option>

                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.nom}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Image</label>
              <input
                type="file"
                onChange={handleImageChange}
                className="border border-gray-600 bg-gray-700 text-gray-300 rounded w-full px-3 py-2"
                required={!initialData?.image}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mr-2 bg-gray-600 hover:bg-gray-500 text-gray-300 font-bold py-2 px-4 rounded"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {initialData ? "Mettre à jour" : "Ajouter"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

ProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  categories: PropTypes.array.isRequired,
};

export default ProductModal;
