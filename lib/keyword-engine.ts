import { KeywordMatch, KeywordResult } from "./types";

// ---------------------------------------------------------------------------
// KEYWORD DEFINITIONS
// ---------------------------------------------------------------------------

const TIER1_KEYWORDS: { keyword: string; category: string }[] = [
  { keyword: "FSC", category: "certification" },
  { keyword: "PEFC", category: "certification" },
  { keyword: "GOTS", category: "certification" },
  { keyword: "OEKO-TEX Standard 100", category: "certification" },
  { keyword: "OEKO-TEX Made in Green", category: "certification" },
  { keyword: "OEKO-TEX", category: "certification" },
  { keyword: "GRS", category: "certification" },
  { keyword: "Fairtrade", category: "certification" },
  { keyword: "Rainforest Alliance", category: "certification" },
  { keyword: "Cradle to Cradle", category: "certification" },
  { keyword: "Bluesign", category: "certification" },
  { keyword: "GREENGUARD Gold", category: "certification" },
  { keyword: "GREENGUARD", category: "certification" },
  { keyword: "LEED", category: "certification" },
  { keyword: "karbon nötr", category: "certification" },
  { keyword: "carbon neutral", category: "certification" },
  { keyword: "karbon negatif", category: "certification" },
  { keyword: "EU Ecolabel", category: "certification" },
  { keyword: "Nordic Swan", category: "certification" },
  { keyword: "Blue Angel", category: "certification" },
];

const TIER2_KEYWORDS: { keyword: string; category: string }[] = [
  { keyword: "geri dönüştürülmüş", category: "material" },
  { keyword: "recycled", category: "material" },
  { keyword: "post-consumer", category: "material" },
  { keyword: "post-industrial", category: "material" },
  { keyword: "reclaimed", category: "material" },
  { keyword: "salvaged", category: "material" },
  { keyword: "upcycled", category: "material" },
  { keyword: "yeniden kazanılmış", category: "material" },
  { keyword: "ocean-recovered", category: "material" },
  { keyword: "denizden toplanan", category: "material" },
  { keyword: "organik lateks", category: "material" },
  { keyword: "organic latex", category: "material" },
  { keyword: "natural latex", category: "material" },
  { keyword: "doğal lateks", category: "material" },
  { keyword: "VOC-free", category: "process" },
  { keyword: "VOC içermeyen", category: "process" },
  { keyword: "VOC emisyonu sıfır", category: "process" },
  { keyword: "solvent-free", category: "process" },
  { keyword: "solvent içermeyen", category: "process" },
  { keyword: "su bazlı boya", category: "process" },
  { keyword: "water-based", category: "process" },
  { keyword: "formaldehit içermeyen", category: "process" },
  { keyword: "formaldehyde-free", category: "process" },
  { keyword: "E0 sınıfı", category: "process" },
  { keyword: "bambu", category: "material" },
  { keyword: "bamboo", category: "material" },
  { keyword: "mantar", category: "material" },
  { keyword: "cork", category: "material" },
  { keyword: "jüt", category: "material" },
  { keyword: "jute", category: "material" },
  { keyword: "organik keten", category: "material" },
  { keyword: "organic linen", category: "material" },
  { keyword: "biyobozunur", category: "material" },
  { keyword: "biodegradable", category: "material" },
  { keyword: "geri dönüştürülmüş ambalaj", category: "packaging" },
  { keyword: "FSC karton", category: "packaging" },
];

const TIER3_KEYWORDS: { keyword: string; category: string }[] = [
  { keyword: "sürdürülebilir", category: "claim" },
  { keyword: "sustainable", category: "claim" },
  { keyword: "doğal malzeme", category: "material" },
  { keyword: "natural material", category: "material" },
  { keyword: "masif ahşap", category: "material" },
  { keyword: "keten", category: "material" },
  { keyword: "pamuk", category: "material" },
  { keyword: "yün", category: "material" },
  { keyword: "yerel üretim", category: "process" },
  { keyword: "locally made", category: "process" },
  { keyword: "el yapımı", category: "process" },
  { keyword: "handcrafted", category: "process" },
  { keyword: "handmade", category: "process" },
  { keyword: "minimal ambalaj", category: "packaging" },
  { keyword: "az plastik", category: "packaging" },
  { keyword: "çevre dostu", category: "claim" },
  { keyword: "ekolojik", category: "claim" },
];

const NEGATIVE_KEYWORDS: { keyword: string; category: string }[] = [
  { keyword: "polipropilen", category: "material_negative" },
  { keyword: "polypropylene", category: "material_negative" },
  { keyword: "PP malzeme", category: "material_negative" },
  { keyword: "PVC", category: "material_negative" },
  { keyword: "vinil", category: "material_negative" },
  { keyword: "vinyl", category: "material_negative" },
  { keyword: "poliüretan köpük", category: "material_negative" },
  { keyword: "polyurethane foam", category: "material_negative" },
  { keyword: "sünger dolgu", category: "material_negative" },
  { keyword: "solvent bazlı", category: "process_negative" },
  { keyword: "solvent kaplama", category: "process_negative" },
  { keyword: "virgin plastic", category: "material_negative" },
  { keyword: "birincil plastik", category: "material_negative" },
  { keyword: "melamin kaplama", category: "material_negative" },
  { keyword: "MDF", category: "material_negative" },
];

const MISLEADING_KEYWORDS: { keyword: string; reason: string }[] = [
  { keyword: "BPA-free", reason: "Güvenlik standardı — çevre performansı değil" },
  { keyword: "BPA içermeyen", reason: "Güvenlik standardı — çevre performansı değil" },
  { keyword: "vintage", reason: "Estetik tanım — eco kanıtı değil" },
  { keyword: "retro", reason: "Estetik tanım — eco kanıtı değil" },
  { keyword: "nostaljik", reason: "Estetik tanım — eco kanıtı değil" },
  { keyword: "doğal görünüm", reason: "Görsel tanım — eco kanıtı değil" },
  { keyword: "natural look", reason: "Görsel tanım — eco kanıtı değil" },
  { keyword: "ahşap görünümlü", reason: "Görsel tanım — taklidi malzeme" },
  { keyword: "doğal desen", reason: "Görsel tanım — eco kanıtı değil" },
  { keyword: "orman teması", reason: "Estetik tanım — eco kanıtı değil" },
  { keyword: "orman deseni", reason: "Estetik tanım — eco kanıtı değil" },
  { keyword: "eco-style", reason: "Sertifikasız estetik iddia" },
  { keyword: "eco-look", reason: "Sertifikasız estetik iddia" },
  { keyword: "eco-design", reason: "Sertifikasız estetik iddia" },
  { keyword: "yeşil renk", reason: "Renk tanımı — eco kanıtı değil" },
  { keyword: "organik formlar", reason: "Tasarım dili — eco kanıtı değil" },
  { keyword: "organic shapes", reason: "Tasarım dili — eco kanıtı değil" },
  { keyword: "doğadan ilham alan", reason: "Tasarım dili — eco kanıtı değil" },
  { keyword: "nature-inspired", reason: "Tasarım dili — eco kanıtı değil" },
  { keyword: "çevreci marka", reason: "Şirket ideolojisi — ürün kanıtı değil" },
  { keyword: "sürdürülebilir yaşam tarzı", reason: "Yaşam tarzı iddiası — ürün özelliği değil" },
  { keyword: "premium kalite", reason: "Pazarlama ifadesi — eco kanıtı değil" },
  { keyword: "luxury", reason: "Pazarlama ifadesi — eco kanıtı değil" },
  { keyword: "çocuk dostu", reason: "Güvenlik sertifikası — çevre performansı değil" },
  { keyword: "enerji tasarruflu", reason: "Kullanım iddiası — ürün eco değil" },
];

// ---------------------------------------------------------------------------
// THRESHOLDS
// ---------------------------------------------------------------------------
export const THRESHOLDS = {
  directEco: 5,   // effectiveScore >= 5  → Section A
  llmRequired: 1, // effectiveScore 1–4   → LLM
  safetyNet: 0,   // effectiveScore <= 0  → LLM safety net
};

// ---------------------------------------------------------------------------
// ENGINE
// ---------------------------------------------------------------------------

function findMatches(
  text: string,
  keywords: { keyword: string; category: string }[],
  tier: 1 | 2 | 3 | "negative" | "misleading",
  points: number
): KeywordMatch[] {
  const lowerText = text.toLowerCase();
  const matches: KeywordMatch[] = [];
  const matched = new Set<string>();

  for (const { keyword, category } of keywords) {
    const lowerKeyword = keyword.toLowerCase();
    if (lowerText.includes(lowerKeyword) && !matched.has(lowerKeyword)) {
      matched.add(lowerKeyword);
      // Find the actual text around the match for context
      const idx = lowerText.indexOf(lowerKeyword);
      const start = Math.max(0, idx - 20);
      const end = Math.min(text.length, idx + keyword.length + 20);
      const foundText = "..." + text.slice(start, end).trim() + "...";

      matches.push({ keyword, tier, points, category, foundText });
    }
  }
  return matches;
}

export function runKeywordEngine(description: string): KeywordResult {
  const tier1 = findMatches(description, TIER1_KEYWORDS, 1, 3);
  const tier2 = findMatches(description, TIER2_KEYWORDS, 2, 2);
  const tier3 = findMatches(description, TIER3_KEYWORDS, 3, 1);
  const negatives = findMatches(description, NEGATIVE_KEYWORDS, "negative", -1);
  const misleadings = findMatches(
    description,
    MISLEADING_KEYWORDS.map((m) => ({ keyword: m.keyword, category: "misleading" })),
    "misleading",
    0
  );

  const positiveScore =
    tier1.reduce((s, m) => s + m.points, 0) +
    tier2.reduce((s, m) => s + m.points, 0) +
    tier3.reduce((s, m) => s + m.points, 0);

  const negativeScore = negatives.reduce((s, m) => s + m.points, 0); // already negative
  const rawScore = positiveScore + negativeScore;
  const effectiveScore = Math.max(0, rawScore);

  const routingLabel =
    effectiveScore >= THRESHOLDS.directEco
      ? "direct_eco"
      : effectiveScore >= THRESHOLDS.llmRequired
      ? "llm_required"
      : "safety_net";

  return {
    rawScore,
    effectiveScore,
    matches: [...tier1, ...tier2, ...tier3],
    negativeMatches: negatives,
    misleadingMatches: misleadings,
    routingLabel,
  };
}
