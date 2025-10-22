"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
// --- MODIFIED ---
import type { ApiProduct } from "../lib/api";
import { getProducts } from "../lib/api";

// --- NEW (Recommended) ---
// This is the local type for your context.
// It allows for the 'discountedPrice' you use in your filter logic.
type Product = ApiProduct & {
  discountedPrice?: number;
};

// --- NEW (Recommended) ---
// Define a type for our context's value for full type safety
interface ProductContextType {
  products: Product[];
  filteredProducts: Product[];
  categories: string[]; // <-- MODIFICATION: Added categories list
  loading: boolean;
  filters: typeof initialFilters;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setPriceRange: (min: number, max: number) => void;
  setSortOption: (option: string) => void;
  resetFilters: () => void;
}

// --- MODIFIED ---
// Create the context with the new type (or null for default)
const ProductContext = createContext<ProductContextType | null>(null);

// Store initial filter state to make resetting easier
const initialFilters = {
  searchQuery: "",
  selectedCategory: "",
  priceRange: { min: 0, max: 1000 },
  sortOption: "",
};

export const ProductProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // --- MODIFIED ---
  // Use our new 'Product' type instead of 'any[]'
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]); // <-- MODIFICATION: Added categories state
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState(initialFilters);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // --- MODIFIED ---
        // Use the new, clean API function!
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);

        // --- MODIFICATION: Extract and set unique categories ---
        const uniqueCategories = [
          ...new Set(data.map((p: ApiProduct) => p.category)),
        ];
        setCategories(uniqueCategories);
        // --- End Modification ---
      } catch (err) {
        // The API file already logged the error, but we can log this too.
        console.error("Error setting products in context:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Apply filters + sorting (This effect remains the same, which is great!)
  useEffect(() => {
    // --- START OF DEBUG LOGS ---
    console.groupCollapsed(`[ProductContext] Filtering Effect Triggered`);
    console.log("Timestamp:", new Date().toLocaleTimeString());
    console.log("Current Filters:", filters);
    console.log(`Master product list size: ${products.length}`);
    // --- END OF DEBUG LOGS ---

    if (products.length === 0) {
      console.log("Master list is empty, skipping filter.");
      console.groupEnd();
      return;
    }

    const filtered = products.filter((p) => {
      // Your existing logic works perfectly with the new types
      const price = p.discountedPrice ?? p.price;

      return (
        (filters.searchQuery
          ? p.title.toLowerCase().includes(filters.searchQuery.toLowerCase())
          : true) &&
        (filters.selectedCategory && filters.selectedCategory !== ""
          ? p.category.toLowerCase() === filters.selectedCategory.toLowerCase()
          : true) &&
        price >= filters.priceRange.min &&
        price <= filters.priceRange.max
      );
    });

    // ... (sorting logic remains the same)
    const sortedProducts = [...filtered];
    switch (filters.sortOption) {
      case "price-low":
        sortedProducts.sort(
          (a, b) =>
            (a.discountedPrice ?? a.price) - (b.discountedPrice ?? b.price)
        );
        break;
      case "price-high":
        sortedProducts.sort(
          (a, b) =>
            (b.discountedPrice ?? b.price) - (a.discountedPrice ?? a.price)
        );
        break;
      case "rating":
        sortedProducts.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case "newest":
        sortedProducts.sort((a, b) => b.id - a.id);
        break;
    }

    // --- START OF DEBUG LOGS ---
    console.log(`Filtered list size (pre-sort): ${filtered.length}`);
    console.log(`Sorted list size (post-sort): ${sortedProducts.length}`);
    console.groupEnd();
    // --- END OF DEBUG LOGS ---

    setFilteredProducts(sortedProducts);
  }, [products, filters]);

  // Exposed helper functions (These are perfect, no changes needed)
  const setSearchQuery = (query: string) =>
    setFilters((prev) => ({ ...prev, searchQuery: query }));

  const setSelectedCategory = (category: string) =>
    setFilters((prev) => ({ ...prev, selectedCategory: category }));

  const setPriceRange = (min: number, max: number) =>
    setFilters((prev) => ({ ...prev, priceRange: { min, max } }));

  const setSortOption = (option: string) =>
    setFilters((prev) => ({ ...prev, sortOption: option }));

  const resetFilters = () => setFilters(initialFilters); // Use the constant

  return (
    <ProductContext.Provider
      value={{
        products,
        filteredProducts,
        categories, // <-- MODIFICATION: Pass categories to consumers
        loading,
        filters,
        setSearchQuery,
        setSelectedCategory,
        setPriceRange,
        setSortOption,
        resetFilters,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// --- MODIFIED ---
// This makes your hook fully type-safe and easier to use

// eslint-disable-next-line react-refresh/only-export-components
export const useProducts = () => {
  const context = useContext(ProductContext);

  if (context === null) {
    throw new Error("useProducts() must be used within a <ProductProvider>");
  }

  return context;
};
