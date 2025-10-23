import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import { WishlistProvider } from "./context/WishlistContext";

import Layout from "./components/Layout"; 

import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login"; 
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <Router>
      <ProductProvider>
        <CartProvider>
          <WishlistProvider>

            <ScrollToTop />
            
            {/* Routes component is now the main wrapper */}
            <Routes>
              {/* ROUTE GROUP 1: All pages using the MainLayout (Header/Footer)
                This is a "Layout Route". MainLayout is the parent,
                and its children are rendered inside its <Outlet />.
              */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} /> {/* index means it's the default child */}
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="checkout" element={<Checkout />} />
              </Route>

              {/* ROUTE GROUP 2: Full-screen pages (no Header/Footer)
                This route is separate and does not use MainLayout.
              */}
              <Route path="/login" element={<Login />} />
              
              {/* You can add other full-screen routes here, e.g., /signup */}
              {/* <Route path="/signup" element={<SignUpPage />} /> */}

            </Routes>

            {/* ToastContainer can live outside Routes */}
            <ToastContainer
              position="bottom-right"
              autoClose={4000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </WishlistProvider>
        </CartProvider>
      </ProductProvider>
    </Router>
  );
}