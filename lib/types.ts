export interface LLMSignal {
  text: string;
  strength: "strong" | "medium" | "weak";
}

export interface LLMMissingSignal {
  text: string;
  reason: string;
}

export interface LLMAnalysis {
  label: "eco" | "not_eco" | "uncertain";
  confidence: number;
  signals_found: LLMSignal[];
  signals_missing: LLMMissingSignal[];
  reasoning: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  llm_analysis: LLMAnalysis;
}

export interface KeywordMatch {
  keyword: string;
  tier: 1 | 2 | 3 | "negative" | "misleading";
  points: number;
  category: string;
  foundText: string;
}

export interface KeywordResult {
  rawScore: number;
  effectiveScore: number;
  matches: KeywordMatch[];
  negativeMatches: KeywordMatch[];
  misleadingMatches: KeywordMatch[];
  routingLabel: "direct_eco" | "llm_required" | "safety_net";
}

export type OverrideStatus = "eco" | "not_eco" | null;

export interface ProcessedProduct {
  product: Product;
  keywordResult: KeywordResult;
  finalSection: "A" | "B" | "C_rejected" | "C_manual";
  overrideStatus: OverrideStatus;
}
