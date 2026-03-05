"use client";

import { ProcessedProduct, OverrideStatus } from "@/lib/types";
import ProductCard from "./ProductCard";

interface Props {
  title: string;
  description: string;
  products: ProcessedProduct[];
  accentClass: string;
  icon: string;
  onOverride: (id: number, status: OverrideStatus) => void;
  emptyMessage?: string;
}

export default function SectionBlock({
  title,
  description,
  products,
  accentClass,
  icon,
  onOverride,
  emptyMessage = "Bu section'da urun yok.",
}: Props) {
  return (
    <div className={`rounded-2xl border-2 ${accentClass} overflow-hidden`}>
      <div className="px-5 py-4 border-b border-current border-opacity-20 bg-white bg-opacity-60">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{icon}</span>
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <span className="ml-auto px-2 py-0.5 rounded-full bg-white text-gray-700 text-xs font-semibold border border-gray-200">
            {products.length} urun
          </span>
        </div>
        <p className="text-xs text-gray-500 ml-7">{description}</p>
      </div>

      <div className="p-4 space-y-3 bg-white bg-opacity-40">
        {products.length === 0 ? (
          <p className="text-sm text-gray-400 italic text-center py-4">{emptyMessage}</p>
        ) : (
          products.map((p) => (
            <ProductCard key={p.product.id} data={p} onOverride={onOverride} showFiltered />
          ))
        )}
      </div>
    </div>
  );
}
