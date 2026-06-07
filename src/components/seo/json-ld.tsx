/**
 * Injeta dados estruturados JSON-LD de forma segura.
 * Renderizado no servidor; não envia nada para o cliente além do <script>.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  // Escapa "<" para neutralizar </script> e <!-- (hardening XSS), sem afetar o JSON-LD.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      // O conteúdo é gerado internamente (sem entrada do usuário).
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
