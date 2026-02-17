import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/sapporo-metal/' : '/',
  publicDir: 'public', // 明示的に指定（デフォルトだが念のため）
  css: {
    devSourcemap: true,
  },
  build: {
    outDir: 'docs',
    emptyOutDir: true, // ビルド前にdocsを空にする
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
        company: path.resolve(__dirname, 'company.html'),
      },
      output: {
        assetFileNames: assetInfo => {
          // 画像ファイルはimages/に配置
          if (/\.(png|jpe?g|svg|gif|webp|avif|ico)$/i.test(assetInfo.name)) {
            return 'assets/images/[name][extname]';
          }
          // CSSとその他のアセット
          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    assetsInlineLimit: 0, // 画像を全てファイルとして出力（Base64化しない）
  },
  server: {
    open: true,
    host: true,
  },
});
