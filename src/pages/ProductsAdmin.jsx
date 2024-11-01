import { useEffect, useState } from "react";
import axios from "axios";
import ProductModal from "./ProductModal";
import env from "../config";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`${env.BACKEND_URL}api/produits`);
        setProducts(response.data);
      } catch (error) {
        setError("Échec du chargement des produits.");
        console.error("Échec du chargement des produits:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${env.BACKEND_URL}api/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Échec du chargement des catégories:", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const openModal = (product = null) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentProduct(null);
    setIsModalOpen(false);
  };

  const handleAddOrUpdateProduct = async (product) => {
    setError("");
    try {
      if (currentProduct) {
        const response = await axios.put(
          `${env.BACKEND_URL}api/produits/${currentProduct._id}`,
          product
        );
        setProducts((prev) =>
          prev.map((prod) =>
            prod._id === response.data._id ? response.data : prod
          )
        );
      } else {
        const response = await axios.post(
          `${env.BACKEND_URL}api/produits`,
          product
        );
        setProducts((prev) => [...prev, response.data]);
      }
    } catch (error) {
      setError(
        "Une erreur s'est produite lors de l'enregistrement du produit."
      );
      console.error("Échec de l'enregistrement du produit:", error);
    } finally {
      closeModal();
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      setError("");
      try {
        await axios.delete(`${env.BACKEND_URL}api/produits/${id}`);
        setProducts((prev) => prev.filter((prod) => prod._id !== id));
      } catch (error) {
        setError(
          "Une erreur s'est produite lors de la suppression du produit."
        );
        console.error("Échec de la suppression du produit:", error);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-300">Produits</h1>

      <button
        onClick={() => openModal()}
        className="mb-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Ajouter un Produit
      </button>

      {loading ? (
        <p>Chargement des produits...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul className="space-y-4">
          {products.map((product) => (
            <li
              key={product._id}
              className="flex justify-between items-center border bg-gray-700 p-4 rounded shadow-lg text-gray-300"
            >
              <div className="flex items-center space-x-4">
                {/* Display product image */}
                <img
                  src={product.image}
                  alt={product.nom}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h2 className="text-lg font-bold">{product.nom}</h2>
                  <p className="text-sm">{product.description}</p>
                  <p className="text-sm">
                    Catégorie:{" "}
                    {
                      categories.find(
                        (category) => category._id === product.categorie
                      )?.nom
                    }
                  </p>
                  <p className="text-sm">Prix: {product.prix} DT</p>
                </div>
              </div>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                <button
                  onClick={() => openModal(product)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 text-sm sm:px-4 sm:text-base rounded w-full sm:w-auto"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 text-sm sm:px-4 sm:text-base rounded w-full sm:w-auto"
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleAddOrUpdateProduct}
        initialData={currentProduct}
        categories={categories}
      />
    </div>
  );
}

export default Products;
