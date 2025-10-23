// src/api.ts

import axios from "axios";
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

const apiClient = axios.create({
  baseURL: "https://fakestoreapi.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProducts = async (): Promise<ApiProduct[]> => {
  try {
    const response = await apiClient.get<ApiProduct[]>("/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products from API:", error);
    throw error;
  }
};

export const getProductById = async (id: string): Promise<ApiProduct> => {
  try {
    const response = await apiClient.get<ApiProduct>(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};


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

export const getPincodeDetails = async (
  pincode: string
): Promise<PostalApiResponse[]> => {
  try {
    const response = await axios.get<PostalApiResponse[]>(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching pincode ${pincode}:`, error);
    throw error;
  }
};
