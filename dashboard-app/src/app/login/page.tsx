"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Input, Heading, VStack, Text } from "@chakra-ui/react";
import { login, LoginPayload } from "../services/auth.service";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginPayload>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await login(form);
      localStorage.setItem("token", res.token);
      // router.push("/users");
       router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={20} p={6} boxShadow="md" borderRadius="md">
      <VStack spacing={4}>
        <Heading size="lg">Login</Heading>
        <Input
          placeholder="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
        />
        <Input
          placeholder="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />
        {error && <Text color="red.500">{error}</Text>}
        <Button
          colorScheme="teal"
          width="full"
          onClick={handleSubmit}
          loading={loading}
        >
          Login
        </Button>
      </VStack>
    </Box>
  );
}
