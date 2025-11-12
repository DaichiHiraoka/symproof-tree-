/**
 * 学習ツリーテスト用の大規模モックデータジェネレーター
 * Phase 5.6テスト: ポーラーレイアウトの検証用
 */

import { ConfirmedRecord } from '@/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * 学習記録のテンプレート（カテゴリ別）
 */
const LEARNING_RECORDS = {
  'JavaScript': [
    { title: 'JavaScript基礎 - 変数とデータ型', url: 'https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Grammar_and_types', level: 1 },
    { title: 'JavaScript関数の基本', url: 'https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Functions', level: 1 },
    { title: 'JavaScript配列メソッド完全ガイド', url: 'https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array', level: 2 },
    { title: 'JavaScriptオブジェクト指向プログラミング', url: 'https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Working_with_Objects', level: 2 },
    { title: 'ES6の新機能 - let, const, アロー関数', url: 'https://qiita.com/topics/es6', level: 2 },
    { title: 'JavaScriptの非同期処理入門', url: 'https://developer.mozilla.org/ja/docs/Learn/JavaScript/Asynchronous', level: 3 },
    { title: 'Promise完全理解', url: 'https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise', level: 3 },
    { title: 'async/awaitで非同期処理をシンプルに', url: 'https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/async_function', level: 3 },
    { title: 'JavaScriptクロージャの詳解', url: 'https://developer.mozilla.org/ja/docs/Web/JavaScript/Closures', level: 4 },
    { title: 'JavaScriptイベントループとタスクキュー', url: 'https://javascript.info/event-loop', level: 4 },
  ],
  'TypeScript': [
    { title: 'TypeScript入門 - JavaScriptとの違い', url: 'https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html', level: 2 },
    { title: 'TypeScript基本型の使い方', url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html', level: 2 },
    { title: 'TypeScriptインターフェースとタイプエイリアス', url: 'https://www.typescriptlang.org/docs/handbook/2/objects.html', level: 2 },
    { title: 'TypeScriptジェネリクス入門', url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html', level: 3 },
    { title: 'TypeScript型推論の仕組み', url: 'https://www.typescriptlang.org/docs/handbook/type-inference.html', level: 3 },
    { title: 'TypeScript Utility Types活用法', url: 'https://www.typescriptlang.org/docs/handbook/utility-types.html', level: 4 },
    { title: 'TypeScript Conditional Types完全ガイド', url: 'https://www.typescriptlang.org/docs/handbook/2/conditional-types.html', level: 4 },
    { title: 'TypeScript Mapped Types詳解', url: 'https://www.typescriptlang.org/docs/handbook/2/mapped-types.html', level: 4 },
    { title: 'TypeScript Template Literal Types', url: 'https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html', level: 5 },
  ],
  'React/Next.js': [
    { title: 'HTML/CSS基礎 - Webページの構造', url: 'https://developer.mozilla.org/ja/docs/Learn/HTML', level: 1 },
    { title: 'CSSレイアウト入門 - FlexboxとGrid', url: 'https://developer.mozilla.org/ja/docs/Learn/CSS/CSS_layout', level: 1 },
    { title: 'React入門 - コンポーネントの基礎', url: 'https://ja.react.dev/learn', level: 2 },
    { title: 'ReactのJSX記法を理解する', url: 'https://ja.react.dev/learn/writing-markup-with-jsx', level: 2 },
    { title: 'React Hooks - useStateの使い方', url: 'https://ja.react.dev/reference/react/useState', level: 3 },
    { title: 'React Hooks - useEffectで副作用を扱う', url: 'https://ja.react.dev/reference/react/useEffect', level: 3 },
    { title: 'React useContextでグローバル状態管理', url: 'https://ja.react.dev/reference/react/useContext', level: 3 },
    { title: 'React カスタムHooksの作成', url: 'https://ja.react.dev/learn/reusing-logic-with-custom-hooks', level: 4 },
    { title: 'Next.js入門 - App Routerの基礎', url: 'https://nextjs.org/docs/app', level: 3 },
    { title: 'Next.js Server Componentsの理解', url: 'https://nextjs.org/docs/app/building-your-application/rendering/server-components', level: 4 },
    { title: 'Next.js Server Actionsでフォーム処理', url: 'https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations', level: 4 },
    { title: 'Next.js ルーティングとレイアウト', url: 'https://nextjs.org/docs/app/building-your-application/routing', level: 3 },
    { title: 'React Suspenseとストリーミング', url: 'https://ja.react.dev/reference/react/Suspense', level: 4 },
    { title: 'React パフォーマンス最適化テクニック', url: 'https://ja.react.dev/learn/render-and-commit', level: 5 },
  ],
  'CSS/Design': [
    { title: 'Tailwind CSS入門', url: 'https://tailwindcss.com/docs/installation', level: 2 },
    { title: 'Tailwind CSSユーティリティクラス活用', url: 'https://tailwindcss.com/docs/utility-first', level: 2 },
    { title: 'CSSアニメーション基礎', url: 'https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Animations', level: 2 },
    { title: 'レスポンシブデザインの実装', url: 'https://developer.mozilla.org/ja/docs/Learn/CSS/CSS_layout/Responsive_Design', level: 2 },
    { title: 'CSSグリッドレイアウト完全ガイド', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/', level: 3 },
    { title: 'CSS変数（カスタムプロパティ）活用', url: 'https://developer.mozilla.org/ja/docs/Web/CSS/Using_CSS_custom_properties', level: 3 },
    { title: 'CSSコンテナクエリ入門', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries', level: 4 },
  ],
  'Backend': [
    { title: 'Node.js入門 - サーバーサイドJavaScript', url: 'https://nodejs.org/en/docs/guides/getting-started-guide/', level: 2 },
    { title: 'Express.js基礎 - ルーティングとミドルウェア', url: 'https://expressjs.com/ja/guide/routing.html', level: 2 },
    { title: 'REST API設計のベストプラクティス', url: 'https://restfulapi.net/', level: 2 },
    { title: 'Node.jsストリーム処理', url: 'https://nodejs.org/api/stream.html', level: 3 },
    { title: 'データベース設計の基礎', url: 'https://www.postgresql.org/docs/current/tutorial.html', level: 2 },
    { title: 'MongoDBとNoSQL入門', url: 'https://www.mongodb.com/docs/manual/tutorial/', level: 3 },
    { title: 'GraphQL API構築ガイド', url: 'https://graphql.org/learn/', level: 4 },
  ],
  'Blockchain': [
    { title: 'ブロックチェーン基礎 - 仕組みを理解する', url: 'https://bitcoin.org/bitcoin.pdf', level: 1 },
    { title: 'Web3とは何か - 分散型Webの概要', url: 'https://ethereum.org/en/web3/', level: 1 },
    { title: 'スマートコントラクト入門', url: 'https://ethereum.org/en/developers/docs/smart-contracts/', level: 3 },
    { title: 'Symbol Blockchain概要', url: 'https://docs.symbol.dev/', level: 4 },
    { title: 'Symbol SDKでトランザクション送信', url: 'https://docs.symbol.dev/guides/transfer/sending-a-transfer-transaction.html', level: 4 },
    { title: 'Symbol Mosaicの作成と管理', url: 'https://docs.symbol.dev/guides/mosaic/', level: 4 },
    { title: 'Symbol アグリゲートトランザクション', url: 'https://docs.symbol.dev/guides/aggregate/', level: 5 },
  ],
  'その他': [
    { title: 'Git入門 - バージョン管理の基礎', url: 'https://git-scm.com/book/ja/v2', level: 1 },
    { title: 'GitHubでのチーム開発フロー', url: 'https://docs.github.com/ja/get-started', level: 2 },
    { title: 'アルゴリズムとデータ構造', url: 'https://www.geeksforgeeks.org/data-structures/', level: 2 },
    { title: 'ソート アルゴリズム比較', url: 'https://www.toptal.com/developers/sorting-algorithms', level: 3 },
  ],
};

/**
 * ランダムな日付を生成（過去1年間）
 */
function randomDate(minDaysAgo: number = 365, maxDaysAgo: number = 0): Date {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * (minDaysAgo - maxDaysAgo)) + maxDaysAgo;
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return date;
}

/**
 * ランダムな学習時間を生成（5分～120分）
 */
function randomDuration(): number {
  const minutes = Math.floor(Math.random() * 115) + 5;
  return minutes * 60 * 1000; // ミリ秒に変換
}

/**
 * 大規模モックデータを生成
 */
export function generateMockConfirmedRecords(count: number = 50): ConfirmedRecord[] {
  const records: ConfirmedRecord[] = [];
  const categories = Object.keys(LEARNING_RECORDS);

  for (let i = 0; i < count; i++) {
    // ランダムにカテゴリを選択
    const category = categories[Math.floor(Math.random() * categories.length)];
    const categoryRecords = LEARNING_RECORDS[category as keyof typeof LEARNING_RECORDS];

    // そのカテゴリからランダムにレコードを選択
    const template = categoryRecords[Math.floor(Math.random() * categoryRecords.length)];

    const startTime = randomDate();
    const duration = randomDuration();
    const endTime = new Date(startTime.getTime() + duration);

    records.push({
      id: uuidv4(),
      session: {
        url: template.url,
        title: template.title,
        startTime,
        endTime,
        duration,
        tabId: Math.floor(Math.random() * 1000),
        windowId: Math.floor(Math.random() * 10),
      },
      transactionHash: 'MOCK_' + uuidv4().replace(/-/g, '').toUpperCase(),
      blockHeight: Math.floor(Math.random() * 1000000) + 5000000,
      timestamp: new Date(startTime.getTime() + duration + 60000), // 確認まで1分
      signerAddress: 'TBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      verified: true,
    });
  }

  // 日付順にソート（古い順）
  return records.sort((a, b) => a.session.startTime.getTime() - b.session.startTime.getTime());
}

/**
 * カテゴリバランスを考慮したモックデータ生成
 */
export function generateBalancedMockRecords(): ConfirmedRecord[] {
  const records: ConfirmedRecord[] = [];

  // 各カテゴリから均等に生成
  Object.entries(LEARNING_RECORDS).forEach(([category, templates]) => {
    templates.forEach((template, index) => {
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() - (templates.length - index) * 7); // 1週間間隔

      const startTime = new Date(baseDate);
      const duration = randomDuration();
      const endTime = new Date(startTime.getTime() + duration);

      records.push({
        id: uuidv4(),
        session: {
          url: template.url,
          title: template.title,
          startTime,
          endTime,
          duration,
          tabId: Math.floor(Math.random() * 1000),
          windowId: Math.floor(Math.random() * 10),
        },
        transactionHash: 'MOCK_' + uuidv4().replace(/-/g, '').toUpperCase(),
        blockHeight: Math.floor(Math.random() * 1000000) + 5000000,
        timestamp: new Date(startTime.getTime() + duration + 60000),
        signerAddress: 'TBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
        verified: true,
      });
    });
  });

  return records.sort((a, b) => a.session.startTime.getTime() - b.session.startTime.getTime());
}
