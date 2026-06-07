"use client";

import { useActionState } from "react";
import { Lock, Loader2, AlertCircle } from "lucide-react";
import { login, type LoginState } from "@/app/admin/actions";
import { Input, Label } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { BrandSymbol } from "@/components/ui/logo";

export function AdminLogin({ configured }: { configured: boolean }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-beige/40 to-brand-bone px-5 py-24">
      <div className="w-full max-w-sm">
        <div className="surface p-8">
          <div className="flex flex-col items-center text-center">
            <BrandSymbol size={56} badge />
            <h1 className="mt-5 font-display text-2xl text-brand-green">Painel de leads</h1>
            <p className="mt-1 text-sm text-brand-ink/60">
              Acesso restrito à equipe da Dra. Ana.
            </p>
          </div>

          {!configured ? (
            <div className="mt-6 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>
                Defina a variável <code className="rounded bg-amber-100 px-1">ADMIN_PASSWORD</code>{" "}
                no arquivo <code className="rounded bg-amber-100 px-1">.env.local</code> para
                ativar o painel.
              </span>
            </div>
          ) : (
            <form action={formAction} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="password">Senha de acesso</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-brand-green/50" />
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
                <p role="alert" className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="size-4" /> {state.error}
                </p>
              )}
              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={pending}>
                {pending ? <Loader2 className="size-5 animate-spin" /> : "Entrar"}
              </Button>
            </form>
          )}
        </div>
        <p className="mt-6 text-center text-xs text-brand-ink/40">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Esqueceu a senha? Edite <code>ADMIN_PASSWORD</code> no ambiente.
        </p>
      </div>
    </div>
  );
}
