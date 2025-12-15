import { apiFetch, setTokenGetter, API_BASE_URL } from "../lib/api/client";

describe("apiFetch", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    // Default base URL
    process.env.NEXT_PUBLIC_API_BASE_URL = API_BASE_URL;
    // Clear token getter
    setTokenGetter(() => undefined);
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it("adds default headers and parses JSON response", async () => {
    const data = { ok: true };
    const fetchMock = (((global as any).fetch = jest.fn()) as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: (k: string) => (k.toLowerCase() === "content-type" ? "application/json" : null) },
      text: async () => JSON.stringify(data),
    });

    const result = await apiFetch<{ ok: boolean }>("/test", { method: "GET" });

    expect(result).toEqual(data);
    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE_URL}/test`,
      expect.objectContaining({
        method: "GET",
        cache: "no-store",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("merges custom headers into request", async () => {
    ((global as any).fetch = jest.fn()).mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => "text/plain" },
      text: async () => "hello",
    });

    await apiFetch<string>("/headers", {
      method: "POST",
      headers: { "X-Custom": "42" },
    });

    const call = (global.fetch as jest.Mock).mock.calls[0];
    const options = call[1];
    const headers = options.headers as Record<string, string>;
    expect(headers["Content-Type"]).toBe("application/json");
    // Keys provided via RequestInit headers are normalized to lowercase by Headers
    expect(headers["x-custom"]).toBe("42");
  });

  it("adds API key header when configured", async () => {
    process.env.NEXT_PUBLIC_API_KEY = "secret";
    ((global as any).fetch = jest.fn()).mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => "text/plain" },
      text: async () => "ok",
    });

    // Re-import module to capture updated env constant
    await new Promise<void>((resolve, reject) => {
      try {
        jest.isolateModules(async () => {
          const mod = require("../lib/api/client");
          const apiFetchFresh = mod.apiFetch as (p: string, i?: RequestInit) => Promise<string>;
          const base = mod.API_BASE_URL as string;
          await apiFetchFresh("/key");
          const headers = (global.fetch as jest.Mock).mock.calls[0][1].headers as Record<string, string>;
          expect(headers["X-API-Key"]).toBe("secret");
          expect((global.fetch as jest.Mock).mock.calls[0][0]).toBe(`${base}/key`);
          resolve();
        });
      } catch (e) {
        reject(e);
      }
    });
  });

  it("adds Authorization header when token getter returns a token", async () => {
    setTokenGetter(() => "token-123");
    ((global as any).fetch = jest.fn()).mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => "text/plain" },
      text: async () => "ok",
    });

    await apiFetch<string>("/auth");

    const headers = (global.fetch as jest.Mock).mock.calls[0][1].headers as Record<string, string>;
    expect(headers["Authorization"]).toBe("Bearer token-123");
  });

  it("returns undefined on 204 No Content", async () => {
    ((global as any).fetch = jest.fn()).mockResolvedValue({
      ok: true,
      status: 204,
      headers: { get: () => null },
      text: async () => "",
    });

    const result = await apiFetch<void>("/no-content");
    expect(result).toBeUndefined();
  });

  it("throws on non-ok responses with status and body", async () => {
    ((global as any).fetch = jest.fn()).mockResolvedValue({
      ok: false,
      status: 500,
      headers: { get: () => "text/plain" },
      text: async () => "server error",
    });

    await expect(apiFetch("/error")).rejects.toThrow(
      /Request failed with status 500 at \/error: server error/,
    );
  });

  it("returns text when content-type is not JSON", async () => {
    ((global as any).fetch = jest.fn()).mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => "text/plain" },
      text: async () => "plain text",
    });

    const result = await apiFetch<string>("/text");
    expect(result).toBe("plain text");
  });
});
