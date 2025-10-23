"use client";

// --- 2. IMPORT SlidersHorizontal (ChevronDown removed) ---
import { X, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../context/ProductContext";
import { formatPrice } from "../lib/priceUtils";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  // --- 1. Made onOpen optional ---
  onOpen?: () => void;
}

export default function FilterSidebar({
  isOpen,
  onClose,
  onOpen, // Destructure the new prop
}: FilterSidebarProps) {
  const { setSelectedCategory, setPriceRange, resetFilters, filters } =
    useProducts();

  // --- 3. REMOVED STATE/REF ---
  // const [isPriceSortOpen, setIsPriceSortOpen] = useState(false);
  // const priceSortRef = useRef<HTMLDivElement>(null);
  // --- End of Update ---

  const categories = [
    "electronics",
    "jewelery",
    "men's clothing",
    "women's clothing",
  ];

  const MAX_PRICE_USD = 1000;
  const priceRanges = [
    { label: `Under ${formatPrice(60)}`, min: 0, max: 60 },
    { label: `${formatPrice(60)} - ${formatPrice(175)}`, min: 60, max: 175 },
    { label: `${formatPrice(175)} - ${formatPrice(350)}`, min: 175, max: 350 },
    { label: `Over ${formatPrice(350)}`, min: 350, max: MAX_PRICE_USD },
  ];

  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "tween", duration: 0.3 } },
    exit: {
      x: "-100%",
      opacity: 0,
      transition: { type: "tween", duration: 0.25 },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05 },
    }),
  } as const;

  const isFilterActive =
    (filters.selectedCategory && filters.selectedCategory !== "") ||
    filters.priceRange.min > 0 ||
    filters.priceRange.max < MAX_PRICE_USD;

  const handleCloseOnMobile = () => {
    if (window.innerWidth < 768) setTimeout(onClose, 150);
  };

  // Close sidebar with Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        // --- 4. REMOVED ---
        // setIsPriceSortOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // --- 5. REMOVED PRICE SORT DROPDOWN (Click outside handler) ---
  // useEffect(() => { ... }, []);
  // --- End of Update ---

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // --- 6. REMOVED currentPriceLabel HELPER ---
  // const currentPriceLabel = () => { ... };
  // --- End of Update ---

  return (
    <>
      {/* ---------- Mobile Top Bar ---------- */}
      <div className="md:hidden w-full bg-card border-b border-border sticky top-0 z-30 px-4 py-3 flex flex-col gap-2 shadow-sm">
        {/* --- 7. UPDATED BUTTON LAYOUT --- */}
        <div className="flex items-center justify-between gap-3 relative">
          {/* Reset Button (Unchanged, still flex-1) */}
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

          {/* --- NEW "Open Filters" Button --- */}
          <motion.button
            // --- 2. Added check before calling onOpen ---
            onClick={onOpen ? onOpen : undefined}
            whileTap={{ scale: 0.96 }}
            className="flex-1 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition bg-muted hover:bg-muted/80 text-foreground"
          >
            <SlidersHorizontal size={18} />
            Filters
          </motion.button>
          {/* --- END OF NEW BUTTON --- */}

          {/* --- REMOVED Price Sort Button & Dropdown --- */}
        </div>
        {/* --- END OF UPDATE --- */}

        {/* --- Active Filter Summary (Unchanged) --- */}
        {isFilterActive && (
          <div className="flex flex-col text-sm text-muted-foreground mt-1">
            {filters.selectedCategory && (
              <span>
                <span className="font-medium text-foreground">Category:</span>{" "}
                {filters.selectedCategory}
              </span>
            )}
            {(filters.priceRange.min > 0 ||
              filters.priceRange.max < MAX_PRICE_USD) && (
              <span>
                <span className="font-medium text-foreground">Price:</span>{" "}
                {filters.priceRange.min === 0
                  ? `Under ${formatPrice(filters.priceRange.max)}`
                  : filters.priceRange.max === MAX_PRICE_USD
                  ? `Over ${formatPrice(filters.priceRange.min)}`
                  : `${formatPrice(filters.priceRange.min)} - ${formatPrice(
                      filters.priceRange.max
                    )}`}
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
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Sidebar Panel (Unchanged from here down) */}
            <motion.aside
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed left-0 top-0 bottom-0 w-72 bg-card border-r border-border z-50 shadow-xl md:relative md:w-full md:shadow-none md:rounded-xl md:border md:h-fit flex flex-col"
            >
              {/* Header */}
              <div className="sticky top-0 bg-card z-10 px-5 py-4 border-b border-border shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">
                    Filters
                  </h2>
                  <motion.button
                    onClick={onClose}
                    className="md:hidden text-muted-foreground hover:text-foreground"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Close filters"
                  >
                    <X size={22} />
                  </motion.button>
                </div>

                {/* Clear Filters Button */}
                <motion.div
                  className="mt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.button
                    onClick={isFilterActive ? resetFilters : undefined}
                    disabled={!isFilterActive}
                    whileTap={isFilterActive ? { scale: 0.97 } : {}}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition text-sm ${
                      isFilterActive
                        ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                        : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                    }`}
                  >
                    <RotateCcw size={16} />
                    Clear Filters
                  </motion.button>
                </motion.div>
              </div>

              {/* Content Area */}
              <div className="flex-1 px-5 py-5 space-y-10">
                {/* --- Category Filter (Unchanged) --- */}
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

                {/* --- Price Range Buttons (Unchanged) --- */}
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
                    {priceRanges.map((range, i) => {
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
