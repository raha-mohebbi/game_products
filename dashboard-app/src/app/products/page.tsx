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
    Button,
  HStack,
} from "@chakra-ui/react";
import { fetchProducts, Product, ProductsResponse } from "../services/products.service";
import Link from "next/link";
import AdvancedSelect from "../../components/AdvancedSelect";


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
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]); // فیلتر ژانر
 const [page, setPage] = useState(1);

const { data, isLoading, isFetching, error } = useQuery<ProductsResponse>({
  queryKey: ["products", search, selectedGenres, page],
  queryFn: () => fetchProducts(search, selectedGenres, page),
  keepPreviousData: true,
  
});

  // fetch genres for AdvancedSelect
  const { data: genresData } = useQuery<Genre[]>({
    queryKey: ["genres"],
    queryFn: fetchGenres,
  });

 const genreOptions = genresData?.map(g => ({ id: g.id, label: g.name })) || [];


  if (isLoading && !data)
  return (
    <Box textAlign="center" mt={10}>
      <Spinner size="xl" />
    </Box>
  );
    
    if (error || !data)
    return (
      <Text color="red.500" textAlign="center">
        Failed to load products
      </Text>
    );

  return (
    <Box p={10}>
      <Heading mb={6}>Products</Heading>

      <Input
        placeholder="Search games..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); 
        }}
        mb={6}
      />

 {/* AdvancedSelect for genre filtering */}
      <AdvancedSelect
        options={genreOptions}
        value={genreOptions.filter(g => selectedGenres.includes(g.id))}
        onChange={(selected) => setSelectedGenres(selected.map(g => g.id))}
        placeholder="Filter by genre..."
      />

{isFetching && (
  <Text fontSize="sm" color="gray.500" mb={4}>
    Updating...
  </Text>
)}

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
         {/* Pagination */}
      <HStack justify="center" mt={8} spacing={4}>
        <Button
          onClick={() => setPage((prev) => prev - 1)}
          isDisabled={!data.previous}
        >
          Previous
        </Button>

        <Text>Page {page}</Text>

        <Button
          onClick={() => setPage((prev) => prev + 1)}
          isDisabled={!data.next}
        >
          Next
        </Button>
      </HStack>
    </Box>
  );
}
