import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import env from "../config";

const Panier = () => {
  const user = useSelector((state) => state.user.userInfo);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/signin");
  }, [user, navigate]);

  const [panier, setPanier] = useState(null);
  const [produits, setProduits] = useState([]);
  const [compteProduits, setCompteProduits] = useState({});

  useEffect(() => {
    if (!user) return;

    const fetchPanier = async () => {
      try {
        const res = await axios.get(`${env.BACKEND_URL}api/paniers/${user.id}`);
        setPanier(res.data);

        if (res.data.list_produit) {
          const comptes = res.data.list_produit.reduce((acc, id) => {
            acc[id] = (acc[id] || 0) + 1;
            return acc;
          }, {});
          setCompteProduits(comptes);

          await fetchProductDetails(Object.keys(comptes));
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du panier:", error);
      }
    };

    fetchPanier();
  }, [user]);

  const fetchProductDetails = async (productIds) => {
    try {
      const promises = productIds.map((id) =>
        axios.get(`${env.BACKEND_URL}api/produits/${id}`)
      );
      const results = await Promise.all(promises);
      setProduits(results.map((res) => res.data));
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails des produits:",
        error
      );
    }
  };

  const handleRemoveProduct = async (productId) => {
    if (!panier) return;

    const productIndex = panier.list_produit.indexOf(productId);
    if (productIndex === -1) return;

    const updatedProductList = [...panier.list_produit];
    updatedProductList.splice(productIndex, 1); // Remove only one occurrence of the product ID

    const productToRemove = produits.find(
      (produit) => produit._id === productId
    );
    const updatedSum =
      parseFloat(panier.somme) -
      parseFloat(productToRemove ? productToRemove.prix : 0);

    try {
      const updatedPanier = await axios.put(
        `${env.BACKEND_URL}api/paniers/${panier._id}`,
        {
          list_produit: updatedProductList,
          somme: updatedSum.toString(),
        }
      );
      setPanier(updatedPanier.data);

      const newProductCounts = { ...compteProduits };
      if (newProductCounts[productId] > 1) {
        newProductCounts[productId] -= 1;
      } else {
        delete newProductCounts[productId];
        setProduits(produits.filter((produit) => produit._id !== productId));
      }
      setCompteProduits(newProductCounts);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du panier:", error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!panier || !user) return;

    try {
      const orderData = {
        id_user: user.id,
        list_produit: panier.list_produit,
        somme: panier.somme,
        status: "nonvalider",
      };

      await axios.post(`${env.BACKEND_URL}api/commandes`, orderData);
      await axios.delete(`${env.BACKEND_URL}api/paniers/${panier._id}`);
      
      setPanier(null);
      setProduits([]);
      setCompteProduits({});
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      alert("Erreur lors de la commande. Veuillez réessayer.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Votre Panier</h1>
      {!panier || !panier.list_produit || panier.list_produit.length === 0 ? (
        <div className="text-center text-gray-600">Votre panier est vide.</div>
      ) : (
        <div>
          <ul className="space-y-4">
            {produits.map((produit) => (
              <li
                key={produit._id}
                className="flex justify-between items-center p-4 border rounded-lg shadow"
              >
                <div className="flex items-center">
                  <img
                    src={produit.image}
                    alt={produit.nom}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">
                      {produit.nom}{" "}
                      {compteProduits[produit._id] > 1 && (
                        <span className="text-sm text-gray-500">
                          x{compteProduits[produit._id]}
                        </span>
                      )}
                    </h2>
                    <p className="text-gray-500">Prix: {produit.prix} DT</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveProduct(produit._id)}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6 text-lg font-semibold">
            <strong>Total: {panier.somme || 0} DT</strong>
          </div>
          <button
            onClick={handlePlaceOrder}
            className="mt-4 bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 transition"
          >
            Passer la commande
          </button>
        </div>
      )}
    </div>
  );
};

export default Panier;
