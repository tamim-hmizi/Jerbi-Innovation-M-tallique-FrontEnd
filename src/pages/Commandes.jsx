import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import env from "../config";

function Commandes() {
  const user = useSelector((state) => state.user.userInfo);
  const navigate = useNavigate();
  const [commandes, setCommandes] = useState([]);
  const [produits, setProduits] = useState({}); // Store product details keyed by ID

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }

    const fetchCommandes = async () => {
      try {
        const res = await axios.get(
          `${env.BACKEND_URL}api/commandes/${user.id}`
        );
        setCommandes(res.data);

        // Fetch product details for all commandes
        const productIds = res.data.flatMap(
          (commande) => commande.list_produit
        );
        await fetchProductDetails(productIds);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes:", error);
      }
    };

    fetchCommandes();
  }, [user, navigate]);

  const fetchProductDetails = async (productIds) => {
    try {
      const uniqueIds = [...new Set(productIds)]; // Get unique product IDs
      const promises = uniqueIds.map((id) =>
        axios.get(`${env.BACKEND_URL}api/produits/${id}`)
      );
      const results = await Promise.all(promises);
      const productsMap = results.reduce((acc, res) => {
        acc[res.data._id] = res.data;
        return acc;
      }, {});
      setProduits(productsMap); // Set the product details in state
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails des produits:",
        error
      );
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.delete(`${env.BACKEND_URL}api/commandes/${orderId}`);
      setCommandes((prevCommandes) =>
        prevCommandes.filter((commande) => commande._id !== orderId)
      );
    } catch (error) {
      console.error("Erreur lors de l'annulation de la commande:", error);
      alert("Erreur lors de l'annulation. Veuillez réessayer.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Vos Commandes</h1>
      {commandes.length === 0 ? (
        <div className="text-center text-gray-600">
          Aucune commande trouvée.
        </div>
      ) : (
        <ul className="space-y-4">
          {commandes.map((commande) => {
            // Count the occurrences of each product ID
            const productCount = commande.list_produit.reduce(
              (acc, productId) => {
                acc[productId] = (acc[productId] || 0) + 1;
                return acc;
              },
              {}
            );

            return (
              <li
                key={commande._id}
                className="p-4 border rounded-lg shadow flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">
                    Commande #{commande._id}
                  </h2>
                  <p className="text-gray-500">Total: {commande.somme} DT</p>
                  <p className="text-gray-500">
                    Date: {new Date(commande.dateCommande).toLocaleDateString()}
                  </p>
                  <p
                    className={`${
                      commande.status === "valider"
                        ? "bg-green-500"
                        : "bg-red-500"
                    } text-white px-2 py-1 rounded inline-block text-sm`}
                  >
                    Statut: {commande.status}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-4">
                    {Object.entries(productCount).map(([productId, count]) => {
                      const product = produits[productId];
                      return product ? (
                        <div key={productId} className="flex items-center">
                          <img
                            src={product.image}
                            alt={product.nom}
                            className="w-10 h-10 object-cover rounded mr-2"
                          />
                          <div>
                            <h3 className="text-sm font-semibold">
                              {product.nom}{" "}
                              <span className="text-sm text-gray-500">
                                {count > 1 ? `x${count}` : ""}
                              </span>
                            </h3>
                            <p className="text-sm text-gray-500">
                              Prix: {product.prix} DT
                            </p>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
                {commande.status !== "valider" && (
                  <button
                    onClick={() => handleCancelOrder(commande._id)}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition mt-4 md:mt-0 md:ml-4"
                  >
                    Annuler
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Commandes;
