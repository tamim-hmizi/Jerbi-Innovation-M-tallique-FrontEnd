import { useEffect, useState } from "react";
import axios from "axios";
import env from "../config";

function Commandes() {
  const [commandes, setCommandes] = useState([]);
  const [produits, setProduits] = useState({}); // Store product details keyed by ID
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCommandes = async () => {
      setLoading(true);
      setError(""); // Reset error state
      try {
        const response = await axios.get(`${env.BACKEND_URL}api/commandes`);
        setCommandes(response.data);

        // Fetch product details for each commande
        const productIds = response.data.flatMap(
          (commande) => commande.list_produit
        );
        await fetchProductDetails(productIds);
      } catch (error) {
        setError("Échec du chargement des commandes.");
        console.error("Échec du chargement des commandes:", error);
      } finally {
        setLoading(false);
      }
    };

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
        setError("Erreur lors de la récupération des détails des produits.");
        console.error("Erreur lors de la récupération des produits:", error);
      }
    };

    fetchCommandes();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    setError(""); // Reset error state
    const newStatus = currentStatus === "valider" ? "nonvalider" : "valider";

    try {
      const response = await axios.put(
        `${env.BACKEND_URL}api/commandes/${id}`,
        {
          status: newStatus,
        }
      );
      setCommandes((prev) =>
        prev.map((commande) =>
          commande._id === response.data._id ? response.data : commande
        )
      );
    } catch (error) {
      setError("Erreur lors de la mise à jour du statut de la commande.");
      console.error("Erreur de mise à jour:", error);
    }
  };

  const handleDeleteCommande = async (id) => {
    setError(""); // Reset error state
    try {
      await axios.delete(`${env.BACKEND_URL}api/commandes/${id}`);
      setCommandes((prev) => prev.filter((commande) => commande._id !== id));
    } catch (error) {
      setError("Erreur lors de la suppression de la commande.");
      console.error("Échec de la suppression:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-300">Commandes</h1>

      {loading ? (
        <p>Chargement des commandes...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
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
                className="flex flex-col border bg-gray-700 p-4 rounded shadow text-gray-300"
              >
                <div>
                  <p>
                    <strong>Somme:</strong> {commande.somme} DT
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(commande.dateCommande).toLocaleDateString()}
                  </p>
                  
                </div>
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
                <div className="flex items-center mt-2">
                  <label className="mr-4">
                    <input
                      type="checkbox"
                      checked={commande.status === "valider"}
                      onChange={() =>
                        toggleStatus(commande._id, commande.status)
                      }
                      className="mr-1"
                    />
                    Valider
                  </label>
                  <button
                    onClick={() => handleDeleteCommande(commande._id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Commandes;
