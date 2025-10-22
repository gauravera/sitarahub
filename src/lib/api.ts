// src/api.ts

import axios from "axios";

// --- Fake Store API ---

// 1. Define a type for the product from the API.
export interface ApiProduct {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

// 2. Create a reusable axios instance with the base URL
const apiClient = axios.create({
  baseURL: "https://fakestoreapi.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// 3. Create and export the function to fetch products
export const getProducts = async (): Promise<ApiProduct[]> => {
  try {
    // We only use the path '/products' since the baseURL is already set
    const response = await apiClient.get<ApiProduct[]>("/products");
    return response.data;
  } catch (error) {
    // Log the error for debugging and re-throw it
    // so the component that called it can handle it (e.g., show an error message)
    console.error("Error fetching products from API:", error);
    throw error;
  }
};

export const getProductById = async (id: string): Promise<ApiProduct> => {
  try {
    // We only use the path '/products/:id'
    const response = await apiClient.get<ApiProduct>(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

// --- NEW: Postal PIN Code API ---

// 1. Define types for the Postal API response
export interface PostOffice {
  Name: string;
  Description: string;
  BranchType: string;
  DeliveryStatus: string;
  Circle: string;
  District: string;
  Division: string;
  Region: string;
  State: string;
  Country: string;
}

export interface PostalApiResponse {
  Message: string;
  Status: "Success" | "Error";
  PostOffice: PostOffice[] | null;
}

// 2. Create and export the function to fetch PIN code details
export const getPincodeDetails = async (
  pincode: string
): Promise<PostalApiResponse[]> => {
  try {
    // Use axios directly since the base URL is different
    const response = await axios.get<PostalApiResponse[]>(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching pincode ${pincode}:`, error);
    throw error;
  }
};
