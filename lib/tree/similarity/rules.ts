import type { ConfirmedRecord } from '@/types';
import { extractSimpleCategory } from '@/lib/tree/treeConverter';

function domainOf(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export function calculateRuleSimilarity(a: ConfirmedRecord, b: ConfirmedRecord): number {
  let score = 0;

  // Same category
  const catA = extractSimpleCategory(a.session.url, a.session.title);
  const catB = extractSimpleCategory(b.session.url, b.session.title);
  if (catA === catB) score += 0.5;

  // Same domain
  if (domainOf(a.session.url) && domainOf(a.session.url) === domainOf(b.session.url)) {
    score += 0.3;
  }

  // Title keyword overlap (very rough)
  const kwA = (a.session.title || '').toLowerCase().split(/[^a-z0-9一-龯ぁ-んァ-ン]+/).filter(Boolean);
  const kwB = (b.session.title || '').toLowerCase().split(/[^a-z0-9一-龯ぁ-んァ-ン]+/).filter(Boolean);
  const setA = new Set(kwA);
  const overlap = kwB.filter((k) => setA.has(k)).length;
  if (overlap > 0) score += Math.min(0.2, 0.05 * overlap);

  return Math.min(1, score);
}

