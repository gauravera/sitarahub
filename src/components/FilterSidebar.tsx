"use client";

import { X, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../context/ProductContext";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterSidebar({ isOpen, onClose }: FilterSidebarProps) {
  const { setSelectedCategory, setPriceRange, resetFilters, filters } =
    useProducts();

  const categories = [
    "electronics",
    "jewelery",
    "men's clothing",
    "women's clothing",
  ];

  // --- FIX APPLIED ---
  // Added `as const` to tell TypeScript these are literal,
  // read-only values, not general strings (e.g., type: "tween").
  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "tween", duration: 0.3 } },
    exit: {
      x: "-100%",
      opacity: 0,
      transition: { type: "tween", duration: 0.25 },
    },
  } as const; // <-- FIX IS HERE

  const itemVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05 },
    }),
  } as const; // <-- Added here for consistency
  // --- END OF FIX ---

  // ✅ Determine if any filter is active
  const isFilterActive =
    (filters.selectedCategory && filters.selectedCategory !== "") ||
    filters.priceRange.min > 0 ||
    filters.priceRange.max < 1000;

  const handleCloseOnMobile = () => {
    if (window.innerWidth < 768) setTimeout(onClose, 150);
  };

  // ✅ Close sidebar with Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <>
      {/* ---------- Reset Button and Filter Summary for Mobile ---------- */}
      <div className="md:hidden w-full bg-card border-b border-border sticky top-0 z-30 px-4 py-3 flex flex-col gap-2 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          {/* 🧩 Existing Open Filter button is outside — this only adds Reset beside it */}
          <motion.button
            onClick={isFilterActive ? resetFilters : undefined}
            whileTap={isFilterActive ? { scale: 0.96 } : {}}
            disabled={!isFilterActive}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              isFilterActive
                ? "bg-muted hover:bg-muted/80 text-foreground"
                : "bg-muted text-muted-foreground cursor-not-allowed opacity-70"
            }`}
          >
            <RotateCcw size={18} />
            Reset
          </motion.button>
        </div>

        {/* Active Filter Summary */}
        {isFilterActive && (
          <div className="flex flex-col text-sm text-muted-foreground mt-1">
            {filters.selectedCategory && (
              <span>
                <span className="font-medium text-foreground">Category:</span>{" "}
                {filters.selectedCategory}
              </span>
            )}
            {(filters.priceRange.min > 0 || filters.priceRange.max < 1000) && (
              <span>
                <span className="font-medium text-foreground">Price:</span>{" "}
                {filters.priceRange.min === 0
                  ? `Under $${filters.priceRange.max}`
                  : filters.priceRange.max === 1000
                  ? `Over $${filters.priceRange.min}`
                  : `$${filters.priceRange.min} - $${filters.priceRange.max}`}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ---------- Sidebar Overlay + Content ---------- */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => {
                onClose();
                document.body.style.overflow = "";
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Sidebar Panel */}
            <motion.aside
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed left-0 top-0 bottom-0 w-72 bg-card border-r border-border z-50 shadow-xl md:relative md:w-full md:shadow-none md:rounded-xl md:border md:h-auto md:max-h-[calc(100vh-120px)] flex flex-col"
            >
              {/* Header */}
              <div className="sticky top-0 bg-card z-10 flex items-center justify-between px-5 py-4 border-b border-border shadow-sm">
                <h2 className="text-lg font-semibold text-foreground">
                  Filters
                </h2>
                <motion.button
                  onClick={() => {
                    onClose();
                    document.body.style.overflow = "";
                  }}
                  className="md:hidden text-muted-foreground hover:text-foreground"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Close filters"
                >
                  <X size={22} />
                </motion.button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-10 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                {/* Category Filter */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.05 } },
                  }}
                >
                  <h3 className="text-sm uppercase tracking-wide text-muted-foreground font-semibold mb-3">
                    Category
                  </h3>
                  <div className="space-y-2">
                    <motion.button
                      onClick={() => {
                        setSelectedCategory("");
                        handleCloseOnMobile();
                      }}
                      className={`block w-full text-left px-3 py-2 rounded-lg capitalize font-medium transition-colors ${
                        filters.selectedCategory === ""
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                      variants={itemVariants}
                      custom={0}
                      whileHover={{ x: 5 }}
                    >
                      All Categories
                    </motion.button>

                    {categories.map((cat, i) => (
                      <motion.button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          handleCloseOnMobile();
                        }}
                        className={`block w-full text-left px-3 py-2 rounded-lg capitalize font-medium transition-colors ${
                          filters.selectedCategory === cat
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                        variants={itemVariants}
                        custom={i + 1}
                        whileHover={{ x: 5 }}
                      >
                        {cat}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Price Range */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.05 } },
                  }}
                >
                  <h3 className="text-sm uppercase tracking-wide text-muted-foreground font-semibold mb-3">
                    Price Range
                  </h3>
                  <div className="space-y-2">
                    {[
                      { label: "Under $100", min: 0, max: 100 },
                      { label: "$100 - $300", min: 100, max: 300 },
                      { label: "$300 - $500", min: 300, max: 500 },
                      { label: "Over $500", min: 500, max: 1000 },
                    ].map((range, i) => {
                      const isActive =
                        filters.priceRange.min === range.min &&
                        filters.priceRange.max === range.max;
                      return (
                        <motion.button
                          key={range.label}
                          onClick={() => {
                            setPriceRange(range.min, range.max);
                            handleCloseOnMobile();
                          }}
                          className={`block w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                          variants={itemVariants}
                          custom={i}
                          whileHover={{ x: 5 }}
                        >
                          {range.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
