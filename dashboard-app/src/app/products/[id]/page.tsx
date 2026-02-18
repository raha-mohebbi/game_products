"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Box, Heading, Image, Text, Spinner, VStack } from "@chakra-ui/react";
import { fetchProductById, Product } from "../../services/products.service";

export default function ProductDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data, isLoading, error } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
  });

  if (isLoading) return <Spinner size="xl" />;
  if (error || !data) return <Text color="red.500">Failed to load product</Text>;

  return (
    <Box p={10}>
      <Heading mb={4}>{data.name}</Heading>
      <Image
        src={data.background_image || "/placeholder.png"}
        alt={data.name}
        borderRadius="md"
        maxH="400px"
        objectFit="cover"
        mb={4}
      />
      <Text mb={2}>Rating: {data.rating}</Text>
      <Text mb={2}>
        Genres: {data.genres.map((g) => g.name).join(", ")}
      </Text>
      <Text>
        Description not available
      </Text>
    </Box>
  );
}
