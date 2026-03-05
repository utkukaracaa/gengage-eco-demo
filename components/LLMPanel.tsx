"use client";

import { LLMAnalysis } from "@/lib/types";

interface Props {
  analysis: LLMAnalysis;
  routed: boolean; // false = direct_eco, LLM not called
}

const LABEL_CONFIG = {
  eco: { label: "ECO", color: "bg-emerald-100 text-emerald-800 border border-emerald-300" },
  not_eco: { label: "NOT ECO", color: "bg-red-100 text-red-700 border border-red-300" },
  uncertain: { label: "UNCERTAIN", color: "bg-amber-100 text-amber-800 border border-amber-300" },
};

const STRENGTH_COLOR = {
  strong: "text-emerald-700 bg-emerald-50 border border-emerald-200",
  medium: "text-teal-700 bg-teal-50 border border-teal-200",
  weak: "text-gray-600 bg-gray-50 border border-gray-200",
};

export default function LLMPanel({ analysis, routed }: Props) {
  const labelConfig = LABEL_CONFIG[analysis.label];
  const confidencePct = Math.round(analysis.confidence * 100);

  return (
    <div className="space-y-3">
      {!routed && (
        <div className="text-xs text-gray-400 italic bg-gray-50 rounded px-3 py-2">
          Bu ürün keyword eşiğini doğrudan geçti. LLM motoru devreye girmedi — ancak pre-processed analiz aşağıda görüntülenebilir.
        </div>
      )}

      {/* Label + Confidence */}
      <div className="flex items-center gap-3">
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${labelConfig.color}`}>
          {labelConfig.label}
        </span>
        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Eco Olasılığı</span>
            <span className="font-semibold">{confidencePct}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${confidencePct}%`,
                background:
                  analysis.confidence >= 0.75
                    ? "#16a34a"
                    : analysis.confidence >= 0.35
                    ? "#d97706"
                    : "#dc2626",
              }}
            />
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">LLM Reasoning</p>
        <p className="text-sm text-slate-700 leading-relaxed">{analysis.reasoning}</p>
      </div>

      {/* Signals found */}
      {analysis.signals_found.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Bulunan Sinyaller</p>
          <div className="space-y-1">
            {analysis.signals_found.map((s, i) => (
              <div key={i} className={`px-2 py-1.5 rounded text-xs ${STRENGTH_COLOR[s.strength]}`}>
                <span className="font-medium capitalize">[{s.strength}]</span>{" "}
                <span className="italic">"{s.text}"</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Signals missing / misleading */}
      {analysis.signals_missing.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-1.5">Eksik / Misleading</p>
          <div className="space-y-1">
            {analysis.signals_missing.map((s, i) => (
              <div key={i} className="px-2 py-1.5 rounded text-xs bg-orange-50 border border-orange-200">
                <span className="font-medium text-orange-700">"{s.text}"</span>{" "}
                <span className="text-orange-600">— {s.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
