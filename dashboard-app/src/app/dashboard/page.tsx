"use client";

import {
  Box,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
  Card as CardComponent,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";
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
      <Box p={10}>
        <Spinner size="xl" />
      </Box>
    );

  if (errorUsers || errorProducts)
    return (
      <Box p={10}>
        <Text color="red.500">
          {errorUsers?.message || errorProducts?.message || "Error fetching data"}
        </Text>
      </Box>
    );

  return (
    <Box p={10}>
      <Heading mb={6}>Dashboard</Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {/* users */}
        <CardComponent.Root>
          <CardHeader>
            <Heading size="md">Users ({users?.length})</Heading>
          </CardHeader>
          <CardBody>
            {users?.slice(0, 5).map((user) => (
              <Text key={user.id}>
                {user.firstName} {user.lastName} ({user.username})
              </Text>
            ))}
            {users && users.length > 5 && <Text>...and more</Text>}
          </CardBody>
        </CardComponent.Root>

        {/* products */}
        <CardComponent.Root>
          <CardHeader>
            <Heading size="md">Products ({products?.length})</Heading>
          </CardHeader>
          <CardBody>
            {products?.slice(0, 5).map((p) => (
              <Text key={p.id}>
                {p.title} - ${p.price}
              </Text>
            ))}
            {products && products.length > 5 && <Text>...and more</Text>}
          </CardBody>
        </CardComponent.Root>
      </SimpleGrid>
    </Box>
  );
}
