"use client";

import { useActionState } from "react";
import { Lock, Loader2, AlertCircle } from "./admin-icons";
import { login, type LoginState } from "@/app/admin/actions";
import type { AdminStatus } from "@/lib/admin-auth";
import { Input, Label, Button, BrandSymbol } from "./admin-ui";

const DISABLED_MESSAGE: Record<Exclude<AdminStatus, "ok">, string[]> = {
  missing_password: ["ADMIN_PASSWORD", "ADMIN_SESSION_SECRET"],
  missing_secret: ["ADMIN_SESSION_SECRET"],
  weak_secret: ["ADMIN_SESSION_SECRET"],
  weak_password: ["ADMIN_PASSWORD"],
};

const DISABLED_HINT: Record<Exclude<AdminStatus, "ok">, string> = {
  missing_password: "Faltam variáveis de ambiente no servidor. ",
  missing_secret: "Faltam variáveis de ambiente no servidor. ",
  weak_secret: "O segredo de sessão precisa ter pelo menos 32 caracteres. ",
  weak_password: "A senha precisa ter pelo menos 12 caracteres. ",
};

/**
 * `detail` só é verdadeiro em desenvolvimento: em produção a tela pública não
 * revela nomes de variáveis nem o que falta (o motivo vai para o log do servidor).
 */
export function AdminLogin({ status, detail = false }: { status: AdminStatus; detail?: boolean }) {
  const configured = status === "ok";
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-beige/40 to-brand-bone px-5 py-24">
      <div className="w-full max-w-sm">
        <div className="surface p-8">
          <div className="flex flex-col items-center text-center">
            <BrandSymbol size={56} badge />
            <h1 className="mt-5 font-display text-2xl text-brand-green">Painel de leads</h1>
            <p className="mt-1 text-sm text-brand-ink/75">
              Acesso restrito à equipe da Dra. Ana.
            </p>
          </div>

          {!configured ? (
            <div className="mt-6 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>
                {detail ? (
                  <>
                    <strong className="font-semibold">Painel desativado.</strong>{" "}
                    {DISABLED_HINT[status]}
                    Defina{" "}
                    {DISABLED_MESSAGE[status].map((name, i) => (
                      <span key={name}>
                        {i > 0 && " e "}
                        <code className="rounded bg-amber-100 px-1">{name}</code>
                      </span>
                    ))}{" "}
                    no ambiente e publique de novo para ativar o painel.
                  </>
                ) : (
                  <>
                    <strong className="font-semibold">Painel indisponível.</strong> Tente novamente mais tarde.
                  </>
                )}
              </span>
            </div>
          ) : (
            <form action={formAction} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="password">Senha de acesso</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-brand-green/70" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="pl-11"
                  />
                </div>
              </div>
              {state?.error && (
                <p role="alert" className="flex items-center gap-2 text-sm text-red-700">
                  <AlertCircle className="size-4" /> {state.error}
                </p>
              )}
              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={pending}>
                {pending ? <Loader2 className="size-5 animate-spin" /> : "Entrar"}
              </Button>
            </form>
          )}
        </div>
        {detail && (
          <p className="mt-6 text-center text-xs text-brand-ink/75">
            Trocar <code>ADMIN_PASSWORD</code> no ambiente encerra as sessões abertas.
          </p>
        )}
      </div>
    </main>
  );
}
