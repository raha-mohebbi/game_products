"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
}

export default function DashboardPage() {
  const { data: users, isLoading: loadingUsers, error: errorUsers } = useQuery<
    User[],
    Error
  >({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get("https://dummyjson.com/users");
      return res.data.users;
    },
  });

  const {
    data: products,
    isLoading: loadingProducts,
    error: errorProducts,
  } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("https://dummyjson.com/products");
      return res.data.products;
    },
  });

  if (loadingUsers || loadingProducts)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
      </div>
    );

  if (errorUsers || errorProducts)
    return (
      <div className="p-10">
        <p className="text-red-500 text-lg">
          {errorUsers?.message || errorProducts?.message || "Error fetching data"}
        </p>
      </div>
    );

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Users */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Users ({users?.length})
          </h2>
          <div className="space-y-2">
            {users?.slice(0, 5).map((user) => (
              <p key={user.id} className="text-gray-700">
                {user.firstName} {user.lastName} ({user.username})
              </p>
            ))}
            {users && users.length > 5 && (
              <p className="text-gray-500 italic">...and more</p>
            )}
          </div>
        </div>

        {/* Products */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Products ({products?.length})
          </h2>
          <div className="space-y-2">
            {products?.slice(0, 5).map((p) => (
              <p key={p.id} className="text-gray-700">
                {p.title} - ${p.price}
              </p>
            ))}
            {products && products.length > 5 && (
              <p className="text-gray-500 italic">...and more</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}