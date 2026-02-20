"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, Product, ProductsResponse } from "../services/products.service";
import Link from "next/link";
import AdvancedSelect from "../../components/AdvancedSelect";
import { FiSearch } from "react-icons/fi";

type Genre = {
  id: number;
  name: string;
};

const fetchGenres = async (): Promise<Genre[]> => {
  return [
    { id: 1, name: "Action" },
    { id: 2, name: "Adventure" },
    { id: 3, name: "RPG" },
    { id: 4, name: "Strategy" },
  ];
};

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, error } = useQuery<ProductsResponse>({
    queryKey: ["products", search, selectedGenres, page],
    queryFn: () => fetchProducts(search, selectedGenres, page),
    keepPreviousData: true,
  });

  const { data: genresData } = useQuery<Genre[]>({
    queryKey: ["genres"],
    queryFn: fetchGenres,
  });

  const genreOptions = genresData?.map(g => ({ id: g.id, label: g.name })) || [];

  if (isLoading && !data)
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-purple-500 border-b-4 border-pink-500"></div>
      </div>
    );

  if (error || !data)
    return (
      <p className="text-red-500 text-center mt-10">Failed to load products</p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-purple-950 text-white p-10">
      
      {/* Glow Background Effect */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600 opacity-20 blur-3xl rounded-full"></div>

      <div className="relative max-w-7xl mx-auto">

        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-8 tracking-wide">
          🎮 Games
        </h1>

        {/* Search */}
    <div className="relative mb-6">
 <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 text-xl pointer-events-none z-10" />
  <input
    type="text"
    placeholder="Search games..."
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);
      setPage(1);
    }}
    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 backdrop-blur-md border border-purple-500/30 
    focus:outline-none focus:ring-2 focus:ring-purple-500 
    shadow-lg shadow-purple-500/20 transition-all text-white placeholder-gray-400"
  />
</div>

        {/* Filter */}
        <div className="mb-6">
          <AdvancedSelect
            options={genreOptions}
            value={genreOptions.filter(g => selectedGenres.includes(g.id))}
            onChange={(selected) => setSelectedGenres(selected.map(g => g.id))}
            placeholder="Filter by genre..."
            
          />
        </div>

        {isFetching && (
          <p className="text-sm text-purple-400 mb-4 animate-pulse">
            Updating...
          </p>
        )}

        {/* Game Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.results.map((product: Product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <div className="group relative bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:border-purple-500 hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]">
                
                {/* Image */}
                <img
                  src={product.background_image || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-56 object-cover group-hover:opacity-80 transition duration-500"
                />

                {/* Overlay Glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>

                {/* Content */}
                <div className="relative p-5">
                  <p className="font-bold text-xl text-purple-300 group-hover:text-pink-400 transition">
                    {product.name}
                  </p>
                  <p className="text-gray-400 mt-2">
                    ⭐ {product.rating}
                  </p>
                </div>

              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12 space-x-6">
          <button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={!data.previous}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              data.previous
                ? "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/40"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            Previous
          </button>

          <span className="px-6 py-3 rounded-xl bg-white/5 backdrop-blur border border-purple-500/30">
            Page {page}
          </span>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!data.next}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              data.next
                ? "bg-pink-600 hover:bg-pink-700 shadow-lg shadow-pink-500/40"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}