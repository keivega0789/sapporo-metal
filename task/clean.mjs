import { readFile } from 'fs/promises';
import path from 'path';
import { rimraf } from 'rimraf';

const constants = JSON.parse(await readFile(path.resolve('constants.json')));
const docsDir = 'docs';

const yellow = '\u001b[33m';
const green = '\u001b[32m';
const reset = '\u001b[0m';

console.log(`${yellow}Cleaning build artifacts...${reset}`);

// docsディレクトリ全体をクリーン
rimraf(docsDir).then(() => {
  console.log(`${green}Cleaned: ${docsDir}${reset}`);
});

// 開発時のmanifestのみクリーン（オプション）
// const manifest = path.join(constants.outputPath, '.vite/manifest.json');
// rimraf(manifest).then(() => {
//   console.log(`${green}Cleaned: ${manifest}${reset}`);
// });
