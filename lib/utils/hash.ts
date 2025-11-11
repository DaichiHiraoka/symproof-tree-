/**
 * SHA-256ハッシュ生成ユーティリティ
 */

/**
 * 文字列からSHA-256ハッシュを生成
 * @param content - ハッシュ化する文字列
 * @returns SHA-256ハッシュ（16進数文字列）
 */
export async function generateSHA256Hash(content: string): Promise<string> {
  // Web Crypto APIを使用してハッシュ生成
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // ArrayBufferを16進数文字列に変換
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');

  return hashHex;
}

/**
 * 学習セッションのコンテンツハッシュを生成
 * URL、タイトル、開始時刻、終了時刻から一意のハッシュを生成
 * @param url - ページURL
 * @param title - ページタイトル
 * @param startTime - 開始時刻
 * @param endTime - 終了時刻
 * @returns SHA-256ハッシュ
 */
export async function generateSessionHash(
  url: string,
  title: string,
  startTime: Date,
  endTime: Date
): Promise<string> {
  // 正規化されたコンテンツ文字列を作成
  const content = [
    url.trim(),
    title.trim(),
    startTime.toISOString(),
    endTime.toISOString(),
  ].join('|');

  return generateSHA256Hash(content);
}

/**
 * ハッシュ値の検証
 * @param content - 検証する元の文字列
 * @param hash - 比較するハッシュ値
 * @returns ハッシュが一致する場合true
 */
export async function verifyHash(content: string, hash: string): Promise<boolean> {
  const generatedHash = await generateSHA256Hash(content);
  return generatedHash === hash;
}

/**
 * 学習セッションのハッシュ検証
 * @param url - ページURL
 * @param title - ページタイトル
 * @param startTime - 開始時刻
 * @param endTime - 終了時刻
 * @param hash - 検証するハッシュ値
 * @returns ハッシュが一致する場合true
 */
export async function verifySessionHash(
  url: string,
  title: string,
  startTime: Date,
  endTime: Date,
  hash: string
): Promise<boolean> {
  const generatedHash = await generateSessionHash(url, title, startTime, endTime);
  return generatedHash === hash;
}
