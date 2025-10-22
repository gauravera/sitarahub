"use client";

import { Search, X } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { motion } from "framer-motion";

export default function SearchBar() {
  const { setSearchQuery, filters } = useProducts();

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Search
        className="absolute left-3 top-3 text-muted-foreground"
        size={20}
      />
      <input
        type="text"
        placeholder="Search products..."
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-10 py-3 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
      />
      {filters.searchQuery && (
        <motion.button
          onClick={() => setSearchQuery("")}
          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <X size={18} />
        </motion.button>
      )}
    </motion.div>
  );
}
