// API Service - Centraliza todas las llamadas a la API

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8080';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  role: 'User' | 'Admin';
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserData;
}

export interface RecipeData {
  id: number;
  title: string;
  image?: string;
  time?: string;
  difficulty?: string;
  userId?: number;
  validated?: boolean;
  isQuick?: boolean;
  isHealthy?: boolean;
  hasFewIngredients?: boolean;
}

export class ApiService {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as any).message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error: ${endpoint}`, error);
      throw error;
    }
  }

  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  static async signup(data: SignUpRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async getUsers() {
    return this.request('/api/users', {
      method: 'GET',
    });
  }

  static async createRecipe(formData: FormData): Promise<{ success: boolean; message: string; recipe?: RecipeData }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/recipes/create`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as any).message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error: /api/recipes/create', error);
      throw error;
    }
  }

  static async getValidatedRecipes(): Promise<RecipeData[]> {
    return this.request<RecipeData[]>('/api/recipes/validated', {
      method: 'GET',
    });
  }

  static async getPendingRecipes(userId?: number): Promise<RecipeData[]> {
    const endpoint = userId ? `/api/recipes/pending?userId=${userId}` : '/api/recipes/pending';
    return this.request<RecipeData[]>(endpoint, {
      method: 'GET',
    });
  }

  static async getRecipesByUser(userId: number): Promise<RecipeData[]> {
    return this.request<RecipeData[]>(`/api/recipes/user/${userId}`, {
      method: 'GET',
    });
  }

  static async validateRecipe(recipeId: number, adminId: number, approved: boolean) {
    return this.request(`/api/recipes/validate?adminId=${adminId}`, {
      method: 'POST',
      body: JSON.stringify({
        recipeId,
        approved,
      }),
    });
  }

  static async getRecipeById(id: number) {
    return this.request<any>(`/api/recipes/${id}`, {
      method: 'GET',
    });
  }

  static async deleteRecipe(recipeId: number, adminId: number) {
    return this.request(`/api/recipes/${recipeId}?adminId=${adminId}`, {
      method: 'DELETE',
    });
  }
}



