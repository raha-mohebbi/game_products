import axios from "axios";

const API_URL = "https://dummyjson.com/auth/login";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  token: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await axios.post(
    API_URL,
    {
      ...payload,
      expiresInMins: 30,   
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  return res.data;
}
