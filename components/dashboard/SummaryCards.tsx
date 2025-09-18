import { SummaryCardData } from "./types";
import Link from "next/link";

export default function SummaryCards({ cards }: { cards: SummaryCardData[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
      {cards.map((c) => {
        const cardContent = (
          <div
            className={`bg-white border rounded-lg p-4 flex flex-col gap-2 transition-all duration-200 ${
              c.highlight
                ? "border-orange-300 bg-orange-50 hover:bg-orange-100"
                : "border-slate-200 hover:border-slate-300"
            } ${c.link ? "cursor-pointer" : ""}`}
          >
            <div
              className={`text-xs ${
                c.highlight ? "text-orange-700" : "text-slate-600"
              }`}
            >
              {c.label}
            </div>
            <div
              className={`text-2xl font-semibold ${
                c.highlight ? "text-orange-900" : "text-slate-900"
              }`}
            >
              {typeof c.value === "number" ? c.value : c.value}
            </div>
            {c.highlight && Number(c.value) > 0 && (
              <div className="text-xs text-orange-600 font-medium">
                Click to review
              </div>
            )}
          </div>
        );

        return (
          <div key={c.label}>
            {c.link ? <Link href={c.link}>{cardContent}</Link> : cardContent}
          </div>
        );
      })}
    </div>
  );
}
