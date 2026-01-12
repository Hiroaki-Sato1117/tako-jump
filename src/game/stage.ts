import { CONFIG } from './config';
import type { StageConfig } from './config';
import type { Platform, Moon, Star, Water, PlatformType } from './types';

// 乱数生成（整数）
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 乱数生成（小数）
function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// 床を生成
export function generatePlatforms(stageConfig: StageConfig): Platform[] {
  const platforms: Platform[] = [];
  const blockSize = CONFIG.PLATFORM.BLOCK_SIZE;

  // 地面（一番下のフラットな床、画面幅全体）
  const groundY = CONFIG.CANVAS_HEIGHT - 50;
  const groundBlockCount = Math.ceil(CONFIG.CANVAS_WIDTH / blockSize);
  platforms.push({
    x: 0,
    y: groundY,
    width: CONFIG.CANVAS_WIDTH,
    type: 'normal',
    blockCount: groundBlockCount,
  });

  // 浮遊床の開始位置（地面より上）
  let currentY = groundY - 100;
  let lastX = CONFIG.CANVAS_WIDTH / 2;

  for (let i = 0; i < stageConfig.platformCount; i++) {
    const gap = randomInRange(stageConfig.gapMin, stageConfig.gapMax);
    currentY -= gap;

    // ブロック数を整数でランダム生成
    const blockCount = randomInt(stageConfig.blockCountMin, stageConfig.blockCountMax);
    const width = blockCount * blockSize;

    // 氷の床かどうかを判定
    const isIce = Math.random() < stageConfig.iceRatio;
    const type: PlatformType = isIce ? 'ice' : 'normal';

    // 位置を計算（到達可能な範囲内）
    const maxHorizontalJump = CONFIG.CANVAS_WIDTH * 0.5;
    const minX = Math.max(10, lastX - maxHorizontalJump);
    const maxX = Math.min(CONFIG.CANVAS_WIDTH - width - 10, lastX + maxHorizontalJump);

    // x座標をブロックサイズの倍数に揃える
    const xRaw = randomInRange(minX, maxX);
    const x = Math.round(xRaw / blockSize) * blockSize;

    platforms.push({ x, y: currentY, width, type, blockCount });
    lastX = x + width / 2;
  }

  return platforms;
}

// 月を生成
export function generateMoon(platforms: Platform[]): Moon {
  // 最も高い床の上に月を配置
  const highestPlatform = platforms.reduce((highest, p) =>
    p.y < highest.y ? p : highest
  );

  return {
    x: CONFIG.CANVAS_WIDTH / 2 - CONFIG.MOON.SIZE / 2,
    y: highestPlatform.y - 200,
    size: CONFIG.MOON.SIZE,
  };
}

// 水を初期化（画面外から開始）
export function initWater(stageConfig: StageConfig): Water {
  const groundY = CONFIG.CANVAS_HEIGHT - 50;
  return {
    y: groundY + 300, // 画面外から開始（見えない位置）
    speed: stageConfig.waterSpeed,
    isRising: false,
    waveOffset: 0,
  };
}

// 星を生成
export function generateStars(totalHeight: number): Star[] {
  const stars: Star[] = [];
  const starCount = Math.floor(totalHeight / CONFIG.CANVAS_HEIGHT * 30);

  for (let i = 0; i < starCount; i++) {
    const types: Star['type'][] = ['dot', 'cross', 'crescent', 'sparkle'];
    const type = types[Math.floor(Math.random() * types.length)];

    stars.push({
      x: Math.random() * CONFIG.CANVAS_WIDTH,
      y: -totalHeight + Math.random() * (totalHeight + CONFIG.CANVAS_HEIGHT),
      size: type === 'crescent' ? 12 : type === 'sparkle' ? 8 : randomInRange(2, 4),
      type,
    });
  }

  return stars;
}

// スコア計算
export function calculateScore(
  stageNumber: number,
  clearTime: number,
  baseTime: number
): number {
  const baseScore = CONFIG.BASE_SCORE;
  const timeBonus = Math.max(0, (baseTime - clearTime) * CONFIG.TIME_BONUS_MULTIPLIER);
  const stageMultiplier = 1 + (stageNumber - 1) * 0.5;

  return Math.floor((baseScore + timeBonus) * stageMultiplier);
}
