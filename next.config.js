/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // sssAndDaoExampleディレクトリを除外
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/sssAndDaoExample/**', '**/.kiro/**', '**/.claude/**'],
    };

    // WebAssemblyサポートを有効化
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // クライアントサイドでNode.js組み込みモジュールを無効化
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };

      // symbol-crypto-wasm-node を symbol-crypto-wasm-web に置き換え
      config.resolve.alias = {
        ...config.resolve.alias,
        'symbol-crypto-wasm-node': 'symbol-crypto-wasm-web',
      };
    }

    return config;
  },
}

module.exports = nextConfig
