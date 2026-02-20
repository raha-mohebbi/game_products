"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { fetchProductById, Product } from "../../services/products.service";

export default function ProductDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data, isLoading, error } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-purple-500 border-b-4 border-pink-500"></div>
      </div>
    );

  if (error || !data)
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <p className="text-red-500 text-xl">Failed to load product</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-purple-950 text-white p-10 relative">

      {/* Glow Background Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600 opacity-20 blur-3xl rounded-full"></div>

      <div className="relative max-w-5xl mx-auto">

        {/* Title */}
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-8 tracking-wide">
          {data.name}
        </h1>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.3)]">

          {/* Image */}
          <div className="relative group">
            <img
              src={data.background_image || "/placeholder.png"}
              alt={data.name}
              className="w-full max-h-[500px] object-cover group-hover:scale-105 transition duration-700"
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-4">

            <p className="text-xl text-purple-300">
              ⭐ Rating: <span className="text-white">{data.rating}</span>
            </p>

            <p className="text-lg text-pink-400">
              🎮 Genres:
              <span className="text-white ml-2">
                {data.genres.map((g) => g.name).join(", ")}
              </span>
            </p>

            <div className="mt-6 p-6 bg-black/40 rounded-2xl border border-purple-500/20">
              <p className="text-gray-300 leading-relaxed">
                Description not available
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}