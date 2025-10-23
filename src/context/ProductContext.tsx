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

type Product = ApiProduct & {
  discountedPrice?: number;
};

interface Filters {
  searchQuery: string;
  selectedCategory: string;
  priceRange: { min: number; max: number };
  sortOption: string;
  selectedSearchCategory: string;
}

interface ProductContextType {
  products: Product[];
  filteredProducts: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  filters: Filters;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setPriceRange: (min: number, max: number) => void;
  setSortOption: (option: string) => void;
  setSelectedSearchCategory: (category: string) => void;
  resetFilters: () => void;
}

const ProductContext = createContext<ProductContextType | null>(null);

const MAX_PRICE_USD = 1000;

const initialFilters: Filters = {
  searchQuery: "",
  selectedCategory: "",
  priceRange: { min: 0, max: MAX_PRICE_USD },
  sortOption: "",
  selectedSearchCategory: "All",
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProducts();

        setProducts(data);

        const uniqueCategories = [
          "All",
          ...new Set(data.map((p: ApiProduct) => p.category)),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching products in context:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const tempProducts = products.filter((p) => {
      const price = p.price;
      const { min, max } = filters.priceRange;

      const searchMatch =
        !filters.searchQuery ||
        p.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(filters.searchQuery.toLowerCase());

      const sidebarCategoryMatch =
        !filters.selectedCategory ||
        p.category.toLowerCase() === filters.selectedCategory.toLowerCase();

      const isLastRange = max === MAX_PRICE_USD;

      const priceMatch =
        price >= min && (isLastRange ? price <= max : price < max);

      const searchCategoryMatch =
        filters.selectedSearchCategory === "All" ||
        p.category.toLowerCase() ===
          filters.selectedSearchCategory.toLowerCase();

      return (
        searchMatch && sidebarCategoryMatch && priceMatch && searchCategoryMatch
      );
    });

    const sorted = [...tempProducts];
    switch (filters.sortOption) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
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
        error,
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
