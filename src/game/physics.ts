import { CONFIG } from './config';
import type { Tako, Platform, Moon, Water, Position } from './types';

// 重力を適用
export function applyGravity(tako: Tako): Tako {
  if (tako.state === 'dead') return tako;

  const newVelocityY = Math.min(
    tako.velocity.y + CONFIG.TAKO.GRAVITY,
    CONFIG.TAKO.MAX_FALL_SPEED
  );

  return {
    ...tako,
    velocity: { ...tako.velocity, y: newVelocityY },
  };
}

// 位置を更新
export function updatePosition(tako: Tako): Tako {
  return {
    ...tako,
    position: {
      x: tako.position.x + tako.velocity.x,
      y: tako.position.y + tako.velocity.y,
    },
  };
}

// 床との衝突判定（高速落下時のすり抜け対策強化）
export function checkPlatformCollision(
  tako: Tako,
  platforms: Platform[],
  _cameraY: number
): { tako: Tako; landed: boolean; landedPlatform: Platform | null } {
  const takoBottom = tako.position.y + CONFIG.TAKO.HEIGHT;
  const takoLeft = tako.position.x;
  const takoRight = tako.position.x + CONFIG.TAKO.WIDTH;

  // 落下中のみ判定
  if (tako.velocity.y <= 0) {
    return { tako, landed: false, landedPlatform: null };
  }

  // 前フレームの位置を計算
  const prevBottom = takoBottom - tako.velocity.y;

  for (const platform of platforms) {
    const platTop = platform.y;
    const platBottom = platform.y + CONFIG.PLATFORM.HEIGHT;
    const platLeft = platform.x;
    const platRight = platform.x + platform.width;

    // 横方向の重なり（少し余裕を持たせる）
    const horizontalOverlap = takoRight > platLeft + 2 && takoLeft < platRight - 2;

    if (!horizontalOverlap) continue;

    // 上から着地判定（改良版）
    // 条件1: 前フレームで床の上にいた
    // 条件2: 現フレームで床を通過した、または床の上部に接触している
    const wasAbove = prevBottom <= platTop + 4; // 少し余裕を持たせる
    const nowAtOrBelow = takoBottom >= platTop;
    const notTooDeep = takoBottom < platBottom + tako.velocity.y; // 床を完全にすり抜けていない

    if (wasAbove && nowAtOrBelow && notTooDeep) {
      const isIce = platform.type === 'ice';
      // 氷の床: 着地時の速度を0.7倍にして滑り開始
      const newVelocityX = isIce
        ? tako.velocity.x * CONFIG.ICE.LANDING_SPEED_FACTOR
        : 0;

      return {
        tako: {
          ...tako,
          position: { ...tako.position, y: platTop - CONFIG.TAKO.HEIGHT },
          velocity: { x: newVelocityX, y: 0 },
          state: 'idle',
          isGrounded: true,
          airChargeLockedVelocityX: null,
        },
        landed: true,
        landedPlatform: platform,
      };
    }
  }

  return { tako, landed: false, landedPlatform: null };
}

// 氷の床上での滑り処理（速度は一定を保つ - 摩擦なし）
export function applyIceFriction(tako: Tako, _platform: Platform | null): Tako {
  // 氷の床上では速度を変更しない（一度滑り出したら速度一定）
  // 着地時のx速度がそのまま維持される
  return tako;
}

// 画面端のループ（右端→左端、左端→右端）
export function wrapScreen(tako: Tako): Tako {
  let newX = tako.position.x;

  // 右端を超えたら左端から出てくる
  if (newX > CONFIG.CANVAS_WIDTH) {
    newX = -CONFIG.TAKO.WIDTH;
  }
  // 左端を超えたら右端から出てくる
  else if (newX < -CONFIG.TAKO.WIDTH) {
    newX = CONFIG.CANVAS_WIDTH;
  }

  // 速度はそのまま維持（角度を保持）
  return {
    ...tako,
    position: { ...tako.position, x: newX },
  };
}

// 月との衝突判定
export function checkMoonCollision(tako: Tako, moon: Moon): boolean {
  const takoCenterX = tako.position.x + CONFIG.TAKO.WIDTH / 2;
  const takoCenterY = tako.position.y + CONFIG.TAKO.HEIGHT / 2;
  const moonCenterX = moon.x + moon.size / 2;
  const moonCenterY = moon.y + moon.size / 2;

  const dx = takoCenterX - moonCenterX;
  const dy = takoCenterY - moonCenterY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance < (CONFIG.TAKO.WIDTH / 2 + moon.size / 2) * 0.7;
}

// 水との衝突判定
export function checkWaterCollision(tako: Tako, water: Water): boolean {
  const takoBottom = tako.position.y + CONFIG.TAKO.HEIGHT;
  return takoBottom > water.y;
}

// ジャンプ計算
export function calculateJump(
  chargeRatio: number,
  startPos: Position,
  endPos: Position
): { vx: number; vy: number; facingRight: boolean } {
  // 方向ベクトル
  const dx = endPos.x - startPos.x;
  const dy = endPos.y - startPos.y;

  // 角度を計算（上方向を基準）
  let angle = Math.atan2(-dy, dx);

  // 角度を制限（45度〜135度）
  if (angle < CONFIG.JUMP.MIN_ANGLE) {
    angle = CONFIG.JUMP.MIN_ANGLE;
  } else if (angle > CONFIG.JUMP.MAX_ANGLE) {
    angle = CONFIG.JUMP.MAX_ANGLE;
  }

  // ドラッグ距離が短い場合は真上にジャンプ
  const dragDistance = Math.sqrt(dx * dx + dy * dy);
  if (dragDistance < 20) {
    angle = Math.PI / 2; // 真上
  }

  // ジャンプ力
  const power = CONFIG.JUMP.MIN_VELOCITY +
    (CONFIG.JUMP.MAX_VELOCITY - CONFIG.JUMP.MIN_VELOCITY) * chargeRatio;

  return {
    vx: power * Math.cos(angle),
    vy: -power * Math.sin(angle),
    facingRight: dx >= 0,
  };
}
