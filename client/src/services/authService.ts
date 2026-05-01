import type { AuthResponse, SignupRequest } from "@/types/auth.types";
import api from "./api";
import type { ApiResponse } from "@/types";

export const signup = async (data: SignupRequest) => {
  const response = await api.post<ApiResponse<AuthResponse>>(
    "/auth/signup",
    data,
  );
  return response.data;
};
