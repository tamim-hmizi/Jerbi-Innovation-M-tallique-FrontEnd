import { Link, Outlet } from "react-router-dom";
import { useState } from "react";

function TableauDeBord() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col h-screen ">
      {/* Navbar */}
      <nav className="bg-red-900 text-white relative z-1 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-xl font-bold">Tableau de Bord</div>
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="focus:outline-none">
              {/* Hamburger Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8 text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
          <div className="hidden md:flex space-x-4">
            <Link
              to="commandes"
              onClick={closeMobileMenu}
              className="block px-4 py-2 hover:bg-red-700 transition duration-300"
            >
              Commandes
            </Link>
            <Link
              to="categorie"
              onClick={closeMobileMenu}
              className="block px-4 py-2 hover:bg-red-700 transition duration-300"
            >
              Catégorie
            </Link>
            <Link
              to="produits"
              onClick={closeMobileMenu}
              className="block px-4 py-2 hover:bg-red-700 transition duration-300"
            >
              Produits
            </Link>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 right-0 bg-red-800 z-40">
            <Link
              to="commandes"
              onClick={closeMobileMenu}
              className="block px-4 py-2 hover:bg-red-700 transition duration-300"
            >
              Commandes
            </Link>
            <Link
              to="categorie"
              onClick={closeMobileMenu}
              className="block px-4 py-2 hover:bg-red-700 transition duration-300"
            >
              Catégorie
            </Link>
            <Link
              to="produits"
              onClick={closeMobileMenu}
              className="block px-4 py-2 hover:bg-red-700 transition duration-300"
            >
              Produits
            </Link>
          </div>
        )}
      </nav>

      {/* Contenu principal */}
      <div className="flex-1 p-6 bg-transparent">
        <Outlet />
      </div>
    </div>
  );
}

export default TableauDeBord;
