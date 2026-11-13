/** Só a service role grava leads: URL + chave anônima NÃO conta como configurado. */
import { afterEach, describe, expect, it, vi } from "vitest";
import { getServerSupabase, isAdminDbConfigured, isSupabaseConfigured } from "./supabase";

afterEach(() => vi.unstubAllEnvs());

describe("isSupabaseConfigured", () => {
  it("URL + chave anônima apenas: não configurado (sem cliente)", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://x.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
    expect(isSupabaseConfigured()).toBe(false);
    expect(isAdminDbConfigured()).toBe(false);
    expect(getServerSupabase()).toBeNull();
  });

  it("URL + service role: configurado", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://x.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service");
    expect(isSupabaseConfigured()).toBe(true);
    expect(isAdminDbConfigured()).toBe(true);
    expect(getServerSupabase()).not.toBeNull();
  });

  it("sem URL: não configurado", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service");
    expect(isSupabaseConfigured()).toBe(false);
  });
});
