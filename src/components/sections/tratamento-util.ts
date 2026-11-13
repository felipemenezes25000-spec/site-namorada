/** Primeira frase do texto e o resto. "Dra." não encerra a frase. */
export function splitFirstSentence(text: string): [string, string] {
  const safe = text.replaceAll("Dra.", "Dra#");
  const m = safe.match(/^(.+?[.!?])(\s+|$)/);
  if (!m) return [text, ""];
  const back = (x: string) => x.replaceAll("Dra#", "Dra.");
  return [back(m[1]), back(safe.slice(m[0].length))];
}

/** Há alguma palavra longa (mais de 14 letras) que pede título menor para caber na coluna? */
export function temPalavraLonga(name: string): boolean {
  return name.split(" ").some((w) => w.length > 14);
}
