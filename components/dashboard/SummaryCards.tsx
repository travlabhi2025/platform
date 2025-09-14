import { SummaryCardData } from "./types";

export default function SummaryCards({ cards }: { cards: SummaryCardData[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col gap-2"
        >
          <div className="text-xs text-slate-600">{c.label}</div>
          <div className="text-2xl font-semibold text-slate-900">
            {typeof c.value === "number" ? c.value : c.value}
          </div>
        </div>
      ))}
    </div>
  );
}
