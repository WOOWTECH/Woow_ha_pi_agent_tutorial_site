# Woow HA Pi Agent 入住指南（把家裡的 AI 工作站用起來）

22 章＋3 附錄的繁體中文 [Woow HA Pi Agent add-on](https://github.com/WOOWTECH/Woow_ha_pi_agent_add_on) 教學靜態網站。從裝好 add-on、加第一家 AI 大腦、開第一個對話，一路帶到裝 Skill、用 AI 做影片、日常備份與踩雷排查。

- **讀者**：會用 Home Assistant 但沒寫過程式的智慧家庭愛好者
- **前提**：Home Assistant 已裝好可以登入（沒有的話先看《[HA 入住指南](https://woowtech.github.io/Woow_ha_tutorial_site/)》）
- **語言**：繁體中文（台灣用語）
- **授權**：CC BY 4.0

## 部署

網站部署在 GitHub Pages：**https://woowtech.github.io/Woow_ha_pi_agent_tutorial_site/**

## 本地開發

```bash
git clone https://github.com/WOOWTECH/Woow_ha_pi_agent_tutorial_site
cd Woow_ha_pi_agent_tutorial_site

# 檢查導覽與連結
node scripts/build_nav.js --check
node scripts/check_links.js

# 產生／更新 head、sidebar、pager、footer、sitemap
node scripts/build_nav.js
```

## 站內結構

單一來源：`chapters.json`（章節順序、標題、SEO copy）+ 每章 HTML 的 `<section data-nav="...">`。所有 `<head>`、側欄、上下章導覽、目錄卡片、`sitemap.xml` 都是 `scripts/build_nav.js` 產生的 —— 手動改會在下一次 CI 被覆蓋回去。

新章節寫作規範：見 [`STYLE.md`](STYLE.md)。

## 這個站是怎麼建起來的

Fork 自姐妹站《[HA 入住指南](https://github.com/WOOWTECH/Woow_ha_tutorial_site)》，共用同一套 build_nav / check_links / capture 管線與 WoowTech 品牌樣式。建站 recipe 打包在 [`authoring-woowtech-tutorial-site`](../.claude/skills/authoring-woowtech-tutorial-site) skill 裡。

## 授權與致謝

《Woow HA Pi Agent 入住指南》由 [WoowTech](https://github.com/WOOWTECH) 製作，以 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.zh-hant) 授權釋出 —— 可自由分享與改作，請保留出處。

截圖取自 Home Assistant 與 pi-web 官方介面。Home Assistant 為 Open Home Foundation 的商標，本站與其無隸屬關係。pi-web / pi coding agent 為 agegr / earendil-works 開源專案。
