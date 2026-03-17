import { describe, it, expect, vi, beforeEach } from "vitest";
import { jwtVerify } from "jose";

vi.mock("server-only", () => ({}));

const mockCookieStore = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
};

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve(mockCookieStore)),
}));

const { createSession } = await import("@/lib/auth");

const JWT_SECRET = new TextEncoder().encode("development-secret-key");

describe("createSession", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sets the auth-token cookie", async () => {
    await createSession("user-1", "test@example.com");

    expect(mockCookieStore.set).toHaveBeenCalledOnce();
    const [name] = mockCookieStore.set.mock.calls[0];
    expect(name).toBe("auth-token");
  });

  it("sets correct cookie options", async () => {
    await createSession("user-1", "test@example.com");

    const [, , options] = mockCookieStore.set.mock.calls[0];
    expect(options.httpOnly).toBe(true);
    expect(options.sameSite).toBe("lax");
    expect(options.path).toBe("/");
    expect(options.secure).toBe(false); // not production in test env
    expect(options.expires).toBeInstanceOf(Date);
  });

  it("token expires approximately 7 days from now", async () => {
    await createSession("user-1", "test@example.com");

    const [, , options] = mockCookieStore.set.mock.calls[0];
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const diff = options.expires.getTime() - Date.now();
    expect(diff).toBeGreaterThan(sevenDaysMs - 5000);
    expect(diff).toBeLessThanOrEqual(sevenDaysMs);
  });

  it("JWT payload contains userId and email", async () => {
    let capturedToken = "";
    mockCookieStore.set.mockImplementation((_name: string, token: string) => {
      capturedToken = token;
    });

    await createSession("user-1", "test@example.com");

    const { payload } = await jwtVerify(capturedToken, JWT_SECRET);
    expect(payload.userId).toBe("user-1");
    expect(payload.email).toBe("test@example.com");
  });

  it("JWT is signed with HS256", async () => {
    let capturedToken = "";
    mockCookieStore.set.mockImplementation((_name: string, token: string) => {
      capturedToken = token;
    });

    await createSession("user-1", "test@example.com");

    const header = JSON.parse(atob(capturedToken.split(".")[0]));
    expect(header.alg).toBe("HS256");
  });
});
