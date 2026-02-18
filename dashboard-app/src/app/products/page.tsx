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
import { fetchProducts, Product } from "../services/products.service";
import Link from "next/link";

export default function ProductsPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery<Product[]>({
    queryKey: ["products", search],
    queryFn: () => fetchProducts(search),
    keepPreviousData: true,
  });

  return (
    <Box p={10}>
      <Heading mb={6}>Products</Heading>

      <Input
        placeholder="Search games..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        mb={6}
      />

      {isLoading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Text color="red.500">Failed to load products</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {data?.map((product) => (
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
      )}
    </Box>
  );
}
