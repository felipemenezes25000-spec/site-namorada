import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

/**
 * Marca (DESIGN.md 4.3). Vetores em /public/brand (SVG sem selo quadrado).
 * SVG não passa por next/image: <img> simples, com largura e altura declaradas.
 */
type Tone = "escuro" | "claro";

/**
 * Só as letras AB: tamanhos pequenos (<= 64px), como no cabeçalho.
 * `lazy` para o que não está na primeira dobra (marca d'água do rodapé, logotipo repetido no menu):
 * o navegador só baixa se a imagem for exibida, e com prioridade baixa.
 */
export function Monogram({
  size = 32,
  tone = "escuro",
  className,
  alt = "",
  lazy = false,
}: {
  size?: number;
  tone?: Tone;
  className?: string;
  /** Vazio quando há texto ao lado (decorativo). */
  alt?: string;
  lazy?: boolean;
}) {
  return (
    <img
      src={tone === "claro" ? "/brand/monograma-claro.svg" : "/brand/monograma.svg"}
      width={size}
      height={size}
      alt={alt}
      className={cn("block shrink-0", className)}
      decoding="async"
      loading={lazy ? "lazy" : undefined}
      fetchPriority={lazy ? "low" : undefined}
    />
  );
}

/** Símbolo completo (AB + mandíbula em linha). Só em tamanhos >= 96px. */
export function Symbol({
  size = 160,
  tone = "escuro",
  decorative = false,
  className,
  alt = "Símbolo da Dra. Ana Beatriz Lemos Souza",
  lazy = true,
}: {
  size?: number;
  tone?: Tone;
  /** Marca d'água: opacidade .07 e escondido de leitores de tela. */
  decorative?: boolean;
  className?: string;
  alt?: string;
  /** O símbolo grande nunca está na primeira dobra: lazy e prioridade baixa por padrão. */
  lazy?: boolean;
}) {
  // proporção do arquivo: 863 x 701
  const height = Math.round((size * 701) / 863);
  return (
    <img
      src={tone === "claro" ? "/brand/simbolo-claro.svg" : "/brand/simbolo.svg"}
      width={size}
      height={height}
      alt={decorative ? "" : alt}
      aria-hidden={decorative || undefined}
      className={cn("block max-w-none", decorative && "pointer-events-none select-none opacity-[0.07]", className)}
      decoding="async"
      loading={lazy ? "lazy" : undefined}
      fetchPriority={lazy ? "low" : undefined}
    />
  );
}

/** Lockup do cabeçalho: monograma + nome em Bodoni + "Cirurgiã-dentista". */
/**
 * O nome acessível vem do texto visível (WCAG 2.5.3): "Dra. Ana Beatriz [Lemos Souza] Cirurgiã-dentista".
 * O sobrenome aparece só quando cabe (.brand-sobrenome); para quem usa leitor de tela ele está sempre lá,
 * e ", página inicial" fecha o nome sem aria-label.
 */
export function Logo({
  tone = "escuro",
  className,
  onNavigate,
  lazy = false,
}: {
  tone?: Tone;
  className?: string;
  onNavigate?: () => void;
  /** Cópia fora da primeira dobra (menu): imagem lazy. */
  lazy?: boolean;
}) {
  const sobrenome = siteConfig.doctorName.replace(siteConfig.doctorFirstName, "").trim();
  return (
    <Link href="/" className={cn("brand", className)} onClick={onNavigate}>
      <Monogram size={32} tone={tone} lazy={lazy} />
      <span className="min-w-0">
        <span className="brand-nome">
          {siteConfig.doctorFirstName}
          <span className="brand-sobrenome"> {sobrenome}</span>
          <span className="sr-only brand-sobrenome-sr"> {sobrenome}</span>
        </span>
        <span className="brand-sub">Cirurgiã-dentista</span>
        <span className="sr-only">, página inicial</span>
      </span>
    </Link>
  );
}
