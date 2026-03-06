"use client";

import { useState } from "react";

interface Props {
  onClose: () => void;
}

type Tab = "akis" | "keyword" | "llm" | "fayda" | "roadmap";

const TABS: { id: Tab; label: string }[] = [
  { id: "akis", label: "Teknik Akis" },
  { id: "keyword", label: "Keyword Motoru" },
  { id: "llm", label: "LLM Motoru" },
  { id: "fayda", label: "Sistem Faydaları" },
  { id: "roadmap", label: "1 Aylık Plan" },
];

export default function HowItWorksModal({ onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("akis");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Nasıl Calısıyor?</h2>
            <p className="text-xs text-gray-500 mt-0.5">2 katmanlı eco-friendly etiketleme motorunun teknik mimarisi</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 flex-shrink-0 border-b border-gray-100 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === "akis" && <TabAkis />}
          {activeTab === "keyword" && <TabKeyword />}
          {activeTab === "llm" && <TabLLM />}
          {activeTab === "fayda" && <TabFayda />}
          {activeTab === "roadmap" && <TabRoadmap />}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TAB: TEKNİK AKIŞ
// ---------------------------------------------------------------------------
function TabAkis() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-1">Problem</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Katalogdaki hiçbir üründe <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">is_eco_friendly</code> gibi yapılandırılmış bir alan yok.
          Ürün açıklamaları tamamen serbest metin. Manuel etiketleme ölçeklenebilir değil.
          Bu motor, yapılandırılmamış metinden otomatik eco sinyal çıkarır.
        </p>
      </div>

      {/* Pipeline flow */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Pipeline Akışı</h3>
        <div className="space-y-2">
          {[
            {
              step: "1",
              title: "Ürün Girdi",
              desc: "{ sku, name, description } — name + description birleştirilerek analiz edilir",
              color: "bg-gray-100 border-gray-300 text-gray-700",
            },
            {
              step: "2",
              title: "Text Preprocessing",
              desc: "Lowercase → Türkçe karakter normalizasyonu (ş→s, ç→c…) → Noktalama kaldırma",
              color: "bg-purple-50 border-purple-200 text-purple-800",
            },
            {
              step: "3",
              title: "Keyword Motoru (Katman 1)",
              desc: "Ağırlıklı keyword taraması. Puan ≥5 → doğrudan Section A. Puan ≤0 → LLM safety net. Arası → LLM'e aktar.",
              color: "bg-amber-50 border-amber-200 text-amber-800",
            },
            {
              step: "4",
              title: "LLM Motoru (Katman 2)",
              desc: "Belirsiz aralıktaki ürünler LLM'e gönderilir. Confidence ≥0.60 → karar. <0.60 → human_review.",
              color: "bg-blue-50 border-blue-200 text-blue-800",
            },
            {
              step: "5",
              title: "Çıktı",
              desc: "{ sku, is_eco_friendly, confidence, method, matched_keywords, llm_reasoning, description_hash }",
              color: "bg-emerald-50 border-emerald-200 text-emerald-800",
            },
          ].map((s, i, arr) => (
            <div key={s.step}>
              <div className={`rounded-lg border px-4 py-3 ${s.color}`}>
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-white bg-opacity-60 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {s.step}
                  </span>
                  <div>
                    <p className="text-xs font-bold mb-0.5">{s.title}</p>
                    <p className="text-xs opacity-80 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </div>
              {i < arr.length - 1 && (
                <div className="flex justify-center py-0.5 text-gray-300 text-sm">↓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Decision thresholds */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Karar Eşikleri</h3>
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 font-semibold text-gray-600">Katman</th>
                <th className="text-left px-4 py-2 font-semibold text-gray-600">Koşul</th>
                <th className="text-left px-4 py-2 font-semibold text-gray-600">Sonuç</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { katman: "Keyword", kosul: "Puan ≥ 5", sonuc: "Section A — Keyword ECO", color: "text-emerald-700" },
                { katman: "Keyword", kosul: "Puan 1–4", sonuc: "LLM Motoruna aktar", color: "text-amber-700" },
                { katman: "Keyword", kosul: "Puan ≤ 0", sonuc: "LLM Safety Net (yine LLM'e gider)", color: "text-gray-600" },
                { katman: "LLM", kosul: "Confidence ≥ 0.60", sonuc: "Section B — LLM ECO / Rejected", color: "text-blue-700" },
                { katman: "LLM", kosul: "Confidence < 0.60", sonuc: "Section C — Manual Check", color: "text-amber-700" },
                { katman: "LLM", kosul: "Hata / Invalid JSON", sonuc: "Section C — Manual Check (fallback)", color: "text-red-700" },
              ].map((r, i) => (
                <tr key={i} className="bg-white">
                  <td className="px-4 py-2 text-gray-500">{r.katman}</td>
                  <td className="px-4 py-2 font-mono">{r.kosul}</td>
                  <td className={`px-4 py-2 font-semibold ${r.color}`}>{r.sonuc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TAB: KEYWORD MOTORU
// ---------------------------------------------------------------------------
function TabKeyword() {
  return (
    <div className="space-y-5">
      {/* Tier table */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Keyword Havuzu — 4 Katman</h3>
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 font-semibold text-gray-600">Tier</th>
                <th className="text-left px-4 py-2 font-semibold text-gray-600">Puan</th>
                <th className="text-left px-4 py-2 font-semibold text-gray-600">Kategori</th>
                <th className="text-left px-4 py-2 font-semibold text-gray-600">Ornekler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="bg-emerald-50">
                <td className="px-4 py-2.5 font-bold text-emerald-700">Tier 1</td>
                <td className="px-4 py-2.5 font-bold text-emerald-700">+3</td>
                <td className="px-4 py-2.5 text-emerald-700">Sertifikalar</td>
                <td className="px-4 py-2.5 text-emerald-700">FSC, OEKO-TEX, GOTS, GRS, Fairtrade, karbon nötr</td>
              </tr>
              <tr className="bg-amber-50">
                <td className="px-4 py-2.5 font-bold text-amber-700">Tier 2</td>
                <td className="px-4 py-2.5 font-bold text-amber-700">+2</td>
                <td className="px-4 py-2.5 text-amber-700">Malzeme / Proses</td>
                <td className="px-4 py-2.5 text-amber-700">geri dönüstürülmus, biyobozunur, VOC-free, su bazlı boya, bambu</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-2.5 font-bold text-gray-700">Tier 3</td>
                <td className="px-4 py-2.5 font-bold text-gray-700">+1</td>
                <td className="px-4 py-2.5 text-gray-700">Genel Iddialar</td>
                <td className="px-4 py-2.5 text-gray-700">surdurulebilir, dogal malzeme, el yapımı, minimal ambalaj</td>
              </tr>
              <tr className="bg-red-50">
                <td className="px-4 py-2.5 font-bold text-red-700">Negatif</td>
                <td className="px-4 py-2.5 font-bold text-red-700">-1</td>
                <td className="px-4 py-2.5 text-red-700">Olumsuz Malzeme</td>
                <td className="px-4 py-2.5 text-red-700">PVC, poliüretan, MDF, virgin plastic, solvent bazlı</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Ayrıca <strong>Misleading Keywords</strong> listesi var (BPA-free, vintage, ahsap görünümlü…) — puana dahil edilmez, sadece
          tespit edilip işaretlenir. LLM'e gönderildiğinde context olarak kullanılır.
        </p>
      </div>

      {/* Design decisions */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Kurgulanırken Dikkat Edilen Hususlar</h3>
        <div className="space-y-3">
          {[
            {
              title: "Unique Keyword Match",
              desc: "Aynı keyword metinde kaç kez geçerse geçsin skora en fazla bir kez katkı sağlar. 'bambu' kelimesinin 5 kez geçmesi puanı manipüle edemez.",
              badge: "Anti-spam",
              badgeColor: "bg-blue-100 text-blue-700",
            },
            {
              title: "Negatif Keyword Cezası",
              desc: "PVC, MDF, poliüretan gibi keyword'ler -1 puan alır. Tier 2 malzeme eşleşse bile ürün negatif malzeme içeriyorsa efektif puan düşer. rawScore = pozitif + negatif; effectiveScore = max(0, rawScore).",
              badge: "Anti-false-positive",
              badgeColor: "bg-orange-100 text-orange-700",
            },
            {
              title: "Misleading Keyword Tuzagı",
              desc: "'BPA-free' bir güvenlik sertifikası, çevre performansı değil. 'Vintage', 'retro', 'ahsap görünümlü' estetik tanım. Bu keyword'ler puana dahil edilmez ama flaglenir — LLM bu bağlamı kullanır.",
              badge: "Greenwashing Koruması",
              badgeColor: "bg-purple-100 text-purple-700",
            },
            {
              title: "Negation Guard",
              desc: "Keyword eşleşmesi bulunduğunda ±10 token çevresinde 'değil, yok, içermez, yoktur' aranır. 'Geri dönüstürülmus içermez' ifadesi yanlışlıkla pozitif puan almaz. Tamamen deterministik, ek LLM çağrısı yok.",
              badge: "Deterministic",
              badgeColor: "bg-gray-100 text-gray-700",
            },
            {
              title: "Keyword Listesi Normalize Edilmis",
              desc: "Hem text hem keywords aynı preprocessing'den geçer: lowercase + Türkçe karakter normalizasyonu. 'Sürdürülebilir' ve 'surdurulebilir' aynı eşleşmeyi üretir. Büyük/küçük harf ve karakter sorunu ortadan kalkar.",
              badge: "Determinizm",
              badgeColor: "bg-teal-100 text-teal-700",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-bold text-gray-800">{item.title}</p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TAB: LLM MOTORU
// ---------------------------------------------------------------------------
function TabLLM() {
  return (
    <div className="space-y-5">
      {/* Prompt */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Prompt Sablonu</h3>
        <div className="rounded-xl border border-slate-200 bg-slate-900 px-4 py-4 overflow-x-auto">
          <pre className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-mono">{`Sen bir ürün sürdürülebilirlik uzmanısın.
Aşağıdaki ürün açıklamasını değerlendirerek ürünün
çevre dostu olup olmadığını belirle.

Ürün Adı: {{product_name}}
Açıklama: {{description}}

Şu formatta yanıt ver:
{
  "is_eco_friendly": true | false,
  "confidence": 0.00–1.00,
  "label": "eco" | "not_eco" | "uncertain",
  "reasoning": "kısa gerekçe",
  "signals_found": [
    { "text": "...", "strength": "strong|medium|weak" }
  ],
  "signals_missing": [
    { "text": "...", "reason": "neden eco kanıtı değil" }
  ]
}`}</pre>
        </div>
      </div>

      {/* Design decisions */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Kurgulanırken Dikkat Edilen Hususlar</h3>
        <div className="space-y-3">
          {[
            {
              title: "Role-Based Prompt",
              desc: "'Sen bir ürün sürdürülebilirlik uzmanısın' — modele açık bir rol veriliyor. Genel bir soru yerine domain-specific bir çerçeve kuruluyor. Bu, hallucination riskini ve jenerik cevap alma ihtimalini düsürür.",
              badge: "Prompt Engineering",
              badgeColor: "bg-blue-100 text-blue-700",
            },
            {
              title: "Structured JSON Output",
              desc: "Model serbest metin yerine JSON döndürmeye zorlanıyor. Bu sayede confidence, label ve reasoning alanları parse edilebilir hale geliyor. Geçersiz JSON durumunda sistem otomatik olarak human_review'a düsüyor.",
              badge: "Parseable Output",
              badgeColor: "bg-emerald-100 text-emerald-700",
            },
            {
              title: "Confidence Score (0–1)",
              desc: "Binary karar yerine olasılık skoru isteniyor. confidence < 0.60 → human_review. Bu sayede model 'emin değilim' diyebiliyor ve sistem bu belirsizliği insan gözüne taşıyor. Yanlıs label üretmek zorunda kalmıyor.",
              badge: "Calibration",
              badgeColor: "bg-amber-100 text-amber-700",
            },
            {
              title: "signals_found + signals_missing",
              desc: "Model sadece karar vermekle kalmıyor, kanıt gösteriyor. 'Neden eco?' sorusu yanıtlanmış oluyor. signals_missing ise misleading keyword'leri ve eksik sertifikaları işaret ediyor — demo panelde şeffaf biçimde gösteriliyor.",
              badge: "Explainability",
              badgeColor: "bg-purple-100 text-purple-700",
            },
            {
              title: "Pre-Processed Demo / Gerçek Deployment Farkı",
              desc: "Bu demoda LLM analizi önceden hesaplanıp catalog JSON'una gömüldü. Gerçek deployment'ta her ürün açıklaması Claude API'ye gönderilir ve dinamik olarak analiz edilir. Bu yaklaşım demo maliyetini sıfırlar, latency'yi kaldırır.",
              badge: "Demo Optimizasyonu",
              badgeColor: "bg-gray-100 text-gray-700",
            },
            {
              title: "Hata Yönetimi & Fallback",
              desc: "Timeout / rate limit → 3x retry (1s, 2s, 4s exponential backoff). Hâlâ basarısız → human_review. Geçersiz JSON → human_review. Pipeline hiçbir hata durumunda çökmez, her ürün mutlaka bir sonuçla çıkar.",
              badge: "Resilience",
              badgeColor: "bg-red-100 text-red-700",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-bold text-gray-800">{item.title}</p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TAB: SİSTEM FAYDALARI
// ---------------------------------------------------------------------------
function TabFayda() {
  return (
    <div className="space-y-5">
      {/* Pilot metrics */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Pilot Sonuçları — 10 SKU</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "5 / 10", label: "Eco-Friendly ürün tespit edildi", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
            { value: "%30", label: "LLM çağrısı azaldı (keyword filtresi sayesinde)", color: "bg-blue-50 border-blue-200 text-blue-700" },
            { value: "1 / 10", label: "SKU manuel incelemeye düstü", color: "bg-amber-50 border-amber-200 text-amber-700" },
            { value: "%0", label: "Sistem hatası — tüm ürünler sonuçlandı", color: "bg-gray-50 border-gray-200 text-gray-700" },
          ].map((m) => (
            <div key={m.label} className={`rounded-xl border px-4 py-3 ${m.color}`}>
              <p className="text-2xl font-bold">{m.value}</p>
              <p className="text-xs mt-0.5 opacity-80 leading-tight">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section breakdown */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Section Dağılımı</h3>
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 font-semibold text-gray-600">Section</th>
                <th className="text-left px-4 py-2 font-semibold text-gray-600">Method</th>
                <th className="text-left px-4 py-2 font-semibold text-gray-600">SKU</th>
                <th className="text-left px-4 py-2 font-semibold text-gray-600">Detay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="bg-emerald-50">
                <td className="px-4 py-2.5 font-bold text-emerald-700">Section A</td>
                <td className="px-4 py-2.5 text-emerald-700">keyword</td>
                <td className="px-4 py-2.5 font-bold text-emerald-700">3</td>
                <td className="px-4 py-2.5 text-emerald-700">LLM çağrısı yapılmadı</td>
              </tr>
              <tr className="bg-teal-50">
                <td className="px-4 py-2.5 font-bold text-teal-700">Section B</td>
                <td className="px-4 py-2.5 text-teal-700">llm</td>
                <td className="px-4 py-2.5 font-bold text-teal-700">2</td>
                <td className="px-4 py-2.5 text-teal-700">Confidence 0.73–0.76</td>
              </tr>
              <tr className="bg-amber-50">
                <td className="px-4 py-2.5 font-bold text-amber-700">Manual Check</td>
                <td className="px-4 py-2.5 text-amber-700">human_review</td>
                <td className="px-4 py-2.5 font-bold text-amber-700">1</td>
                <td className="px-4 py-2.5 text-amber-700">Confidence 0.44 — yetersiz</td>
              </tr>
              <tr className="bg-red-50">
                <td className="px-4 py-2.5 font-bold text-red-700">Rejected</td>
                <td className="px-4 py-2.5 text-red-700">keyword + llm</td>
                <td className="px-4 py-2.5 font-bold text-red-700">4</td>
                <td className="px-4 py-2.5 text-red-700">Confidence 0.06–0.18</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Benefits list */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Sistemin Sağladığı Faydalar</h3>
        <div className="space-y-2">
          {[
            { title: "Sıfır Manuel Etiketleme", desc: "10 üründen 9'u tamamen otomatik etiketlendi. İnsan sadece gerçekten belirsiz olan ürüne baktı.", icon: "✓" },
            { title: "LLM Maliyet Optimizasyonu", desc: "Keyword filtresi net sinyalli ürünleri erkenden eledi. 10 SKU'dan 3'ü LLM'e hiç gitmedi → %30 maliyet tasarrufu. Ölçekte çok daha büyük etki.", icon: "✓" },
            { title: "Explainability", desc: "Her karar kanıtlıdır. Hangi keyword eşlesti, LLM neden bu skoru verdi, hangi sinyal eksikti — tamamı kayıt altında.", icon: "✓" },
            { title: "Insan-in-the-loop Tasarımı", desc: "Sistem belirsizlikleri insan gözüne taşıyor, zorla karar vermiyor. Bu hem güvenilirliği artırır hem de yanlıs etiket riskini minimize eder.", icon: "✓" },
            { title: "Hash-based Idempotency", desc: "Aynı ürün tekrar geldiğinde LLM çağrısı yapılmıyor. description_hash ile önceki sonuç döndürülüyor. Hem maliyet hem latency sıfırlanıyor.", icon: "✓" },
            { title: "Pipeline Asla Çökmüyor", desc: "Her hata senaryosu (timeout, rate limit, geçersiz JSON) human_review'a yönlendiriyor. Ürün ne olursa olsun bir sonuçla çıkıyor.", icon: "✓" },
          ].map((item) => (
            <div key={item.title} className="flex gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
              <span className="text-emerald-500 font-bold text-sm flex-shrink-0 mt-0.5">{item.icon}</span>
              <div>
                <p className="text-xs font-bold text-gray-800 mb-0.5">{item.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TAB: 1 AYLIK ROADMAP
// ---------------------------------------------------------------------------
function TabRoadmap() {
  return (
    <div className="space-y-5">
      {/* Comparison */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-4">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">Hacky Çözüm (Mevcut)</p>
          <ul className="space-y-1.5 text-xs text-amber-800">
            {[
              "10 SKU'luk JSON katalog",
              "LLM analizi önceden hesaplanmış",
              "Statik Next.js demo",
              "Sonuçlar hardcoded",
              "Hash / cache yok",
              "DB entegrasyonu yok",
              "Batch pipeline yok",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-amber-400 flex-shrink-0">–</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">Sustainable Çözüm (1 Ay)</p>
          <ul className="space-y-1.5 text-xs text-emerald-800">
            {[
              "Tam katalog entegrasyonu",
              "Gerçek zamanlı API çağrısı",
              "DB tablosu (is_eco_friendly, hash…)",
              "Hash-based idempotency",
              "Batch pipeline (event-driven)",
              "Admin UI (manual review queue)",
              "Fine-tune için etiket birikimi",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-emerald-500 flex-shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4-week plan */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">4 Haftalık Plan</h3>
        <div className="space-y-3">
          {[
            {
              week: "Hafta 1",
              title: "Veri Altyapısı",
              items: [
                "Katalog DB'sine is_eco_friendly, confidence, method, description_hash alanları eklenir",
                "Pipeline DB'ye yazar, hash eslesiyorsa reuse eder",
                "Gerçek Claude API entegrasyonu aktif hale gelir",
              ],
              color: "border-blue-200 bg-blue-50",
              headColor: "text-blue-700",
            },
            {
              week: "Hafta 2",
              title: "Batch Pipeline",
              items: [
                "Mevcut tüm katalog toplu olarak taranır (batch job)",
                "Rate limit yönetimi ve retry stratejisi production'a taşınır",
                "human_review_queue.json → DB tablosuna alınır",
              ],
              color: "border-purple-200 bg-purple-50",
              headColor: "text-purple-700",
            },
            {
              week: "Hafta 3",
              title: "Manuel Review Akısı",
              items: [
                "Basit admin arayüzü: human_review kuyruğu görüntülenir",
                "Analist ECO / NOT ECO kararı verir, override DB'ye yazılır",
                "Bu etiketler ilerideki fine-tune için eğitim verisi olur",
              ],
              color: "border-amber-200 bg-amber-50",
              headColor: "text-amber-700",
            },
            {
              week: "Hafta 4",
              title: "Event-Driven Otomasyon",
              items: [
                "Yeni ürün ekleme / açıklama güncelleme event'leri pipeline'ı tetikler",
                "Katalog büyüdükçe etiketler otomatik güncellenir",
                "Hash değismemisse hiçbir şey çalısmaz — maliyet minimize",
              ],
              color: "border-emerald-200 bg-emerald-50",
              headColor: "text-emerald-700",
            },
          ].map((w) => (
            <div key={w.week} className={`rounded-xl border px-4 py-3 ${w.color}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 bg-white rounded-full border ${w.headColor} border-current`}>
                  {w.week}
                </span>
                <span className={`text-xs font-bold ${w.headColor}`}>{w.title}</span>
              </div>
              <ul className="space-y-1">
                {w.items.map((item) => (
                  <li key={item} className="flex gap-2 text-xs text-gray-700">
                    <span className="flex-shrink-0 opacity-50">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* End state */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
        <p className="text-xs font-bold text-gray-700 mb-1">1 Ayın Sonunda</p>
        <p className="text-xs text-gray-600 leading-relaxed">
          Manuel etiketleme sıfıra yakın. LLM maliyeti hash-based cache ile minimize edilmis.
          Sistem her yeni ürünle kendi kendine ögreniyor. Insan sadece gerçekten belirsiz
          olan ürünlere bakıyor. Katalog büyüdükçe sistem daha akıllı hale geliyor.
        </p>
      </div>
    </div>
  );
}
