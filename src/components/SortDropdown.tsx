"use client";

import { ChevronDown } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { motion } from "framer-motion";
import { useState } from "react";

export default function SortDropdown() {
  const { setSortOption, filters } = useProducts();
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: "none", label: "Relevance" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ];

  const currentLabel =
    sortOptions.find((opt) => opt.value === filters.sortOption)?.label ||
    "Sort By";

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors text-foreground font-medium"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-sm">{currentLabel}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.button>

      {isOpen && (
        <motion.div
          className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-20"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {sortOptions.map((option, i) => (
            <motion.button
              key={option.value}
              onClick={() => {
                setSortOption(option.value as any);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 transition-colors ${
                i !== sortOptions.length - 1 ? "border-b border-border" : ""
              } ${
                filters.sortOption === option.value
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-foreground"
              }`}
              whileHover={{ paddingLeft: 20 }}
            >
              {option.label}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
