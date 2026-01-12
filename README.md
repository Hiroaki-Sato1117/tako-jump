# Tako Jump

タコがジャンプで月を目指すモバイル向けウェブゲーム

## Play

https://hiroaki-sato1117.github.io/tako-jump/

## Architecture

```
tako-jump/
├── src/
│   ├── components/
│   │   └── Game.tsx          # メインゲームコンポーネント（状態管理・ゲームループ）
│   ├── game/
│   │   ├── config.ts         # 全設定値（調整はここ）
│   │   ├── types.ts          # 型定義
│   │   ├── physics.ts        # 物理演算（重力・衝突・ジャンプ）
│   │   ├── stage.ts          # ステージ生成（床・月・星）
│   │   ├── renderer.ts       # Canvas描画
│   │   ├── storage.ts        # ハイスコア保存
│   │   └── index.ts          # エクスポート
│   ├── hooks/
│   │   ├── useGameLoop.ts    # 60fpsゲームループ
│   │   └── useKeyboardInput.ts # キーボード入力
│   └── assets/               # タコ画像（チャージ段階別）
├── docs/
│   ├── plan.md               # 開発計画
│   ├── stages.md             # ステージ設計
│   └── assets.md             # アセット仕様
└── CLAUDE.md                 # AI開発ガイドライン
```

## Config Reference

全ての調整可能なパラメータは `src/game/config.ts` に集約されています。

### Tako (タコ)
| パラメータ | 現在値 | 説明 |
|-----------|--------|------|
| `WIDTH` | 28 | タコの幅（px） |
| `HEIGHT` | 33 | タコの高さ（px） |
| `GRAVITY` | 0.35 | 重力加速度（毎フレーム） |
| `MAX_FALL_SPEED` | 10.5 | 最大落下速度 |
| `AIR_CONTROL` | 0.3 | 空中での微調整強度 |

### Jump (ジャンプ)
| パラメータ | 現在値 | 説明 |
|-----------|--------|------|
| `MAX_CHARGE_TIME` | 1000 | 最大チャージ時間（ms） |
| `MAX_VELOCITY` | 16.2 | 最大ジャンプ速度 |
| `MIN_VELOCITY` | 5.4 | 最小ジャンプ速度 |
| `MIN_ANGLE` | π×0.25 | 最小ジャンプ角度（45°） |
| `MAX_ANGLE` | π×0.75 | 最大ジャンプ角度（135°） |

### Platform (床)
| パラメータ | 現在値 | 説明 |
|-----------|--------|------|
| `BLOCK_SIZE` | 14 | 床ブロックのサイズ（px） |
| `HEIGHT` | 14 | 床の高さ（px） |

### Ice (氷の床)
| パラメータ | 現在値 | 説明 |
|-----------|--------|------|
| `FRICTION` | 0.98 | 摩擦係数（未使用） |
| `LANDING_SPEED_FACTOR` | 0.7 | 着地時の滑り速度係数 |

### Stage Settings (ステージ設定)
各ステージには以下の設定があります：

| パラメータ | 説明 |
|-----------|------|
| `platformCount` | 浮遊床の数 |
| `blockCountMin/Max` | 床のブロック数範囲 |
| `gapMin/Max` | 床間の距離範囲（px） |
| `iceRatio` | 氷の床の割合（0.0〜1.0） |
| `waterSpeed` | 水の上昇速度 |
| `waterDelay` | 水が上昇し始めるまでの遅延（ms） |
| `baseTime` | 基準クリアタイム（スコア計算用） |

## Tuning Guide

### 難易度を上げたい
- `gapMin/Max` を増やす（床間距離を広げる）
- `blockCountMin/Max` を減らす（床を狭くする）
- `waterSpeed` を上げる（追われる圧力を増やす）
- `iceRatio` を上げる（滑る床を増やす）

### 難易度を下げたい
- `gapMin/Max` を減らす（床間距離を縮める）
- `blockCountMin/Max` を増やす（床を広くする）
- `waterDelay` を増やす（準備時間を増やす）

### ジャンプ感を調整
- `GRAVITY` を減らす → 滞空時間が長くなる
- `MAX_VELOCITY` を上げる → より高く跳べる
- `HORIZONTAL_FACTOR` を調整 → 横移動距離を変更

## Key Mechanics

1. **シード固定ステージ**: 各ステージは番号でシード固定され、毎回同じ配置
2. **氷の床**: 着地角度で滑り続ける（速度一定、摩擦なし）
3. **ライフシステム**: 残機があれば同じステージからリスタート
4. **画面ループ**: 左右端でループ（右端→左端、左端→右端）

## Development

```bash
# 開発サーバー起動
npm run dev

# ビルド（型チェックなし、高速）
npm run build

# ビルド（型チェックあり）
npm run build:check

# 型チェックのみ
npm run typecheck

# デプロイ
npm run build && npx gh-pages -d dist
```

## Tech Stack

- React 18 + TypeScript
- Vite + SWC（高速ビルド）
- Canvas API（ゲーム描画）
- Tailwind CSS
