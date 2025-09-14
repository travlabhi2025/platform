import { Earnings } from "./types";

export default function EarningsSection({ earnings }: { earnings: Earnings }) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs text-slate-600">Monthly Earnings</div>
          <div className="text-2xl font-semibold mt-2">{earnings.monthly}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs text-slate-600">Payout Summary</div>
          <div className="text-2xl font-semibold mt-2">
            {earnings.payoutSummary}
          </div>
        </div>
      </div>
      <div className="mt-3">
        <button className="bg-primary text-white rounded-full px-4 py-2 text-sm font-medium">
          Withdraw Earnings
        </button>
      </div>
    </div>
  );
}
