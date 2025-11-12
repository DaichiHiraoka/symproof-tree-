'use client';

import React from 'react';
import { getCategoryColor } from '@/lib/tree/ontology';

type Props = {
  categories: string[];
};

export default function CategoryLegend({ categories }: Props) {
  if (!categories || categories.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      {categories.map((cat) => {
        const c = getCategoryColor(cat);
        return (
          <span key={cat} className={`inline-flex items-center gap-2 px-2 py-1 rounded border ${c.border} ${c.bg} ${c.text}`}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'currentColor' }} />
            {cat}
          </span>
        );
      })}
    </div>
  );
}

