import { TOKEN_KEY } from "@/services/api";
import {
  signup as signupService,
  login as loginService,
  getProfile as getProfileService,
  updateProfile as updateProfileService,
} from "@/services/authService";
import type { AuthState } from "@/types/auth.types";
import type { AxiosError } from "axios";
import { create } from "zustand";

interface AuthStore extends AuthState {
  signup: (name: string, email: string, password: string) => Promise<boolean>;

  login: (email: string, password: string) => Promise<void>;

  getProfile: () => Promise<void>;

  updateProfile: (data: {
    name?: string;
    email?: string;
    password?: string;
  }) => Promise<void>;

  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: localStorage.getItem(TOKEN_KEY) || null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  signup: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await signupService({ name, email, password });

      if (response.data) {
        const { user } = response.data;
        set({
          user,
          isLoading: false,
        });
        return true;
      }

      return false;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;

      set({
        error: err.response?.data?.error,
        isLoading: false,
        isAuthenticated: false,
      });

      return false;
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await loginService({ email, password });

      if (response.data) {
        const { user, token } = response.data;

        localStorage.setItem(TOKEN_KEY, token);

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;

      set({
        error: err.response?.data?.error,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  },

  getProfile: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await getProfileService();

      if (response.data) {
        set({
          user: response.data,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;

      set({
        error: err.response?.data?.error,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  },

  updateProfile: async (data: {
    name?: string;
    email?: string;
    password?: string;
  }) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await updateProfileService(data);

      if (response.data) {
        set({
          user: response.data,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;

      set({
        error: err.response?.data?.error,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },
}));
