/**
 * Passagem de dados entre /agendamento e /obrigado SEM dado pessoal na URL.
 *
 * O formulário grava o primeiro nome e o tratamento em sessionStorage (só desta aba, some ao
 * fechá-la). /obrigado lê no cliente: com isso mostra "Recebemos seu pedido, {nome}" e personaliza a mensagem do
 * WhatsApp. Também guarda a marca `fired`, que garante UMA conversão (`lead_created`) por lead:
 * recarregar /obrigado não dispara de novo, e abrir /obrigado sem ter enviado o formulário não conta.
 *
 * Tudo em try/catch: em janela privada ou com dados bloqueados o storage pode lançar erro.
 */

const KEY = "abl_lead_handoff";

export interface LeadHandoff {
  firstName: string;
  treatment: string;
  /** `lead_created` já foi enviado para este lead. */
  fired: boolean;
}

export function firstNameOf(fullName: string): string {
  return fullName.trim().split(/\s+/)[0]?.slice(0, 40) ?? "";
}

/** Grava os dados do lead recém-enviado. Devolve false se o storage não está disponível. */
export function saveLeadHandoff(data: { firstName: string; treatment: string }): boolean {
  try {
    const value: LeadHandoff = {
      firstName: data.firstName,
      treatment: data.treatment,
      fired: false,
    };
    window.sessionStorage.setItem(KEY, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function readLeadHandoff(): LeadHandoff | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<LeadHandoff> | null;
    if (!v || typeof v !== "object") return null;
    return {
      firstName: typeof v.firstName === "string" ? v.firstName.slice(0, 40) : "",
      treatment: typeof v.treatment === "string" ? v.treatment.slice(0, 120) : "",
      fired: v.fired === true,
    };
  } catch {
    return null;
  }
}

/** Marca a conversão como enviada (síncrono: vale já para a segunda execução do efeito em dev). */
export function markLeadFired(): void {
  try {
    const current = readLeadHandoff();
    if (!current) return;
    window.sessionStorage.setItem(KEY, JSON.stringify({ ...current, fired: true }));
  } catch {
    /* sem storage: nada a marcar */
  }
}

/**
 * Trecho do tratamento para a frase "... tenho interesse em {trecho}." da mensagem de WhatsApp
 * (`waMessages.fromForm`). Nomes de tratamento vão em minúscula no meio da frase; "Avaliação
 * odontológica" e "Ainda não tenho certeza" têm frase própria. Sem valor, usa "uma avaliação".
 */
export function treatmentForMessage(treatment: string | undefined | null): string {
  const t = (treatment ?? "").trim();
  if (!t) return "uma avaliação";
  if (t === "Avaliação odontológica") return "uma avaliação odontológica";
  if (t === "Ainda não tenho certeza") return "conhecer as opções de tratamento";
  return t.charAt(0).toLowerCase() + t.slice(1);
}
