import axios from "axios";

const API_URL = "https://api.rawg.io/api/games";
const API_KEY = "0a087a96dc3641c5a129920cd094ac50"; 

export interface Product {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  genres: { id: number; name: string }[];
}

export async function fetchProducts(search?: string): Promise<Product[]> {
  const res = await axios.get(API_URL, {
    params: { key: API_KEY, search },
  });
  return res.data.results;
}

export async function fetchProductById(id: number): Promise<Product> {
  const res = await axios.get(`${API_URL}/${id}`, {
    params: { key: API_KEY },
  });
  return res.data;
}
