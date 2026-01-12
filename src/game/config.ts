// ゲーム設定
export const CONFIG = {
  // 画面
  CANVAS_WIDTH: 390,
  CANVAS_HEIGHT: 844,

  // タコ（画面幅の1/14）
  TAKO: {
    WIDTH: 28,
    HEIGHT: 33,
    GRAVITY: 0.35, // 0.5 * 0.7 = 0.35（落下速度を0.7倍に）
    MAX_FALL_SPEED: 10.5, // 15 * 0.7 = 10.5（落下速度を0.7倍に）
    AIR_CONTROL: 0.3,
  },

  // ジャンプ
  JUMP: {
    MAX_CHARGE_TIME: 1000,
    MAX_VELOCITY: 16.2, // 18 * 0.9 = 16.2（ジャンプ速度を0.9倍に）
    MIN_VELOCITY: 5.4, // 6 * 0.9 = 5.4
    MIN_ANGLE: Math.PI * 0.25,
    MAX_ANGLE: Math.PI * 0.75,
  },

  // 床（ブロックはタコ幅の半分の正方形）
  PLATFORM: {
    BLOCK_SIZE: 14,
    HEIGHT: 14,
  },

  // 月（ゴール）
  MOON: {
    SIZE: 80,
  },

  // 水
  WATER: {
    WAVE_HEIGHT: 12,
    WAVE_SPEED: 0.05,
    FOAM_SIZE: 4, // 飛沫のサイズ（1/4に縮小: 8px * 0.5 = 4px、面積1/4）
  },

  // カラーパレット
  COLORS: {
    BACKGROUND: '#2D2A5A',
    PLATFORM: '#E8A87C',
    PLATFORM_LIGHT: '#F0C8A8',
    GROUND: '#1E1B3A',
    GROUND_LINE: '#3D3A6A',
    WATER: '#660099',
    MOON: '#FFD93D',
    STAR: '#9B8AC4',
    STAR_BRIGHT: '#C9B8E0',
    CRESCENT: '#7B68A6',
    UI_BG: 'rgba(0, 0, 0, 0.8)',
    UI_BORDER: '#FFFFFF',
  },

  // 氷の足場設定
  ICE: {
    FRICTION: 0.98,
    COLOR: '#87CEEB',
    COLOR_LIGHT: '#B0E0E6',
  },

  // ステージ設定
  // 新ジャンプ高さ ≈ 16.2^2 / (2 * 0.35) ≈ 375px
  // ステージ高さ = 12ジャンプ分 ≈ 4500px ≈ 5.3画面分
  STAGES: [
    {
      id: 1,
      name: 'Tutorial',
      totalHeight: 5.3,
      platformCount: 12,
      blockCountMin: 10,
      blockCountMax: 14,
      gapMin: 200,
      gapMax: 280,
      iceRatio: 0,
      waterSpeed: 0.6, // 0.3 * 2 = 0.6（2倍速）
      waterDelay: 8000,
      baseTime: 45,
    },
    {
      id: 2,
      name: 'Challenge',
      totalHeight: 5.3,
      platformCount: 12,
      blockCountMin: 6,
      blockCountMax: 12,
      gapMin: 220,
      gapMax: 300,
      iceRatio: 0,
      waterSpeed: 0.8, // 0.4 * 2 = 0.8
      waterDelay: 6000,
      baseTime: 50,
    },
    {
      id: 3,
      name: 'Ice Intro',
      totalHeight: 5.3,
      platformCount: 12,
      blockCountMin: 6,
      blockCountMax: 10,
      gapMin: 200,
      gapMax: 280,
      iceRatio: 0.3,
      waterSpeed: 1.0, // 0.5 * 2 = 1.0
      waterDelay: 5000,
      baseTime: 55,
    },
    {
      id: 4,
      name: 'Slippery',
      totalHeight: 5.3,
      platformCount: 12,
      blockCountMin: 5,
      blockCountMax: 9,
      gapMin: 180,
      gapMax: 260,
      iceRatio: 0.6,
      waterSpeed: 1.1, // 0.55 * 2 = 1.1
      waterDelay: 5000,
      baseTime: 60,
    },
    {
      id: 5,
      name: 'Frozen',
      totalHeight: 5.3,
      platformCount: 12,
      blockCountMin: 4,
      blockCountMax: 8,
      gapMin: 160,
      gapMax: 240,
      iceRatio: 1.0,
      waterSpeed: 1.4, // 0.7 * 2 = 1.4
      waterDelay: 3000,
      baseTime: 65,
    },
  ],

  // ゲームシステム
  LIVES: 3,
  BASE_SCORE: 1000,
  TIME_BONUS_MULTIPLIER: 10,
} as const;

export type StageConfig = typeof CONFIG.STAGES[number];
