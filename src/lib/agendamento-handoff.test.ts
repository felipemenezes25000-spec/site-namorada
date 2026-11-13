/** Passagem /agendamento -> /obrigado em sessionStorage, inclusive com o armazenamento bloqueado. */
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  firstNameOf,
  markLeadFired,
  readLeadHandoff,
  saveLeadHandoff,
  treatmentForMessage,
} from "./agendamento-handoff";

function sessao(bloqueada = false) {
  const dados = new Map<string, string>();
  const falha = () => {
    throw new DOMException("bloqueado", "SecurityError");
  };
  vi.stubGlobal("window", {
    sessionStorage: bloqueada
      ? { getItem: falha, setItem: falha, removeItem: falha }
      : {
          getItem: (k: string) => dados.get(k) ?? null,
          setItem: (k: string, v: string) => dados.set(k, v),
          removeItem: (k: string) => dados.delete(k),
        },
  });
  return dados;
}

afterEach(() => vi.unstubAllGlobals());

describe("agendamento-handoff", () => {
  it("grava, lê e marca a conversão uma vez", () => {
    sessao();
    expect(saveLeadHandoff({ firstName: "Maria", treatment: "Limpeza dental" })).toBe(true);
    expect(readLeadHandoff()).toEqual({
      firstName: "Maria",
      treatment: "Limpeza dental",
      fired: false,
    });
    markLeadFired();
    expect(readLeadHandoff()?.fired).toBe(true);
  });

  it("com o armazenamento bloqueado nada lança: grava devolve false e a leitura é nula", () => {
    sessao(true);
    expect(saveLeadHandoff({ firstName: "Maria", treatment: "x" })).toBe(false);
    expect(readLeadHandoff()).toBeNull();
    expect(() => markLeadFired()).not.toThrow();
  });

  it("valor corrompido na sessão é ignorado", () => {
    const dados = sessao();
    dados.set("abl_lead_handoff", "{não é json");
    expect(readLeadHandoff()).toBeNull();
  });

  it("primeiro nome e trecho do tratamento para a mensagem", () => {
    expect(firstNameOf("  Maria   da Silva ")).toBe("Maria");
    expect(treatmentForMessage("")).toBe("uma avaliação");
    expect(treatmentForMessage(null)).toBe("uma avaliação");
  });
});
