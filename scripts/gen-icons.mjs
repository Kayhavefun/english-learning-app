// 生成 PWA 所需图标（192 / 512），纯 Node 实现，无需额外依赖。
// 设计：品牌蓝底 + 白色圆形 + 蓝色“播放”三角（呼应听力/口语）。
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public');

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return (~c) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function makePNG(size, draw) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    const off = y * (size * 4 + 1);
    raw[off] = 0;
    for (let x = 0; x < size; x++) {
      const [r, g, b] = draw(x, y, size);
      const p = off + 1 + x * 4;
      raw[p] = r;
      raw[p + 1] = g;
      raw[p + 2] = b;
      raw[p + 3] = 255;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  const idat = deflateSync(raw);
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function inCircle(cx, cy, r, x, y) {
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= r * r;
}

function inTriangle(px, py, ax, ay, bx, by, cx, cy) {
  const d1 = (px - cx) * (ay - cy) - (ax - cx) * (py - cy);
  const d2 = (px - ax) * (by - ay) - (bx - ax) * (py - ay);
  const d3 = (px - bx) * (cy - by) - (cx - bx) * (py - by);
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(hasNeg && hasPos);
}

function drawIcon(x, y, s) {
  const BLUE = [37, 99, 235];
  const WHITE = [255, 255, 255];
  const cx = s / 2;
  const cy = s / 2;
  const r = s * 0.4;
  if (inCircle(cx, cy, r, x, y)) {
    // 白色圆内画蓝色播放三角
    const ax = s * 0.42, ay = s * 0.34;
    const bx = s * 0.42, by = s * 0.66;
    const ccx = s * 0.66, ccy = s * 0.5;
    if (inTriangle(x, y, ax, ay, bx, by, ccx, ccy)) return BLUE;
    return WHITE;
  }
  return BLUE;
}

for (const size of [192, 512]) {
  const png = makePNG(size, drawIcon);
  writeFileSync(join(OUT, `icon-${size}.png`), png);
  console.log(`wrote icon-${size}.png (${png.length} bytes)`);
}
