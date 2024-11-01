import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CommandesAdmin from "./pages/CommandesAdmin";
import Categorie from "./pages/Categorie";
import ProductsAdmin from "./pages/ProductsAdmin";
import { Provider } from "react-redux";
import store from "./store";
import Panier from "./pages/Panier";
import Commandes from "./pages/Commandes";
const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="bg-gray-900 min-h-screen text-white">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/panier" element={<Panier />} />
              <Route path="/commandes" element={<Commandes />} />
              {/* Dashboard and nested routes */}
              <Route path="/dashboard" element={<Dashboard />}>
                <Route path="commandes" element={<CommandesAdmin />} />
                <Route path="categorie" element={<Categorie />} />
                <Route path="produits" element={<ProductsAdmin />} />
              </Route>
            </Routes>
          </div>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
