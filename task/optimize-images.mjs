import chokidar from 'chokidar';
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { optimize } from 'svgo';
const constants = JSON.parse(await fs.readFile(path.resolve('constants.json')));

const inputDir = `src/images`; // 入力フォルダ
const outputDir = `${constants.outputPath}../images`; // 出力フォルダ

const args = process.argv.slice(2);
const isPersistent = !args.includes('--no-watch'); // --no-persistent 引数が無ければ persistent: true とする

// 文字色
const green = '\u001b[32m';
const yellow = '\u001b[33m';
const red = '\u001b[31m';
const reset = '\u001b[0m';

// 監視用のchokidar watcher
const watcher = chokidar.watch(inputDir, {
  ignored: /(^|[\/\\])\../,
  persistent: isPersistent
});

// SVGの最適化
const optimizeSvg = async (filePath, outputPath) => {
  const svgCode = await fs.readFile(filePath, 'utf-8');
  const result = optimize(svgCode, {
    path: filePath,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false // ViewBoxを削除しない
          }
        }
      }
    ]
  });

  if ('data' in result) {
    await fs.writeFile(outputPath, result.data);
  }
};

// 画像圧縮処理
const compressImage = async (filePath) => {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const relativePath = path.relative(inputDir, filePath); // 入力パスから相対パスを取得
    const outputFilePath = path.join(outputDir, relativePath); // 出力先ファイルのパス
    const outputDirPath = path.dirname(outputFilePath); // 出力先ディレクトリ

    // 出力先ディレクトリがない場合は作成
    try {
      await fs.mkdir(outputDirPath, { recursive: true });
    } catch (error) {
      console.log(`${red} Error compressing ${outputDirPath}:${reset}`, error);
    }
    await fs.mkdir(outputDirPath, { recursive: true });

    // SVGの場合、svgoで圧縮
    if (ext === '.svg') {
      await optimizeSvg(filePath, outputFilePath);
      console.log(`${green}Optimized SVG:${reset} ${filePath}`);
      return;
    }

    // .icoと.json はそのまま出力
    if (ext === '.ico' || ext === '.json') {
      await fs.copyFile(filePath, outputFilePath);
      return;
    }

    // 画像圧縮を実行
    const image = sharp(filePath);

    switch (ext) {
      case '.jpg':
      case '.jpeg':
        await image.jpeg({ quality: 80, mozjpeg: true }).toFile(outputFilePath);
        break;
      case '.png':
        await image.png({ quality: 80, compressionLevel: 8 }).toFile(outputFilePath);
        break;
      case '.webp':
        await image.webp({ quality: 80 }).toFile(outputFilePath);
        break;
      case '.avif':
        await image.avif({ quality: 50 }).toFile(outputFilePath);
        break;
      case '.tiff':
        await image.tiff({ quality: 80 }).toFile(outputFilePath);
        break;
      default:
        console.log(`${yellow}Skipped (unsupported type):${reset} ${filePath}`);
        return;
    }

    console.log(`${green}Compressed:${reset} ${filePath}`);
  } catch (error) {
    console.log(`${red} Error compressing ${filePath}:${reset}`, error);
  }
};

// watcherでのファイル変更監視
watcher
  .on('ready', () => console.log('Watching for image changes...'))
  .on('add', compressImage)
  .on('change', compressImage)
  .on('unlink', async (filePath) => {
    const relativePath = path.relative(inputDir, filePath);
    const outputFilePath = path.join(outputDir, relativePath);
    try {
      await fs.unlink(outputFilePath);
      console.log(`${yellow}Deleted:${reset} ${outputFilePath}`);
    } catch (error) {
      console.log(`${red} Failed to delete ${outputFilePath}:${reset}`, error);
    }
  });
