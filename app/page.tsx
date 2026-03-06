"use client";

import { useState, useCallback } from "react";
import catalog from "@/data/catalog.json";
import { runKeywordEngine } from "@/lib/keyword-engine";
import { Product, ProcessedProduct, OverrideStatus } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import SectionBlock from "@/components/SectionBlock";
import HowItWorksModal from "@/components/HowItWorksModal";

// ---------------------------------------------------------------------------
// Processing
// ---------------------------------------------------------------------------
function processProducts(products: Product[]): ProcessedProduct[] {
  return products.map((product) => {
    const keywordResult = runKeywordEngine(product.description);
    const llm = product.llm_analysis;

    let finalSection: ProcessedProduct["finalSection"];

    if (keywordResult.routingLabel === "direct_eco") {
      finalSection = "A";
    } else if (llm.label === "eco") {
      finalSection = "B";
    } else if (llm.label === "uncertain") {
      finalSection = "C_manual";
    } else {
      finalSection = "C_rejected";
    }

    return { product, keywordResult, finalSection, overrideStatus: null };
  });
}

const INITIAL_PROCESSED = processProducts(catalog as Product[]);

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function Home() {
  const [filtered, setFiltered] = useState(false);
  const [processed, setProcessed] = useState<ProcessedProduct[]>(INITIAL_PROCESSED);
  const [animating, setAnimating] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const handleFilter = () => {
    setAnimating(true);
    setTimeout(() => {
      setFiltered(true);
      setAnimating(false);
    }, 600);
  };

  const handleReset = () => {
    setFiltered(false);
    setProcessed(INITIAL_PROCESSED.map((p) => ({ ...p, overrideStatus: null })));
  };

  const handleOverride = useCallback((id: number, status: OverrideStatus) => {
    setProcessed((prev) =>
      prev.map((p) => {
        if (p.product.id !== id) return p;
        const newOverride = status;
        let newSection = p.finalSection;

        if (newOverride === "eco") {
          newSection = p.finalSection === "A" ? "A" : "B";
        } else if (newOverride === "not_eco") {
          newSection = "C_rejected";
        } else {
          // reset to original
          newSection = INITIAL_PROCESSED.find((ip) => ip.product.id === id)!.finalSection;
        }

        return { ...p, overrideStatus: newOverride, finalSection: newSection };
      })
    );
  }, []);

  // Sections
  const sectionA = processed.filter((p) => p.finalSection === "A");
  const sectionB = processed.filter((p) => p.finalSection === "B");
  const sectionCRejected = processed.filter((p) => p.finalSection === "C_rejected");
  const sectionCManual = processed.filter((p) => p.finalSection === "C_manual");

  const ecoCount = sectionA.length + sectionB.length;

  return (
    <main className="min-h-screen">
      {showHowItWorks && <HowItWorksModal onClose={() => setShowHowItWorks(false)} />}
      {/* ------------------------------------------------------------------ */}
      {/* HEADER */}
      {/* ------------------------------------------------------------------ */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">G</span>
            </div>
            <div>
              <span className="font-bold text-gray-900 text-sm">Gengage</span>
              <span className="text-gray-400 text-sm"> / Eco Filter Demo</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHowItWorks(true)}
              className="px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-700 text-white text-xs font-semibold transition-colors"
            >
              Nasıl Calısıyor?
            </button>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
              Vivense Pilot
            </span>
            <span className="text-xs text-gray-400">10 SKU</span>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* HERO */}
      {/* ------------------------------------------------------------------ */}
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-2">
              Intent-Based Discovery — Prototype
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
              "Bana cevre dostu urunleri goster"
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Vivense katalogu yapılandırılmamış metin açıklamaları içeriyor — hiçbir üründe{" "}
              <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">is_eco_friendly: true</code> etiketi yok.
              Bu demo, <strong>2 katmanlı motor</strong> ile eco-friendly ürünleri otomatik tespit eder:
              önce ağırlıklı keyword puanlaması, ardından pre-processed LLM analizi.
            </p>

            {/* Pipeline legend */}
            <div className="flex flex-wrap gap-2 mb-6 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200">
                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                <span className="text-gray-600">Katalog (ham metin)</span>
              </div>
              <span className="text-gray-300 self-center">→</span>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-full border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span className="text-amber-700">Keyword Engine (ağırlıklı puan)</span>
              </div>
              <span className="text-gray-300 self-center">→</span>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-200">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span className="text-blue-700">LLM Motor (intent extraction)</span>
              </div>
              <span className="text-gray-300 self-center">→</span>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-emerald-700">Eco Tag</span>
              </div>
            </div>

            {/* CTA */}
            {!filtered ? (
              <button
                onClick={handleFilter}
                disabled={animating}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm disabled:opacity-60"
              >
                {animating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Motor calisiyor...
                  </>
                ) : (
                  <>
                    <span>&#x1F33F;</span>
                    Apply Eco Filter
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-emerald-600 text-lg">&#10003;</span>
                  <span className="text-emerald-700 font-semibold text-sm">
                    {ecoCount} / {processed.length} urun eco-friendly olarak isaretlendi
                  </span>
                </div>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Sifirla
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CONTENT */}
      {/* ------------------------------------------------------------------ */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        {!filtered ? (
          /* All products grid — pre-filter view */
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Tum Katalog — {processed.length} urun
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {processed.map((p) => (
                <ProductCard
                  key={p.product.id}
                  data={p}
                  onOverride={handleOverride}
                  showFiltered={false}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Filtered sections */
          <div className="space-y-6">
            {/* Stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Section A", sub: "Keyword ECO", count: sectionA.length, color: "text-emerald-700 bg-emerald-50 border-emerald-200", tooltip: "Keyword motoru ≥5 puan eşiğini geçti. LLM'e gerek kalmadan doğrudan eco-friendly olarak etiketlendi." },
                { label: "Section B", sub: "LLM ECO", count: sectionB.length, color: "text-teal-700 bg-teal-50 border-teal-200", tooltip: "Keyword eşiğini geçemedi, ancak LLM motoru ürün açıklamasında eco sinyali tespit etti. Örtük ifadeler bu kategoriye düşer." },
                { label: "Manual Check", sub: "Insan gozu gerekli", count: sectionCManual.length, color: "text-amber-700 bg-amber-50 border-amber-200", tooltip: "LLM motoru 'uncertain' döndürdü — sinyal var ama yeterince güçlü değil. İnsan kararı gerekiyor." },
                { label: "Rejected", sub: "Eco degil", count: sectionCRejected.length, color: "text-red-700 bg-red-50 border-red-200", tooltip: "Hem keyword hem LLM motorundan eco etiketi alamadı. Katalogda eco bağlantılı sinyal bulunamadı." },
              ].map((s) => (
                <div key={s.label} className={`relative group rounded-xl border px-4 py-3 ${s.color}`}>
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{s.label}</p>
                    <span className="opacity-40 text-xs cursor-default select-none">ℹ</span>
                  </div>
                  <p className="text-2xl font-bold">{s.count}</p>
                  <p className="text-xs opacity-70">{s.sub}</p>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 z-10 hidden group-hover:block pointer-events-none">
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 leading-relaxed shadow-lg">
                      {s.tooltip}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Section A */}
            <SectionBlock
              title="Section A — Keyword ECO"
              description="Keyword puanı esigi gecti (≥5 puan). LLM motoruna gitmeden dogrudan eco olarak isaretlendi."
              products={sectionA}
              accentClass="border-emerald-300"
              icon="&#x2705;"
              onOverride={handleOverride}
            />

            {/* Section B */}
            <SectionBlock
              title="Section B — LLM ECO"
              description="Keyword esigini gecemedi ama LLM motoru eco sinyali tespit etti. Implicit veya dolaylieco ifadeleri buraya dusuyor."
              products={sectionB}
              accentClass="border-teal-300"
              icon="&#x1F916;"
              onOverride={handleOverride}
            />

            {/* Section C */}
            <div className={`rounded-2xl border-2 border-amber-300 overflow-hidden`}>
              <div className="px-5 py-4 border-b border-amber-200 bg-white bg-opacity-60">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">&#x26A0;&#xFE0F;</span>
                  <h2 className="text-base font-bold text-gray-900">Section C — Eco Degil</h2>
                  <span className="ml-auto px-2 py-0.5 rounded-full bg-white text-gray-700 text-xs font-semibold border border-gray-200">
                    {sectionCRejected.length + sectionCManual.length} urun
                  </span>
                </div>
                <p className="text-xs text-gray-500 ml-7">
                  Her iki asamadan da eco etiketi alamayan urunler. Manuel dokunusu gerekenler ayrica isaretlendi.
                </p>
              </div>

              <div className="p-4 space-y-6 bg-white bg-opacity-40">
                {/* C-Manual */}
                {sectionCManual.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white">
                        Needs Manual Check
                      </span>
                      <span className="text-xs text-gray-500">
                        LLM uncertain dondu — insan karari gerekiyor
                      </span>
                    </div>
                    <div className="space-y-3">
                      {sectionCManual.map((p) => (
                        <ProductCard key={p.product.id} data={p} onOverride={handleOverride} showFiltered />
                      ))}
                    </div>
                  </div>
                )}

                {/* C-Rejected */}
                {sectionCRejected.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white">
                        Rejected
                      </span>
                      <span className="text-xs text-gray-500">
                        Keyword ve LLM motorlarindan eco etiketi alamadi
                      </span>
                    </div>
                    <div className="space-y-3">
                      {sectionCRejected.map((p) => (
                        <ProductCard key={p.product.id} data={p} onOverride={handleOverride} showFiltered />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer note */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4">
              <p className="text-xs text-blue-700 font-semibold mb-1">Demo Notu</p>
              <p className="text-xs text-blue-600 leading-relaxed">
                LLM analizleri bu demoda pre-processed olarak katalog JSON icinde saklanmaktadir — gercek
                deployment'ta her urun aciklamasi Claude API'ye gonderilir ve dinamik olarak analiz edilir.
                Manuel override toggle'ları ile insan son dokunusu simule edilebilir.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
