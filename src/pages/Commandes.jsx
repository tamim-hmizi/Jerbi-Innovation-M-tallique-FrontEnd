import { useEffect, useState } from "react";
import axios from "axios";
import env from "../config";

function Commandes() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCommandes = async () => {
      setLoading(true);
      setError(""); // Reset error state
      try {
        const response = await axios.get(`${env.BACKEND_URL}api/commandes`);
        setCommandes(response.data);
      } catch (error) {
        setError("Échec du chargement des commandes.");
        console.error("Échec du chargement des commandes:", error);
      } finally {
        setLoading(false);
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
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
      setError(""); // Reset error state
      try {
        await axios.delete(`${env.BACKEND_URL}api/commandes/${id}`);
        setCommandes((prev) => prev.filter((commande) => commande._id !== id));
      } catch (error) {
        setError("Erreur lors de la suppression de la commande.");
        console.error("Échec de la suppression:", error);
      }
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
        <ul className="space-y-2">
          {commandes.map((commande) => (
            <li
              key={commande._id}
              className="flex justify-between items-center border bg-gray-700 p-2 rounded shadow text-gray-300"
            >
              <div>
                <p>
                  <strong>Somme:</strong> {commande.somme} €
                </p>
                <p>
                  <strong>Status:</strong> {commande.status}
                </p>
                <p>
                  <strong>Date de commande:</strong>{" "}
                  {new Date(commande.dateCommande).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center">
                <label className="mr-4">
                  <input
                    type="checkbox"
                    checked={commande.status === "valider"}
                    onChange={() => toggleStatus(commande._id, commande.status)}
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
          ))}
        </ul>
      )}
    </div>
  );
}

export default Commandes;
