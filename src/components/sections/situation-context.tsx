"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * Situação escolhida em "O que traz você aqui hoje?" (DESIGN.md 4.5).
 * Envolve só os dois momentos da home que a usam (o seletor e o sumário de
 * tratamentos); os filhos chegam prontos do servidor. Sem escolha (`null`),
 * tudo continua funcionando igual.
 */
interface SituationState {
  situationId: string | null;
  /** Slugs dos tratamentos indicados para a situação escolhida, na ordem. */
  indicated: string[];
  set: (id: string | null, indicated?: string[]) => void;
}

const SituationContext = createContext<SituationState>({
  situationId: null,
  indicated: [],
  set: () => {},
});

export function SituationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ id: string | null; indicated: string[] }>({
    id: null,
    indicated: [],
  });
  const set = useCallback(
    (id: string | null, indicated: string[] = []) => setState({ id, indicated }),
    [],
  );
  const value = useMemo(
    () => ({ situationId: state.id, indicated: state.indicated, set }),
    [state, set],
  );
  return <SituationContext.Provider value={value}>{children}</SituationContext.Provider>;
}

export function useSituation() {
  return useContext(SituationContext);
}
