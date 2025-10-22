"use client";

import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  LogIn,
  Menu,
  X,
  MapPin,
  Search,
  ChevronDown,
  User,
  Home,
  Tag,
  Store,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useProducts } from "../context/ProductContext"; // --- NEW --- For Search
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import logo from "../assets/Sitarahub.avif";

// --- UPDATED: SearchBar is now a fully functional component ---
function SearchBar() {
  const { setSearchQuery } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
    // Navigate to the main product page to show results
    navigate("/");
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex-grow flex items-center max-w-2xl mx-2"
    >
      <div className="flex items-center w-full rounded-lg border border-border overflow-hidden focus-within:ring-2 focus-within:ring-ring transition-all">
        {/* --- STYLES UPDATED --- */}
        <button
          type="button" // Prevent form submission
          className="bg-muted text-muted-foreground text-sm px-4 h-10 hover:bg-border flex-shrink-0 border-r border-border flex items-center gap-1"
        >
          All <ChevronDown size={16} />
        </button>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Sitarahub.in"
          className="w-full h-10 px-3 bg-input text-foreground placeholder-muted-foreground focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Search"
          className="bg-primary text-primary-foreground h-10 px-4 flex-shrink-0 hover:bg-primary/90 transition-colors"
        >
          <Search size={24} />
        </button>
      </div>
    </form>
  );
}

export default function Header() {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { setSelectedCategory } = useProducts();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // --- UPDATED: Correct cart count logic ---
  // This correctly sums the 'quantity' of each unique item in the cart.
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleAllClick = () => {
    setSelectedCategory(""); // Reset category filter
    navigate("/"); // Navigate to home/products page
  };

  // --- FIX APPLIED ---
  // Added `as const` to all variant objects to prevent TypeScript
  // from "widening" the types (e.g., "spring" becomes string).
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  } as const;

  const badgeVariants = {
    hidden: { scale: 0 },
    visible: { scale: 1, transition: { type: "spring", stiffness: 200 } },
  } as const; // <-- FIX IS HERE

  const mobileMenuContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  } as const;

  const mobileMenuVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0, transition: { type: "tween", duration: 0.3 } },
    exit: { x: "-100%", transition: { type: "tween", duration: 0.3 } },
  } as const;
  // --- END OF FIX ---

  // --- STYLES UPDATED ---
  // Using theme variables for consistency
  const linkStyles =
    "flex items-center gap-3 p-3 rounded-lg hover:bg-secondary hover:text-secondary-foreground transition-colors w-full";
  const badgeStyles =
    "ml-auto bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full";

  return (
    <motion.header
      // --- STYLES UPDATED ---
      className="bg-card text-foreground sticky top-0 z-40 border-b border-border shadow-md"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* --- DESKTOP HEADER --- */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-1 p-2 -ml-2 rounded-lg hover:opacity-80 transition-opacity"
          >
            <img src={logo} alt="Sitarahub Logo" className="h-14 w-auto" />
          </Link>

          {/* Delivery */}
          <button className="flex items-center gap-1 cursor-pointer p-2 rounded-lg hover:bg-muted transition-colors">
            <MapPin size={20} className="mt-2 text-muted-foreground" />
            <div className="text-xs leading-tight text-left">
              <span className="text-muted-foreground">Delivering to</span>
              <span className="font-bold block text-sm text-foreground">
                Nala Sopara 401203
              </span>
            </div>
          </button>

          <SearchBar />

          {/* Right Nav */}
          <nav className="flex items-center gap-1 flex-shrink-0">
            <Link
              to="/login"
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="text-xs text-muted-foreground">
                Hello, sign in
              </div>
              <div className="text-sm font-bold text-foreground flex items-center">
                Account & Lists <ChevronDown size={16} />
              </div>
            </Link>
            <Link
              to="/wishlist"
              className="p-2 relative rounded-lg hover:bg-muted transition-colors"
            >
              <div className="text-xs text-muted-foreground">Your</div>
              <div className="text-sm font-bold text-foreground">Wishlist</div>
              {wishlist.length > 0 && (
                <motion.span
                  className="absolute -top-1 right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  variants={badgeVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {wishlist.length}
                </motion.span>
              )}
            </Link>
            <Link
              to="/cart"
              className="flex items-end gap-1 p-2 relative rounded-lg hover:bg-muted transition-colors"
            >
              <ShoppingCart size={32} />
              <span className="text-sm font-bold">Cart</span>
              {cartCount > 0 && (
                <motion.span
                  className="absolute top-0 left-3 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  variants={badgeVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>
          </nav>
        </div>

        {/* Bottom Nav Bar */}
        <div className="bg-muted/50 text-muted-foreground border-t border-border">
          <div className="max-w-7xl mx-auto px-4 py-1 flex items-center gap-2 text-sm">
            <button
              onClick={handleAllClick}
              className="flex items-center gap-1 font-bold p-2 rounded-md hover:bg-border transition-colors text-foreground"
            >
              <Menu size={20} />
              All
            </button>
            <Link
              to="/category/deals"
              className="p-2 rounded-md hover:bg-border transition-colors"
            >
              Deals
            </Link>
            <Link
              to="/sell"
              className="p-2 rounded-md hover:bg-border transition-colors"
            >
              Sell
            </Link>
            <Link
              to="/gift-cards"
              className="p-2 rounded-md hover:bg-border transition-colors"
            >
              Gift Cards
            </Link>
            <Link
              to="/customer-service"
              className="p-2 rounded-md hover:bg-border transition-colors"
            >
              Customer Service
            </Link>
          </div>
        </div>
      </div>

      {/* --- MOBILE HEADER --- */}
      <div className="md:hidden">
        {/* Top Bar */}
        <div className="bg-card text-foreground px-2 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <motion.button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 hover:bg-muted rounded-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu size={24} />
            </motion.button>
            <Link to="/" className="flex items-center gap-1 p-1">
              <img src={logo} alt="Sitarahub Logo" className="h-12 w-auto" />
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <Link
              to="/login"
              className="flex items-center gap-1 text-sm text-primary font-medium p-2 hover:bg-muted rounded-lg transition-colors"
            >
              Sign in <User size={20} />
            </Link>
            <Link
              to="/cart"
              className="relative p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  variants={badgeVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-card px-2 pb-2">
          <SearchBar />
        </div>

        {/* Delivery Bar */}
        <button className="bg-muted text-muted-foreground px-2 py-2 flex items-center gap-2 text-sm truncate w-full hover:bg-border transition-colors">
          <MapPin size={16} className="flex-shrink-0" />
          <span className="truncate text-foreground">
            Delivering to Nala Sopara 401203
          </span>
          <ChevronDown size={16} className="flex-shrink-0 ml-auto" />
        </button>
      </div>

      {/* --- MOBILE MENU (Fly-out Side Panel) --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              variants={mobileMenuContainerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.nav
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-card text-foreground z-50 md:hidden shadow-lg overflow-y-auto"
            >
              <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-lg font-bold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={28} className="bg-primary/80 rounded-full p-1" />
                  Hello, sign in
                </Link>
                <motion.button
                  onClick={() => setMobileMenuOpen(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1 rounded-full hover:bg-primary/80"
                >
                  <X size={24} />
                </motion.button>
              </div>
              <div className="p-4 space-y-1">
                <Link
                  to="/"
                  className={linkStyles}
                  onClick={() => {
                    handleAllClick();
                    setMobileMenuOpen(false);
                  }}
                >
                  <Home size={20} />{" "}
                  <span className="text-lg font-medium">Home</span>
                </Link>
                <Link
                  to="/wishlist"
                  className={linkStyles}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart size={20} />{" "}
                  <span className="text-sm font-medium">Wishlist</span>
                  {wishlist.length > 0 && (
                    <span className={badgeStyles}>{wishlist.length}</span>
                  )}
                </Link>
                <Link
                  to="/cart"
                  className={linkStyles}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingCart size={20} />{" "}
                  <span className="text-sm font-medium">Cart</span>
                  {cartCount > 0 && (
                    <span className={badgeStyles}>{cartCount}</span>
                  )}
                </Link>
                <hr className="my-2 border-border" />
                <h3 className="font-bold text-lg px-3 pt-4 pb-2">
                  Shop By Category
                </h3>
                <Link
                  to="/category/deals"
                  className={linkStyles}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Tag size={20} /> <span className="text-sm">Deals</span>
                </Link>
                <Link
                  to="/sell"
                  className={linkStyles}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Store size={20} /> <span className="text-sm">Sell</span>
                </Link>
                <hr className="my-2 border-border" />
                <Link
                  to="/login"
                  className={linkStyles}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogIn size={20} />{" "}
                  <span className="text-sm font-medium">Login / Sign Up</span>
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
