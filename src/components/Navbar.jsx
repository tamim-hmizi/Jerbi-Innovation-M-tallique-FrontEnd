import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    dispatch(clearUser());
    closeMenu();
    navigate("/signin");
  };

  return (
    <nav className="bg-gray-900 text-gray-300 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link
            to={user?.role === "admin" ? "/dashboard" : "/"}
            className="text-3xl font-bold transition duration-300 hover:text-red-500"
          >
            MyBrand
          </Link>
        </div>
        <div className="hidden md:flex space-x-6">
          {user?.role !== "admin" && (
            <>
              <Link
                to="/"
                className="text-lg flex items-center hover:text-red-500 transition duration-300"
              >
                Accueil
              </Link>
              <Link
                to="/products"
                className="text-lg flex items-center hover:text-red-500 transition duration-300"
              >
                Produits
              </Link>
              <Link
                to="/services"
                className="text-lg flex items-center hover:text-red-500 transition duration-300"
              >
                Services
              </Link>
              <Link
                to="/contact"
                className="text-lg flex items-center hover:text-red-500 transition duration-300"
              >
                Contact
              </Link>
            </>
          )}

          {user === null ? (
            <Link
              to="/signin"
              onClick={closeMenu}
              className="px-4 py-4 bg-red-600 text-gray-300 font-bold rounded hover:bg-red-700 transition duration-300 flex items-center"
            >
              Se connecter
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="text-lg flex items-center hover:text-red-500 transition duration-300"
              >
                Salut, {user.name}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-gray-800 rounded shadow-lg">
                  {user?.role !== "admin" && (
                    <Link
                      to="/"
                      onClick={closeMenu}
                      className="block px-4 py-2 text-sm hover:bg-gray-700 transition duration-300"
                    >
                      Mes Commandes
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition duration-300"
                  >
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-300 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden absolute left-0 right-0 bg-gray-800 border-t border-gray-700">
          <div className="flex flex-col">
            {user?.role !== "admin" && (
              <>
                <Link
                  to="/"
                  onClick={closeMenu}
                  className="px-4 py-4 text-lg flex items-center hover:bg-gray-700 hover:text-red-500 transition duration-300"
                >
                  Accueil
                </Link>
                <Link
                  to="/products"
                  onClick={closeMenu}
                  className="px-4 py-4 text-lg flex items-center hover:bg-gray-700 hover:text-red-500 transition duration-300"
                >
                  Produits
                </Link>
                <Link
                  to="/services"
                  onClick={closeMenu}
                  className="px-4 py-4 text-lg flex items-center hover:bg-gray-700 hover:text-red-500 transition duration-300"
                >
                  Services
                </Link>
                <Link
                  to="/contact"
                  onClick={closeMenu}
                  className="px-4 py-4 text-lg flex items-center hover:bg-gray-700 hover:text-red-500 transition duration-300"
                >
                  Contact
                </Link>
              </>
            )}

            {user === null ? (
              <Link
                to="/signin"
                onClick={closeMenu}
                className="px-4 py-4 bg-red-600 text-gray-300 font-bold rounded hover:bg-red-700 transition duration-300 flex items-center"
              >
                Se connecter
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="px-4 py-4 text-lg flex items-center hover:bg-gray-700 hover:text-red-500 transition duration-300"
                >
                  Salut, {user.name}
                </button>
                {dropdownOpen && (
                  <div className="absolute left-0 right-0 mt-2 bg-gray-800 rounded shadow-lg">
                    {user?.role !== "admin" && (
                      <Link
                        to="/"
                        onClick={closeMenu}
                        className="block px-4 py-2 text-sm hover:bg-gray-700 transition duration-300"
                      >
                        Mes Commandes
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition duration-300"
                    >
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
