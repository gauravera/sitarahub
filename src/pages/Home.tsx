"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import SortDropdown from "../components/SortDropdown";
import { useProducts } from "../context/ProductContext";
import { Sparkles } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const { filteredProducts, loading, error } = useProducts();
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  console.log(
    `[Home.tsx] Rendering with ${filteredProducts.length} products.`,
    filteredProducts
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-accent" size={24} />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Welcome
            </span>
            <Sparkles className="text-accent" size={24} />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Discover Amazing Products
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Explore our curated collection of premium items. Find exactly what
            you're looking for.
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden md:block md:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                isOpen={true}
                onClose={() => {}}
              />{" "}
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1 min-w-0">
            {/* --- Mobile Filter Button REMOVED --- */}

            {/* Filter Modal Overlay */}
            {filterOpen && (
              <motion.div
                className="fixed inset-0 bg-black/50 md:hidden z-40"
                onClick={() => setFilterOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}

            {/* Mobile Filter Sidebar */}
            <div className="md:hidden">
              <FilterSidebar
                isOpen={filterOpen}
                onClose={() => setFilterOpen(false)}
                onOpen={() => setFilterOpen(true)}
              />
            </div>

            {/* Toolbar: Sort and Results Count */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                {!loading && (
                  <span>Showing {filteredProducts.length} products</span>
                )}
              </div>
              <SortDropdown />
            </div>

            {/* Loading State */}
            {loading && (
              <motion.div
                className="flex items-center justify-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-center">
                  <motion.div
                    className="inline-block rounded-full h-16 w-16 border-4 border-border border-t-primary mb-6"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                  <p className="text-muted-foreground text-lg">
                    Loading amazing products...
                  </p>
                </div>
              </motion.div>
            )}

            {/* Products Grid */}
            {!loading && filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredProducts.length === 0 && !error && (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-muted-foreground text-lg mb-4">
                  No products found matching your filters
                </p>
                <motion.button
                  onClick={() => window.location.reload()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Clear Filters
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
