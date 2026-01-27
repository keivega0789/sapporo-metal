import '../styles/main.scss';
import { fixViewport, reloadAtResized } from './common.js';

// SP時のビューポートの固定
fixViewport(375);

// リサイズ時のリロード
reloadAtResized();
