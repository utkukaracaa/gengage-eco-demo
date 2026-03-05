"use client";

import { KeywordResult } from "@/lib/types";
import { THRESHOLDS } from "@/lib/keyword-engine";

interface Props {
  result: KeywordResult;
}

const TIER_COLORS: Record<string, string> = {
  certification: "bg-emerald-600",
  material: "bg-teal-500",
  process: "bg-cyan-500",
  packaging: "bg-sky-500",
  claim: "bg-blue-400",
};

const ROUTING_LABEL: Record<string, { label: string; color: string }> = {
  direct_eco: { label: "Direct ECO", color: "bg-emerald-100 text-emerald-800 border border-emerald-300" },
  llm_required: { label: "LLM Gerekli", color: "bg-amber-100 text-amber-800 border border-amber-300" },
  safety_net: { label: "Safety Net (LLM)", color: "bg-orange-100 text-orange-800 border border-orange-300" },
};

export default function KeywordScoreBar({ result }: Props) {
  const { effectiveScore, rawScore, matches, negativeMatches, misleadingMatches, routingLabel } = result;
  const routing = ROUTING_LABEL[routingLabel];
  const maxDisplay = 10;
  const barWidth = Math.min(100, (effectiveScore / maxDisplay) * 100);

  return (
    <div className="space-y-3">
      {/* Score + routing badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-800">{rawScore < 0 ? rawScore : effectiveScore}</span>
          {rawScore < 0 && (
            <span className="text-sm text-gray-400">(effective: 0)</span>
          )}
          <span className="text-sm text-gray-500">/ 10 pts</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${routing.color}`}>
          {routing.label}
        </span>
      </div>

      {/* Score bar */}
      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        {/* Threshold marker at 5 */}
        <div
          className="absolute top-0 h-full w-0.5 bg-emerald-400 z-10"
          style={{ left: `${(THRESHOLDS.directEco / maxDisplay) * 100}%` }}
          title={`Direct ECO threshold: ${THRESHOLDS.directEco}`}
        />
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${barWidth}%`,
            background:
              effectiveScore >= THRESHOLDS.directEco
                ? "#16a34a"
                : effectiveScore >= THRESHOLDS.llmRequired
                ? "#d97706"
                : "#6b7280",
          }}
        />
      </div>
      <p className="text-xs text-gray-400">Yeşil çizgi = Direct ECO eşiği ({THRESHOLDS.directEco} puan)</p>

      {/* Positive matches */}
      {matches.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Keyword Eşleşmeleri</p>
          <div className="flex flex-wrap gap-1.5">
            {matches.map((m, i) => (
              <span
                key={i}
                className={`px-2 py-0.5 rounded text-xs text-white font-medium ${
                  TIER_COLORS[m.category] ?? "bg-gray-400"
                }`}
                title={m.foundText}
              >
                {m.keyword} <span className="opacity-75">(T{m.tier}: +{m.points})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Negative matches */}
      {negativeMatches.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">Negatif Sinyaller</p>
          <div className="flex flex-wrap gap-1.5">
            {negativeMatches.map((m, i) => (
              <span key={i} className="px-2 py-0.5 rounded text-xs text-white font-medium bg-red-500" title={m.foundText}>
                {m.keyword} ({m.points})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Misleading matches */}
      {misleadingMatches.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-1">Misleading / Trap</p>
          <div className="flex flex-wrap gap-1.5">
            {misleadingMatches.map((m, i) => (
              <span key={i} className="px-2 py-0.5 rounded text-xs text-orange-700 font-medium bg-orange-100 border border-orange-200" title={m.foundText}>
                {m.keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {matches.length === 0 && negativeMatches.length === 0 && (
        <p className="text-xs text-gray-400 italic">Bilinen eco keyword bulunamadı — LLM safety net devreye girdi.</p>
      )}
    </div>
  );
}
