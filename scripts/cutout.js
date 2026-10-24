import fs from 'fs';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';

const jpegData = fs.readFileSync('public/images/coatphoto.jpg');
const rawImage = jpeg.decode(jpegData, { useTArray: true });
const { width, height, data } = rawImage;

const png = new PNG({ width, height });
const isBg = new Uint8Array(width * height);
const visited = new Uint8Array(width * height);

const getIdx = (x, y) => y * width + x;

const isWhitePixel = (r, g, b) => {
  // studio background is neutral white/light grey (r,g,b > 190)
  return r > 190 && g > 190 && b > 190 && Math.abs(r - g) < 25 && Math.abs(r - b) < 25;
};

const queue = [];

for (let x = 0; x < width; x++) {
  queue.push([x, 0]);
  visited[getIdx(x, 0)] = 1;
}
for (let y = 0; y < height; y++) {
  if (!visited[getIdx(0, y)]) {
    queue.push([0, y]);
    visited[getIdx(0, y)] = 1;
  }
  if (!visited[getIdx(width - 1, y)]) {
    queue.push([width - 1, y]);
    visited[getIdx(width - 1, y)] = 1;
  }
}

let head = 0;
while (head < queue.length) {
  const [cx, cy] = queue[head++];
  const pIdx = (cy * width + cx) * 4;
  const r = data[pIdx];
  const g = data[pIdx + 1];
  const b = data[pIdx + 2];

  if (isWhitePixel(r, g, b)) {
    isBg[getIdx(cx, cy)] = 1;

    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = getIdx(nx, ny);
        if (!visited[nIdx]) {
          visited[nIdx] = 1;
          queue.push([nx, ny]);
        }
      }
    }
  }
}

// Write to PNG with edge decontamination to avoid white halo
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = getIdx(x, y);
    const pIdx = idx * 4;
    let r = data[pIdx];
    let g = data[pIdx + 1];
    let b = data[pIdx + 2];

    if (isBg[idx] === 1) {
      png.data[pIdx] = 0;
      png.data[pIdx + 1] = 0;
      png.data[pIdx + 2] = 0;
      png.data[pIdx + 3] = 0;
    } else {
      // Check distance to background for soft feathering
      let minBgDist = 999;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            if (isBg[getIdx(nx, ny)] === 1) {
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < minBgDist) minBgDist = dist;
            }
          }
        }
      }

      if (minBgDist < 1.8) {
        // Feather alpha
        const alphaFraction = minBgDist / 1.8;
        // Edge decontamination: if pixel is unusually bright near hair/edge, tone it down to remove white halo
        if (r > 140 && g > 140 && b > 140) {
          r = Math.round(r * 0.5 + 20);
          g = Math.round(g * 0.5 + 20);
          b = Math.round(b * 0.5 + 20);
        }
        png.data[pIdx] = r;
        png.data[pIdx + 1] = g;
        png.data[pIdx + 2] = b;
        png.data[pIdx + 3] = Math.round(alphaFraction * 255);
      } else {
        png.data[pIdx] = r;
        png.data[pIdx + 1] = g;
        png.data[pIdx + 2] = b;
        png.data[pIdx + 3] = 255;
      }
    }
  }
}

const buffer = PNG.sync.write(png);
fs.writeFileSync('public/images/coatphoto_cutout.png', buffer);
fs.writeFileSync('src/assets/images/coatphoto_cutout.png', buffer);
console.log('Saved optimized cutout to public and src/assets!');
