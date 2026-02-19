"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Heading,
  Input,
  SimpleGrid,
  Image,
  Text,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { fetchProducts, Product, ProductsResponse } from "../services/products.service";
import Link from "next/link";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]); // فیلتر ژانر

  const { data, isLoading, error } = useQuery<ProductsResponse>({
  queryKey: ["products", search],
  queryFn: () => fetchProducts(search),
  keepPreviousData: true,
});

console.log("Products data:", data);

  if (isLoading) return <Spinner size="xl" />;
  if (error || !data) return <Text color="red.500">Failed to load products</Text>;

  return (
    <Box p={10}>
      <Heading mb={6}>Products</Heading>

      <Input
        placeholder="Search games..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        mb={6}
      />

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {data.results.map((product: Product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <VStack
              borderWidth="1px"
              borderRadius="md"
              p={4}
              cursor="pointer"
              _hover={{ shadow: "md" }}
            >
              <Image
                src={product.background_image || "/placeholder.png"}
                alt={product.name}
                borderRadius="md"
                boxSize="200px"
                objectFit="cover"
              />
              <Text fontWeight="bold">{product.name}</Text>
              <Text>Rating: {product.rating}</Text>
            </VStack>
          </Link>
        ))}
      </SimpleGrid>
    </Box>
  );
}
