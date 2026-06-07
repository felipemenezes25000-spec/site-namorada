import { leadStatusLabels, type LeadStatus } from "@/types/lead";
import { cn } from "@/lib/utils";

const styles: Record<LeadStatus, string> = {
  new: "bg-brand-mint text-brand-green-dark",
  contacted: "bg-amber-100 text-amber-800",
  scheduled: "bg-blue-100 text-blue-800",
  confirmed: "bg-brand-green/10 text-brand-green",
  attended: "bg-emerald-100 text-emerald-800",
  rescheduled: "bg-orange-100 text-orange-800",
  canceled: "bg-red-100 text-red-700",
  no_response: "bg-stone-200 text-stone-600",
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        styles[status],
      )}
    >
      {leadStatusLabels[status]}
    </span>
  );
}
