import {
  ClipboardCheck,
  Sparkles,
  Sun,
  Layers,
  ShieldCheck,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import type { TreatmentIcon as IconKey } from "@/lib/treatments";

const map: Record<IconKey, LucideIcon> = {
  evaluation: ClipboardCheck,
  cleaning: Sparkles,
  whitening: Sun,
  restoration: Layers,
  prevention: ShieldCheck,
  surgery: Stethoscope,
};

export function TreatmentIcon({
  name,
  className,
}: {
  name: IconKey;
  className?: string;
}) {
  const Icon = map[name] ?? ClipboardCheck;
  return <Icon className={className} strokeWidth={1.4} aria-hidden="true" />;
}
