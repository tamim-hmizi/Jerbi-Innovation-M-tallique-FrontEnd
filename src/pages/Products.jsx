import axios from "axios";
import { useEffect, useState } from "react";
import env from "../config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Produits() {
  const [categories, setCategories] = useState([]);
  const [produits, setProduits] = useState([]);
  const [filteredProduits, setFilteredProduits] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${env.BACKEND_URL}api/categories`);
        setCategories(response.data);
      } catch (error) {
        setError("Échec du chargement des catégories");
        console.error(error);
      }
    };

    const fetchProduits = async () => {
      try {
        const response = await axios.get(`${env.BACKEND_URL}api/produits`);
        setProduits(response.data);
        setFilteredProduits(response.data);
      } catch (error) {
        setError("Échec du chargement des produits");
        console.error(error);
      }
    };

    fetchCategories();
    fetchProduits();
  }, []);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchTerm("");
    if (categoryId) {
      const filtered = produits.filter(
        (produit) => produit.categorie === categoryId
      );
      setFilteredProduits(filtered);
    } else {
      setFilteredProduits(produits);
    }
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    const filtered = produits.filter((produit) =>
      produit.nom.toLowerCase().includes(searchValue.toLowerCase())
    );
    if (selectedCategory) {
      const categoryFiltered = filtered.filter(
        (produit) => produit.categorie === selectedCategory
      );
      setFilteredProduits(categoryFiltered);
    } else {
      setFilteredProduits(filtered);
    }
  };

  const handleAddToCart = async (produit) => {
    if (!user) {
      navigate("/signin");
      return;
    }

    try {
      const res = await axios.get(`${env.BACKEND_URL}api/paniers/${user.id}`);
      const existingPanier = res.data;

      if (existingPanier) {
        const updatedProductList = existingPanier.list_produit
          ? [...existingPanier.list_produit, produit._id]
          : [produit._id];

        // Update existing panier
        await axios.put(`${env.BACKEND_URL}api/paniers/${existingPanier._id}`, {
          list_produit: updatedProductList,
          somme: (
            parseFloat(existingPanier.somme) + parseFloat(produit.prix)
          ).toString(),
        });
      } else {
        // Create a new panier
        await axios.post(`${env.BACKEND_URL}api/paniers`, {
          id_user: user.id,
          list_produit: [produit._id],
          somme: parseFloat(produit.prix).toString(),
        });
      }
    } catch (error) {
      console.error("Failed to update or create panier:", error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start px-4 py-8 sm:px-8 lg:px-16">
      {/* Section des catégories */}
      <div className="w-full lg:mt-10 sm:w-1/4 md:mt-10 mb-8 sm:mb-0 sm:mt-20 sm:pr-4 flex-none">
        <h2 className="text-xl font-semibold mb-2 text-gray-300">Catégories</h2>
        <div className="block sm:hidden mb-4">
          <select
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="bg-gray-800 text-gray-300 border border-gray-600 rounded-lg p-2 w-full"
          >
            <option value="">Tous les produits</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.nom}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block bg-gray-800 p-4 rounded-lg shadow-md">
          <ul className=" bg-gray-800 rounded-lg">
            <li
              className={`py-2 px-4 cursor-pointer hover:brightness-50 transition duration-200 ${
                selectedCategory === ""
                  ? "bg-red-600 text-white"
                  : "text-gray-300"
              } rounded-md`}
              onClick={() => handleCategoryChange("")}
            >
              Tous les produits
            </li>
            {categories.map((category) => (
              <li
                key={category._id}
                className={`py-2 px-4 cursor-pointer hover:brightness-50 transition duration-200 ${
                  selectedCategory === category._id
                    ? "bg-red-600 text-white"
                    : "text-gray-300"
                } rounded-md`}
                onClick={() => handleCategoryChange(category._id)}
              >
                {category.nom}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Section des produits */}
      <div className="w-full sm:w-3/4 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold mb-4 md:mb-0 text-gray-300">
            Nos Produits
          </h2>
          <input
            type="text"
            placeholder="Rechercher des produits..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full md:w-1/3 p-2 border border-gray-600 rounded-lg focus:outline-none focus:border-red-600 text-gray-800"
          />
        </div>

        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            {filteredProduits.map((produit) => (
              <div
                key={produit._id}
                className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <img
                  src={produit.image}
                  alt={produit.nom}
                  className="w-full h-64 object-cover rounded-t-lg mb-4"
                />
                <h3 className="text-lg font-semibold mb-2 text-gray-300">
                  {produit.nom}
                </h3>
                <p className="text-gray-400">
                  Description : {produit.description}
                </p>
                <p className="text-gray-400">
                  Catégorie :{" "}
                  {categories.find((cat) => cat._id == produit.categorie).nom}
                </p>
                <p className="text-red-500 font-bold mt-2">
                  Prix : {produit.prix} DT
                </p>
                <button
                  onClick={() => handleAddToCart(produit)}
                  className="mt-4 w-full bg-red-600 text-gray-300 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Ajouter au Panier
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Produits;
