import type { ConfirmedRecord } from '@/types';

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/https?:\/\//g, '')
    .replace(/[^a-z0-9\-/_.]+/g, ' ')
    .split(/\s+/)
    .filter((t) => t && t.length > 1);
}

function getDocText(r: ConfirmedRecord): string {
  const url = r.session.url || '';
  const title = r.session.title || '';
  return `${title} ${url}`;
}

export class TFIDFSimilarity {
  private vocab = new Map<string, number>();
  private idf = new Map<string, number>();
  private docVectors = new Map<string, Map<string, number>>();

  constructor(records: ConfirmedRecord[]) {
    const docs: { id: string; tokens: string[] }[] = records.map((r) => ({
      id: r.id,
      tokens: tokenize(getDocText(r)),
    }));

    // Build vocab and DF
    const df = new Map<string, number>();
    docs.forEach(({ tokens }) => {
      const seen = new Set<string>();
      tokens.forEach((t) => {
        if (!seen.has(t)) {
          df.set(t, (df.get(t) || 0) + 1);
          seen.add(t);
        }
      });
    });

    // Compute IDF
    const N = docs.length || 1;
    let index = 0;
    for (const term of df.keys()) {
      this.vocab.set(term, index++);
      const d = df.get(term)!;
      const idf = Math.log((N + 1) / (d + 1)) + 1; // smoothed IDF
      this.idf.set(term, idf);
    }

    // Compute TF-IDF vectors (sparse)
    docs.forEach(({ id, tokens }) => {
      const tf = new Map<string, number>();
      tokens.forEach((t) => tf.set(t, (tf.get(t) || 0) + 1));

      const maxTf = Math.max(1, ...tf.values());
      const vec = new Map<string, number>();
      for (const [term, freq] of tf.entries()) {
        const idf = this.idf.get(term);
        if (idf) {
          const tfNorm = 0.5 + 0.5 * (freq / maxTf); // augmented TF
          vec.set(term, tfNorm * idf);
        }
      }
      this.docVectors.set(id, vec);
    });
  }

  calculateSimilarity(id1: string, id2: string): number {
    const v1 = this.docVectors.get(id1);
    const v2 = this.docVectors.get(id2);
    if (!v1 || !v2) return 0;

    // cosine similarity on sparse maps
    let dot = 0;
    let n1 = 0;
    let n2 = 0;

    for (const val of v1.values()) n1 += val * val;
    for (const val of v2.values()) n2 += val * val;

    const [small, large] = v1.size < v2.size ? [v1, v2] : [v2, v1];
    for (const [term, val] of small.entries()) {
      const other = large.get(term);
      if (other) dot += val * other;
    }

    if (n1 === 0 || n2 === 0) return 0;
    return dot / (Math.sqrt(n1) * Math.sqrt(n2));
  }
}

