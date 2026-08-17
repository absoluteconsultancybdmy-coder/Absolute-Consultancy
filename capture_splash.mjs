import puppeteer from 'puppeteer-core';
import { mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const URL = 'http://localhost:3000/Absolute-Consultancy/?replay=1';
const OUT_DIR = 'C:\\Users\\ifat\\AppData\\Local\\Temp\\opencode\\splash_capture';
const FPS = 30;
const DURATION_MS = 8500;
const VIEWPORT_W = 1280;
const VIEWPORT_H = 720;

if (existsSync(OUT_DIR)) rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  protocolTimeout: 300000,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--hide-scrollbars',
    '--enable-features=VaapiVideoDecoder',
    '--use-gl=swiftshader',
  ],
  defaultViewport: { width: VIEWPORT_W, height: VIEWPORT_H },
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: VIEWPORT_W, height: VIEWPORT_H, deviceScaleFactor: 1 });

  await page.emulateMediaFeatures([
    { name: 'prefers-reduced-motion', value: 'no-preference' },
    { name: 'prefers-color-scheme', value: 'light' },
  ]);

  await page.evaluateOnNewDocument(() => {
    try {
      sessionStorage.clear();
      localStorage.clear();
    } catch (e) { /* noop */ }
  });

  console.log('Loading page...');
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('[role="status"][aria-label="Loading Absolute Consultancy"]', { timeout: 5000 });
  console.log('Splash detected. Starting capture...');
  await new Promise(r => setTimeout(r, 100));

  const totalFrames = Math.ceil((DURATION_MS / 1000) * FPS);
  const startTs = Date.now();
  const frameDelay = 1000 / FPS;

  for (let i = 0; i < totalFrames; i++) {
    const targetTs = startTs + i * frameDelay;
    const wait = Math.max(0, targetTs - Date.now());
    if (wait > 0) {
      await new Promise(r => setTimeout(r, wait));
    }
    const framePath = join(OUT_DIR, `frame_${String(i).padStart(4, '0')}.jpg`);
    await page.screenshot({ path: framePath, type: 'jpeg', quality: 88, timeout: 30000 });
    if (i % 30 === 0) {
      const elapsed = ((Date.now() - startTs) / 1000).toFixed(2);
      console.log(`  frame ${i}/${totalFrames}  t=${elapsed}s`);
    }
  }

  console.log(`Captured ${totalFrames} frames to ${OUT_DIR}`);
} finally {
  await browser.close();
}

const videoOut = 'C:\\Users\\ifat\\Documents\\Absolute_Consultancy_FINAL\\public\\splash-preview.mp4';
const ffmpegCmd = `ffmpeg -y -framerate ${FPS} -i "${OUT_DIR}\\frame_%04d.jpg" -c:v libx264 -pix_fmt yuv420p -crf 18 -preset slow -movflags +faststart "${videoOut}"`;
console.log('Running ffmpeg...');
execSync(ffmpegCmd, { stdio: 'inherit' });
console.log(`Video saved to: ${videoOut}`);
