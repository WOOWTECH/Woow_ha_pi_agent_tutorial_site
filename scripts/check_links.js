#!/usr/bin/env node
/**
 * check_links.js — 站內連結／圖片／錨點健檢（無外部相依，CI 用）。
 *
 *   node scripts/check_links.js
 *
 * 檢查項目：
 *   1. 所有 href/src 指向的站內檔案確實存在
 *   2. 所有 #anchor 在該頁有對應的 id
 *   3. 同一頁沒有重複的 id
 *   4. 每個 <section id> 都有 data-nav（build_nav.js 產生側欄要用）
 *   5. chapters.json 列出的檔案都存在，且 sitemap.xml 有涵蓋每一頁
 *
 * 有任何錯誤就 exit 1。
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'chapters.json'), 'utf8'));
const BASE_PREFIX = new URL(cfg.site.baseUrl).pathname.replace(/\/$/, '') + '/'; // /Woow_ha_tutorial_site/

const errors = [];
const htmlFiles = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html')).sort();

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');

  // 1. 站內檔案
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    let target = m[1];
    if (/^(https?:|mailto:|data:|\/\/|#)/.test(target)) continue;
    target = target.split('#')[0];
    if (!target) continue;
    if (target.startsWith(BASE_PREFIX)) target = target.slice(BASE_PREFIX.length) || 'index.html';
    else if (target.startsWith('/')) target = target.slice(1) || 'index.html';
    if (target.endsWith('/')) target += 'index.html';
    if (!fs.existsSync(path.join(ROOT, target))) {
      errors.push(`${file}: 連結指向不存在的檔案 → ${m[1]}`);
    }
  }

  // 2 & 3. 錨點與重複 id
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  [...new Set(dupes)].forEach((id) => errors.push(`${file}: 重複的 id="${id}"`));

  for (const m of html.matchAll(/href="#([^"]+)"/g)) {
    if (!ids.includes(m[1])) errors.push(`${file}: 錨點 #${m[1]} 在本頁沒有對應的 id`);
  }

  // 4. section 一定要有 data-nav
  for (const m of html.matchAll(/<section id="([^"]+)"(?![^>]*data-nav)/g)) {
    errors.push(`${file}: <section id="${m[1]}"> 缺 data-nav（側欄產不出這個項目）`);
  }
}

// 5. chapters.json ↔ 檔案 ↔ sitemap
const listed = [...cfg.chapters, ...cfg.appendices].map((c) => c.file);
listed.forEach((f) => {
  if (!fs.existsSync(path.join(ROOT, f))) errors.push(`chapters.json 列了不存在的檔案 → ${f}`);
});

const orphans = htmlFiles.filter((f) => !listed.includes(f) && !['index.html', '404.html'].includes(f));
orphans.forEach((f) => errors.push(`${f}: 存在於 repo 但 chapters.json 沒列，不會出現在任何導覽`));

if (fs.existsSync(path.join(ROOT, 'sitemap.xml'))) {
  const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  ['index.html', ...listed].forEach((f) => {
    const loc = cfg.site.baseUrl.replace(/\/$/, '') + '/' + (f === 'index.html' ? '' : f);
    if (!sitemap.includes(`<loc>${loc}</loc>`)) errors.push(`sitemap.xml 沒有涵蓋 ${f}`);
  });
} else {
  errors.push('缺少 sitemap.xml（跑 node scripts/build_nav.js 產生）');
}

if (errors.length) {
  console.error(`\n✗ 發現 ${errors.length} 個問題：`);
  errors.forEach((e) => console.error('  · ' + e));
  process.exit(1);
}

console.log(`✓ ${htmlFiles.length} 個頁面的站內連結、錨點、id 與 sitemap 都正常`);
