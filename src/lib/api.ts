import { API_BASE_URL } from "@/config";

const TOKEN_KEY = "project-razor-token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error("Unable to reach the server. Please try again.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

// Auth
export interface UserData {
  id: string;
  email: string;
  display_name: string | null;
  current_streak: number;
  longest_streak: number;
  total_xp: number;
}

interface AuthResponse {
  token: string;
  user: UserData;
}

interface MeResponse {
  user: UserData;
}

export async function signup(
  email: string,
  password: string,
  display_name: string
): Promise<AuthResponse> {
  const data = await request<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, display_name }),
  });
  setToken(data.token);
  return data;
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const data = await request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data;
}

export async function getMe(): Promise<UserData> {
  const data = await request<MeResponse>("/auth/me");
  return data.user;
}

export function logout(): void {
  clearToken();
}

// Progress
export interface ProgressEntry {
  lesson_id: string;
  module_id: number;
  score: number;
  completed_at: string;
}

interface CompleteResponse {
  current_streak: number;
  longest_streak: number;
  total_xp: number;
  xp_gained: number;
}

export async function completeLesson(
  lesson_id: string,
  module_id: number,
  score: number
): Promise<CompleteResponse> {
  return request<CompleteResponse>("/progress/complete", {
    method: "POST",
    body: JSON.stringify({ lesson_id, module_id, score }),
  });
}

export async function getProgress(): Promise<ProgressEntry[]> {
  return request<ProgressEntry[]>("/progress");
}

// User stats
export interface UserStats {
  current_streak: number;
  longest_streak: number;
  total_xp: number;
  lessons_completed: number;
  display_name: string | null;
  email: string;
}

export async function getUserStats(): Promise<UserStats> {
  return request<UserStats>("/user/stats");
}
