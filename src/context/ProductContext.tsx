"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import type { ApiProduct } from "../lib/api";
import { getProducts } from "../lib/api";

// Local type extending ApiProduct
type Product = ApiProduct & {
  discountedPrice?: number;
};

interface Filters {
  searchQuery: string;
  selectedCategory: string; // Sidebar category
  priceRange: { min: number; max: number };
  sortOption: string;
  selectedSearchCategory: string; // Search bar category
}

interface ProductContextType {
  products: Product[];
  filteredProducts: Product[];
  categories: string[];
  loading: boolean;
  filters: Filters;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setPriceRange: (min: number, max: number) => void;
  setSortOption: (option: string) => void;
  setSelectedSearchCategory: (category: string) => void;
  resetFilters: () => void;
}

const ProductContext = createContext<ProductContextType | null>(null);

// --- 1. DEFINE CONSTANTS IN USD ---
// This now matches the MAX_PRICE_USD in FilterSidebar
const MAX_PRICE_USD = 1000;
// We no longer need USD_TO_INR_RATE or MAX_PRICE_INR here.

const initialFilters: Filters = {
  searchQuery: "",
  selectedCategory: "",
  // The filter range is now in USD
  priceRange: { min: 0, max: MAX_PRICE_USD },
  sortOption: "",
  selectedSearchCategory: "All", // Default search category
};

export const ProductProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);

  // Fetch products and categories
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // data contains products with prices in USD
        const data = await getProducts();

        // --- KEY FIX: REMOVED INR CONVERSION ---
        // We store the original USD-priced products directly in state.
        // All filtering and logic will be done in USD.
        setProducts(data);
        // --- END OF FIX ---

        // Extract unique categories
        const uniqueCategories = [
          "All",
          ...new Set(data.map((p: ApiProduct) => p.category)),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching products in context:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const tempProducts = products.filter((p) => {
      // 'p.price' is now the original USD price
      const price = p.price;
      // 'filters.priceRange' is now also in USD
      const { min, max } = filters.priceRange;

      const searchMatch =
        !filters.searchQuery ||
        p.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(filters.searchQuery.toLowerCase());

      const sidebarCategoryMatch =
        !filters.selectedCategory ||
        p.category.toLowerCase() === filters.selectedCategory.toLowerCase();

      // --- Price Overlap Fix (Now correctly uses USD) ---
      // This checks if the filter is "Over $350" (or "Over ₹...")
      const isLastRange = max === MAX_PRICE_USD;

      // This logic now correctly compares USD (price) with USD (min, max)
      const priceMatch =
        price >= min && (isLastRange ? price <= max : price < max);
      // --- End of Price Overlap Fix ---

      const searchCategoryMatch =
        filters.selectedSearchCategory === "All" ||
        p.category.toLowerCase() ===
          filters.selectedSearchCategory.toLowerCase();

      return (
        searchMatch && sidebarCategoryMatch && priceMatch && searchCategoryMatch
      );
    });

    // --- Sorting Logic (This works perfectly with USD prices) ---
    const sorted = [...tempProducts];
    switch (filters.sortOption) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - b.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case "newest":
        sorted.sort((a, b) => b.id - a.id);
        break;
    }
    return sorted;
  }, [products, filters]);

  // --- Filter Setter Functions (These receive USD values from the sidebar) ---
  const setSearchQuery = (query: string) =>
    setFilters((prev) => ({ ...prev, searchQuery: query }));

  const setSelectedCategory = (category: string) =>
    setFilters((prev) => ({ ...prev, selectedCategory: category }));

  const setPriceRange = (min: number, max: number) =>
    setFilters((prev) => ({ ...prev, priceRange: { min, max } }));

  const setSortOption = (option: string) =>
    setFilters((prev) => ({ ...prev, sortOption: option }));

  const setSelectedSearchCategory = (category: string) =>
    setFilters((prev) => ({ ...prev, selectedSearchCategory: category }));

  const resetFilters = () => setFilters(initialFilters);

  return (
    <ProductContext.Provider
      value={{
        products,
        filteredProducts,
        categories,
        loading,
        filters,
        setSearchQuery,
        setSelectedCategory,
        setPriceRange,
        setSortOption,
        setSelectedSearchCategory,
        resetFilters,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

//eslint-disable-next-line react-refresh/only-export-components
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === null) {
    throw new Error("useProducts() must be used within a <ProductProvider>");
  }
  return context;
};
