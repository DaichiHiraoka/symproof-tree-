import type { ConfirmedRecord } from '@/types';
import type { Node, Edge } from 'reactflow';
import { DEFAULT_ONTOLOGY } from '@/lib/tree/ontology';
import { estimateAbstractionLevel } from '@/lib/tree/abstraction';

export type LearningRecordNodeData = {
  title: string;
  url: string;
  category: string;
  durationMinutes: number;
  dateISO: string; // YYYY-MM-DD
  transactionHash: string;
  blockHeight: number;
  verified: boolean;
  isAnchor?: boolean; // 極座標で中心に最も近いカテゴリ代表
  abstractionLevel?: number; // 1..5（推定）
};

/**
 * URL/タイトルから簡易カテゴリを抽出
 */
export function extractSimpleCategory(url: string, title?: string): string {
  const text = `${url} ${title || ''}`.toLowerCase();

  // 1) オントロジーのエイリアスでカテゴリを判定
  for (const [canonical, def] of Object.entries(DEFAULT_ONTOLOGY.terms)) {
    const hit = def.aliases.some((a) => text.includes(a.toLowerCase()));
    if (hit) return def.category;
    // canonical名ヒットも許容
    if (text.includes(canonical.toLowerCase())) return def.category;
  }

  // 2) フォールバックの正規表現
  if (/react|next/.test(text)) return 'React/Next.js';
  if (/typescript|javascript\b/.test(text)) return 'TypeScript/JavaScript';
  if (/symbol|blockchain|web3/.test(text)) return 'Blockchain';
  if (/css|style|ui|ux/.test(text)) return 'CSS/Design';
  if (/node|express|wasm/.test(text)) return 'Backend';
  return 'その他';
}

/**
 * 確定済みレコードをReact Flowノードに変換
 */
export function convertRecordsToNodes(
  records: ConfirmedRecord[]
): Node<LearningRecordNodeData>[] {
  return records.map((record) => {
    const category = extractSimpleCategory(record.session.url, record.session.title);
    const abstractionLevel = estimateAbstractionLevel(record.session.title, record.session.url);
    const durationMinutes = Math.max(0, Math.round(record.session.duration / 60000));
    const dateISO = new Date(record.session.startTime).toISOString().slice(0, 10);

    return {
      id: record.id,
      type: 'learningRecord',
      position: { x: 0, y: 0 }, // 後でレイアウトで上書き
      data: {
        title: record.session.title,
        url: record.session.url,
        category,
        durationMinutes,
        dateISO,
        transactionHash: record.transactionHash,
        blockHeight: record.blockHeight,
        verified: !!record.verified,
        isAnchor: false,
        abstractionLevel,
      },
    };
  });
}

/**
 * 同一カテゴリ内で時系列エッジを生成
 */
export function generateTimelineEdges(records: ConfirmedRecord[]): Edge[] {
  // カテゴリごとにグループ化して、開始時刻でソートしシーケンシャルに接続
  const groups = new Map<string, ConfirmedRecord[]>();

  records.forEach((r) => {
    const key = extractSimpleCategory(r.session.url, r.session.title);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(r);
  });

  const edges: Edge[] = [];
  for (const [category, list] of groups) {
    list.sort((a, b) => new Date(a.session.startTime).getTime() - new Date(b.session.startTime).getTime());
    for (let i = 1; i < list.length; i++) {
      const prev = list[i - 1];
      const curr = list[i];
      edges.push({
        id: `${category}-${prev.id}->${curr.id}`,
        source: prev.id,
        target: curr.id,
        animated: true,
      });
    }
  }

  return edges;
}

/**
 * カテゴリ列×時系列行の簡易レイアウト
 */
export function layoutByCategory(
  nodes: Node<LearningRecordNodeData>[]
): Node<LearningRecordNodeData>[] {
  const COL_WIDTH = 320; // カラム間隔
  const ROW_HEIGHT = 140; // 行間隔
  const PADDING_X = 16;
  const PADDING_Y = 16;

  // カテゴリごとにノードをまとめ、日付順に並べる
  const categoryMap = new Map<string, Node<LearningRecordNodeData>[]>();
  nodes.forEach((n) => {
    const key = n.data.category;
    if (!categoryMap.has(key)) categoryMap.set(key, []);
    categoryMap.get(key)!.push(n);
  });

  const categories = Array.from(categoryMap.keys()).sort();
  const laidOut: Node<LearningRecordNodeData>[] = [];

  categories.forEach((cat, colIndex) => {
    const list = categoryMap.get(cat)!;
    list.sort((a, b) => (a.data.dateISO < b.data.dateISO ? -1 : a.data.dateISO > b.data.dateISO ? 1 : 0));

    list.forEach((node, rowIndex) => {
      const x = PADDING_X + colIndex * COL_WIDTH;
      const y = PADDING_Y + rowIndex * ROW_HEIGHT;
      // グリッドではアンカーは強調しない
      laidOut.push({ ...node, data: { ...node.data, isAnchor: false }, position: { x, y } });
    });
  });

  return laidOut;
}

/**
 * 極座標レイアウト: カテゴリごとに角度セクターを割り当て、
 * 同一カテゴリ内は中心から外側へ放射状に配置
 */
export function layoutPolar(
  nodes: Node<LearningRecordNodeData>[],
  options?: {
    center?: { x: number; y: number };
    radiusBase?: number;
    radiusStep?: number;
    centerCategory?: string;
  }
): Node<LearningRecordNodeData>[] {
  const center = options?.center ?? { x: 600, y: 400 };
  const radiusBase = options?.radiusBase ?? 140;
  const radiusStep = options?.radiusStep ?? 160;
  const centerCategory = options?.centerCategory;

  // カテゴリごとにまとめ、日付順に並べる
  const categoryMap = new Map<string, Node<LearningRecordNodeData>[]>();
  nodes.forEach((n) => {
    const key = n.data.category;
    if (!categoryMap.has(key)) categoryMap.set(key, []);
    categoryMap.get(key)!.push(n);
  });

  // カテゴリ順序: centerCategoryを先頭に、それ以外は名前順
  const allCats = Array.from(categoryMap.keys()).sort();
  const categories = centerCategory
    ? [centerCategory, ...allCats.filter((c) => c !== centerCategory)]
    : allCats;

  const perCatAngle = (2 * Math.PI) / Math.max(1, categories.length);

  const laidOut: Node<LearningRecordNodeData>[] = [];

  categories.forEach((cat, idx) => {
    const list = (categoryMap.get(cat) || []).map((n) => ({
      node: n,
      level: typeof n.data.abstractionLevel === 'number' ? Math.round(n.data.abstractionLevel!) : 3,
      date: n.data.dateISO,
    }));

    const angle = -Math.PI / 2 + idx * perCatAngle; // -90°から反時計回り

    // レベルごとにグルーピングし、同レベル内は時系列で並べ半径を少しずつオフセット
    const groups = new Map<number, typeof list>();
    list.forEach((item) => {
      const key = clampLevel(item.level);
      if (!groups.has(key)) groups.set(key, [] as any);
      (groups.get(key) as any).push(item);
    });

    // 最小レベルをアンカーに使用
    const minLevel = Math.min(...Array.from(groups.keys()));
    let anchorMarked = false;

    for (const level of Array.from(groups.keys()).sort((a, b) => a - b)) {
      const items = (groups.get(level) as any[]).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

      items.forEach((item, i) => {
        const baseR = radiusBase + (clampLevel(level) - 1) * radiusStep;
        const r = baseR + i * Math.min(30, radiusStep / 4); // 重なり回避の微オフセット
        const x = center.x + r * Math.cos(angle);
        const y = center.y + r * Math.sin(angle);
        const isAnchor = !anchorMarked && level === minLevel; // 最初の最小レベル要素
        anchorMarked = anchorMarked || isAnchor;
        laidOut.push({
          ...item.node,
          data: { ...item.node.data, isAnchor, abstractionLevel: clampLevel(level) },
          position: { x, y },
        });
      });
    }
  });

  return laidOut;
}

function clampLevel(level: number) {
  return Math.max(1, Math.min(5, Math.round(level)));
}
