"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Box, Heading, Spinner, Text } from "@chakra-ui/react";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export default function UsersPage() {
  const { data, isLoading, error } = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get("https://dummyjson.com/users");
      return res.data.users;
    },
  });

  if (isLoading)
    return (
      <Box p={10}>
        <Spinner />
      </Box>
    );

  if (error)
    return (
      <Box p={10}>
        <Text color="red.500">{error.message}</Text>
      </Box>
    );

  return (
    <Box p={10}>
      <Heading mb={6}>Users</Heading>

      <Box overflowX="auto">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid gray", padding: "8px" }}>ID</th>
              <th style={{ border: "1px solid gray", padding: "8px" }}>Username</th>
              <th style={{ border: "1px solid gray", padding: "8px" }}>First Name</th>
              <th style={{ border: "1px solid gray", padding: "8px" }}>Last Name</th>
              <th style={{ border: "1px solid gray", padding: "8px" }}>Email</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((user) => (
              <tr key={user.id}>
                <td style={{ border: "1px solid gray", padding: "8px" }}>{user.id}</td>
                <td style={{ border: "1px solid gray", padding: "8px" }}>{user.username}</td>
                <td style={{ border: "1px solid gray", padding: "8px" }}>{user.firstName}</td>
                <td style={{ border: "1px solid gray", padding: "8px" }}>{user.lastName}</td>
                <td style={{ border: "1px solid gray", padding: "8px" }}>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
}
