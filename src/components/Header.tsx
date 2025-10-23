"use client";

import { Link, useNavigate } from "react-router-dom";
import React, { useMemo } from "react";
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
  Loader2, // --- ADDED: For modal loading spinner ---
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
// --- ✨ USE THE UPDATED CONTEXT ✨ ---
import { useProducts } from "../context/ProductContext";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Import the real API function and types ---
import { getPincodeDetails } from "../lib/api";

import logo from "../assets/Sitarahub.avif";

// --- SearchBar Component (No Changes) ---
function SearchBar() {
  // ✨ Get categories and the NEW setter function from context ✨
  const { setSearchQuery, setSelectedSearchCategory, categories } =
    useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSearchCategoryState, setSelectedSearchCategoryState] =
    useState("All"); // Local UI state
  const dropdownRef = useRef<HTMLFormElement>(null); // Ref for click outside

  const searchCategories = useMemo(() => {
    const uniqueCats = [
      "All",
      ...categories.filter((cat) => cat !== "All" && cat),
    ];
    return uniqueCats;
  }, [categories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      `[SearchBar] Searching for "${searchTerm}" in category: "${selectedSearchCategoryState}"`
    ); // Debug log
    setSearchQuery(searchTerm); // Set search term in context
    // setSelectedSearchCategory is already set via handleCategorySelect
    setIsDropdownOpen(false);
    navigate("/"); // Navigate to show results
  };

  const handleCategorySelect = (category: string) => {
    console.log(`[SearchBar] Category selected: ${category}`); // Debug log
    setSelectedSearchCategoryState(category); // Update local UI state
    setSelectedSearchCategory(category); // ✨ Update the CONTEXT state ✨
    setIsDropdownOpen(false);
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -5 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.15 } },
    exit: { opacity: 0, scale: 0.95, y: -5, transition: { duration: 0.1 } },
  } as const;

  return (
    <form
      onSubmit={handleSearch}
      className="flex-grow flex items-center max-w-2xl mx-2 relative"
      ref={dropdownRef}
    >
      <div className="flex items-center w-full rounded-lg border border-border overflow-hidden focus-within:ring-2 focus-within:ring-ring transition-all">
        {/* Category Button */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="bg-muted text-muted-foreground text-sm px-4 h-10 hover:bg-border flex-shrink-0 border-r border-border flex items-center gap-1 capitalize whitespace-nowrap"
        >
          {/* Display local state */}
          {selectedSearchCategoryState}
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {/* Search Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search Sitarahub.in ${
            selectedSearchCategoryState !== "All"
              ? `in ${selectedSearchCategoryState}`
              : ""
          }`}
          className="w-full h-10 px-3 bg-input text-foreground placeholder-muted-foreground focus:outline-none"
          onFocus={() => setIsDropdownOpen(false)}
        />
        {/* Search Submit Button */}
        <button
          type="submit"
          aria-label="Search"
          className="bg-primary text-primary-foreground h-10 px-4 flex-shrink-0 hover:bg-primary/90 transition-colors"
        >
          <Search size={24} />
        </button>
      </div>

      {/* Category Dropdown */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto scrollbar-thin" // Increased z-index
          >
            {/* ✨ Use categories from context ✨ */}
            {searchCategories.length > 1 ? ( // Check if categories are loaded
              searchCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategorySelect(category)} // Calls function that updates context
                  className={`block w-full text-left px-4 py-2 text-sm capitalize hover:bg-muted ${
                    selectedSearchCategoryState === category
                      ? "font-semibold text-primary"
                      : "text-foreground"
                  }`}
                >
                  {category}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-muted-foreground">
                Loading...
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
// --- END OF SearchBar Component ---

// --- PincodeModal Component (UPDATED) ---
interface PincodeModalProps {
  onClose: () => void;
  onUpdate: (pincode: string, city: string) => void;
  currentPincode: string;
}

function PincodeModal({
  onClose,
  onUpdate,
  currentPincode,
}: PincodeModalProps) {
  const [pincode, setPincode] = useState(currentPincode);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // --- UPDATED: handleSubmit to match your requested style ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Call API without explicit 'PostalApiResponse[]' type
      const data = await getPincodeDetails(pincode);

      // Logic adapted from your "goal" snippet
      if (data && data[0].Status === "Success" && data[0].PostOffice) {
        const postOffice = data[0].PostOffice[0];

        // Use modal's onUpdate function
        onUpdate(pincode, postOffice.District);
      } else {
        // Use modal's setError function
        setError(data[0]?.Message || "Invalid PIN Code");
      }
    } catch (error) {
      console.error("Error fetching pincode data:", error);
      // Use modal's setError function
      setError("Could not fetch PIN Code details.");
    } finally {
      setIsLoading(false);
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  // --- *** FIX IS HERE *** ---
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        // duration: 0.3, // <-- REMOVED: 'duration' is not compatible with 'type: "spring"'
      },
    },
    exit: { opacity: 0, scale: 0.9 },
  } as const; // <-- ADDED: 'as const' tells TypeScript these are literal types, not general strings.

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose} // Click outside to close
      >
        {/* Modal Content */}
        <motion.div
          ref={modalRef}
          variants={modalVariants} // <-- This will now work
          initial="hidden" // <-- ADDED: initial prop for modal animation
          animate="visible" // <-- ADDED: animate prop for modal animation
          exit="exit" // <-- ADDED: exit prop for modal animation
          className="bg-card rounded-lg shadow-2xl w-full max-w-sm"
          onClick={(e) => e.stopPropagation()} // Prevent click inside from closing
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">
              Update Delivery Location
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label
                htmlFor="pincode"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Enter your Pincode
              </label>
              <input
                id="pincode"
                type="tel"
                value={pincode}
                onChange={(e) => {
                  setError("");
                  setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
                }}
                placeholder="Enter 6-digit Pincode"
                className="w-full h-10 px-3 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                maxLength={6}
                autoFocus
              />
              {error && (
                <p className="text-xs text-destructive mt-1">{error}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading || pincode.length !== 6}
              className="w-full h-10 bg-primary text-primary-foreground rounded-md font-semibold flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Update Location"
              )}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </>
  );
}
// --- END OF PincodeModal Component ---

// --- Header Component (No Changes) ---
export default function Header() {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  // Using context for sidebar category reset, search bar uses its own logic now
  const { setSelectedCategory } = useProducts();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // --- NEW: State for Pincode Modal and Location ---
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState({
    pincode: "401203",
    city: "Nala Sopara",
  });

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // --- NEW: Handlers for Pincode Modal ---
  const openPincodeModal = () => setIsPincodeModalOpen(true);
  const closePincodeModal = () => setIsPincodeModalOpen(false);
  const handleLocationUpdate = (newPincode: string, newCity: string) => {
    setDeliveryLocation({ pincode: newPincode, city: newCity });
    closePincodeModal();
  };

  // This button in bottom nav now only resets sidebar category
  const handleAllClick = () => {
    setSelectedCategory(""); // Reset only the sidebar category
    navigate("/");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  } as const;

  const badgeVariants = {
    hidden: { scale: 0 },
    visible: { scale: 1, transition: { type: "spring", stiffness: 200 } },
  } as const;

  const mobileMenuContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  } as const;

  const mobileMenuVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0, transition: { type: "tween", duration: 0.3 } },
    exit: { x: "-100%", transition: { type: "tween", duration: 0.3 } },
  } as const;

  const linkStyles =
    "flex items-center gap-3 p-3 rounded-lg hover:bg-secondary hover:text-secondary-foreground transition-colors w-full";
  const badgeStyles =
    "ml-auto bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full";

  return (
    <motion.header
      className="bg-card text-foreground sticky top-0 z-40 border-b border-border shadow-md" // z-40 ensures it's below dropdown (z-50)
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
          {/* --- UPDATED: Delivery Button --- */}
          <button
            type="button"
            onClick={openPincodeModal}
            className="flex items-center gap-1 cursor-pointer p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <MapPin size={20} className="mt-2 text-muted-foreground" />
            <div className="text-xs leading-tight text-left">
              <span className="text-muted-foreground">
                Delivering to {deliveryLocation.city}
              </span>
              <span className="font-bold block text-sm text-foreground">
                {deliveryLocation.pincode}
              </span>
            </div>
          </button>
          <SearchBar /> {/* SearchBar component is used here */}
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
          <SearchBar /> {/* SearchBar component is used here */}
        </div>

        {/* --- UPDATED: Delivery Bar --- */}
        <button
          type="button"
          onClick={openPincodeModal}
          className="bg-muted text-muted-foreground px-2 py-2 flex items-center gap-2 text-sm truncate w-full hover:bg-border transition-colors"
        >
          <MapPin size={16} className="flex-shrink-0" />
          <span className="truncate text-foreground">
            Delivering to {deliveryLocation.city} {deliveryLocation.pincode}
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
              className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-card text-foreground z-50 md:hidden shadow-lg overflow-y-auto" // Ensure menu is above overlay
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
                    handleAllClick(); // Resets sidebar category
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

      {/* --- NEW: Render Pincode Modal --- */}
      <AnimatePresence>
        {isPincodeModalOpen && (
          <PincodeModal
            onClose={closePincodeModal}
            onUpdate={handleLocationUpdate}
            currentPincode={deliveryLocation.pincode}
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
}
