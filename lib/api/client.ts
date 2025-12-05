export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

let getAuthToken: (() => string | undefined) | null = null;

export function setTokenGetter(getter: () => string | undefined) {
  getAuthToken = getter;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (init?.headers) {
    const existingHeaders = new Headers(init.headers);
    existingHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  }

  if (API_KEY) {
    headers["X-API-Key"] = API_KEY;
  }

  if (getAuthToken) {
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Request failed with status ${response.status} at ${path}: ${text}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return JSON.parse(text) as T;
}
