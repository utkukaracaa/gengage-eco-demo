"use client";

import { useState } from "react";
import { ProcessedProduct, OverrideStatus } from "@/lib/types";
import KeywordScoreBar from "./KeywordScoreBar";
import LLMPanel from "./LLMPanel";

interface Props {
  data: ProcessedProduct;
  onOverride: (id: number, status: OverrideStatus) => void;
  showFiltered: boolean;
}

const SECTION_BADGE: Record<string, { label: string; color: string }> = {
  A: { label: "A — Keyword ECO", color: "bg-emerald-600 text-white" },
  B: { label: "B — LLM ECO", color: "bg-teal-600 text-white" },
  C_rejected: { label: "C — Rejected", color: "bg-red-600 text-white" },
  C_manual: { label: "C — Manual Check", color: "bg-amber-500 text-white" },
};

function formatPrice(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
}

export default function ProductCard({ data, onOverride, showFiltered }: Props) {
  const { product, keywordResult, finalSection, overrideStatus } = data;
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"keyword" | "llm">("keyword");
  const [descExpanded, setDescExpanded] = useState(false);

  const sectionBadge = SECTION_BADGE[finalSection];
  const isEco =
    overrideStatus === "eco" ||
    (overrideStatus === null && (finalSection === "A" || finalSection === "B"));
  const isOverridden = overrideStatus !== null;

  const llmRouted = keywordResult.routingLabel !== "direct_eco";

  return (
    <div
      className={`rounded-xl border bg-white shadow-sm transition-all duration-200 ${
        isEco ? "border-emerald-200" : finalSection === "C_manual" ? "border-amber-200" : "border-gray-200"
      }`}
    >
      {/* Card header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {showFiltered && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${sectionBadge.color}`}>
                  {sectionBadge.label}
                </span>
              )}
              {isOverridden && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-300">
                  Manuel: {overrideStatus === "eco" ? "ECO" : "NOT ECO"}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 leading-tight">{product.name}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{formatPrice(product.price)}</p>
          </div>

          {/* Eco indicator dot */}
          <div
            className={`w-4 h-4 rounded-full flex-shrink-0 mt-1 ${
              isEco ? "bg-emerald-500" : finalSection === "C_manual" ? "bg-amber-400" : "bg-red-400"
            }`}
            title={isEco ? "Eco-friendly" : "Not eco-friendly"}
          />
        </div>

        {/* Description */}
        <p className={`text-sm text-gray-600 leading-relaxed ${descExpanded ? "" : "line-clamp-2"}`}>
          {product.description}
        </p>
        <button
          onClick={() => setDescExpanded(!descExpanded)}
          className="text-xs text-blue-500 hover:underline mt-1"
        >
          {descExpanded ? "Daha az goster" : "Tamamini goster"}
        </button>

        {/* Score pill (always visible) */}
        {showFiltered && (
          <div className="flex items-center gap-2 mt-3">
            <span
              className={`px-2 py-0.5 rounded text-xs font-semibold ${
                keywordResult.effectiveScore >= 5
                  ? "bg-emerald-100 text-emerald-700"
                  : keywordResult.effectiveScore >= 1
                  ? "bg-amber-100 text-amber-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              KW: {keywordResult.rawScore < 0 ? keywordResult.rawScore : keywordResult.effectiveScore} puan
            </span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-semibold ${
                product.llm_analysis.label === "eco"
                  ? "bg-emerald-100 text-emerald-700"
                  : product.llm_analysis.label === "uncertain"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              LLM: {Math.round(product.llm_analysis.confidence * 100)}% {product.llm_analysis.label}
            </span>
          </div>
        )}
      </div>

      {/* Expand/collapse analysis */}
      {showFiltered && (
        <>
          <div className="border-t border-gray-100 px-4 py-2 flex items-center justify-between">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              {expanded ? "Analizi gizle" : "Analizi goster"}
            </button>

            {/* Manual override */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400">Override:</span>
              <button
                onClick={() => onOverride(product.id, overrideStatus === "eco" ? null : "eco")}
                className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors ${
                  overrideStatus === "eco"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                }`}
              >
                ECO
              </button>
              <button
                onClick={() => onOverride(product.id, overrideStatus === "not_eco" ? null : "not_eco")}
                className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors ${
                  overrideStatus === "not_eco"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white text-red-700 border-red-300 hover:bg-red-50"
                }`}
              >
                NOT ECO
              </button>
              {isOverridden && (
                <button
                  onClick={() => onOverride(product.id, null)}
                  className="px-2 py-0.5 rounded text-xs font-medium border bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
                >
                  Sifirla
                </button>
              )}
            </div>
          </div>

          {expanded && (
            <div className="border-t border-gray-100 px-4 pb-4">
              {/* Tabs */}
              <div className="flex gap-2 mt-3 mb-3">
                <button
                  onClick={() => setActiveTab("keyword")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    activeTab === "keyword"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Keyword Engine
                </button>
                <button
                  onClick={() => setActiveTab("llm")}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    activeTab === "llm"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  LLM Analizi
                </button>
              </div>

              {activeTab === "keyword" ? (
                <KeywordScoreBar result={keywordResult} />
              ) : (
                <LLMPanel analysis={product.llm_analysis} routed={llmRouted} />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
