import axios from "axios";

const API_URL = "https://api.rawg.io/api/games";
const GENRES_URL = "https://api.rawg.io/api/genres";
const API_KEY = process.env.NEXT_PUBLIC_RAWG_KEY;

export interface Genre {
  id: number;
  name: string;
}
export interface Product {
  id: number;
  name: string;
  background_image: string;
  genres: Genre[];
  description_raw?: string;
}

export interface ProductsResponse {
  results: Product[];
  count: number;
  next: string | null;
  previous: string | null;
}

export async function fetchProducts(
  search?: string,
  genres?: number[],
  page: number = 1
): Promise<ProductsResponse> {
  const res = await axios.get(API_URL, {
    params: {
      key: API_KEY,
 search: search || undefined,
      genres:
        genres && genres.length > 0
          ? genres.join(",")
          : undefined,
           page,
      page_size: 12, 
    },
  });

  return res.data;
}

export async function fetchProductById(
  id: number
): Promise<Product> {
  const res = await axios.get(`${API_URL}/${id}`, {
    params: { key: API_KEY },
  });

  return res.data;
}

export async function fetchGenres(): Promise<Genre[]> {
  const res = await axios.get(GENRES_URL, {
    params: { key: API_KEY },
  });

  return res.data.results;
}
