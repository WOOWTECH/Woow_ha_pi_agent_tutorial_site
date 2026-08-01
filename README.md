# Home Assistant 新居入住指南（從零到能用）

7 章 zh-TW 教學靜態網站，帶你把剛裝好的 Home Assistant 從空白狀態設定到日常可用。

- 目錄頁：[`index.html`](index.html)
- 樣式：[`assets/css/style.css`](assets/css/style.css)
- 側欄章節導覽 + 章內錨點 TOC：[`assets/js/toc.js`](assets/js/toc.js)
- 全部截圖走過的活 HA：`https://woowtech-ha.woowtech.io`

## 內容

| # | 檔案 | 主題 |
|---|---|---|
| 1 | `ch1_login.html` | 登入 HA、記住我、網頁 vs. Companion App |
| 2 | `ch2_system_settings.html` | 時區、語言、單位、地理位置 |
| 3 | `ch3_floors_areas.html` | 樓層、區域、把設備放進區域 |
| 4 | `ch4_naming_labels.html` | 命名 entity、實體 ID、標籤分類 |
| 5 | `ch5_users.html` | Users vs. Persons、權限、位置追蹤 |
| 6 | `ch6_dashboard.html` | 儀表板編輯、多分頁、條件顯示 |
| 7 | `ch7_notifications.html` | Companion App、手機通知、動作按鈕 |

## 本地檢視

```bash
cd /tmp/ha_tutorial
python3 -m http.server 8080
# 瀏覽器打開 http://localhost:8080
```

或用 Node：

```bash
npx http-server -p 8080
```

## 截圖產生器（capture.js）

所有章節內的截圖都是 Playwright 從活 HA 自動抓下來，並在 DOM 上疊紅色框／箭頭／編號氣泡後才存檔的。

### 需求

- Node.js ≥ 18
- Playwright（`npm i playwright` + `npx playwright install chromium`）
- `.env` 檔（不入版控），內容：

  ```
  HA_URL=https://woowtech-ha.woowtech.io
  HA_USER=admin
  HA_PASS=您的密碼
  ```

### 執行

透過本專案內建的 playwright-skill runner：

```bash
# 全部章節
node ~/.claude/skills/playwright-skill/run.js /tmp/ha_tutorial/scripts/capture.js

# 只跑一章（可逗號多章）
node ~/.claude/skills/playwright-skill/run.js /tmp/ha_tutorial/scripts/capture.js --chapter=ch3

# 只跑一張
node ~/.claude/skills/playwright-skill/run.js /tmp/ha_tutorial/scripts/capture.js --shot=01_login_page.png
```

第一次跑會出現 UI 登入並把 session 存到 `storage_state.json`，之後直接復用。要重新登入把該檔刪掉即可。

### 新增／修改截圖

編輯 [`scripts/annotations.json`](scripts/annotations.json)。單一 shot 的欄位：

| 欄位 | 說明 |
|---|---|
| `chapter` | 子目錄名（例 `ch3`），截圖會落到 `assets/screenshots/ch3/` |
| `filename` | 檔名，須是 `.png` |
| `url` | HA 相對路徑，例如 `/config/areas/dashboard` |
| `waitFor` | CSS 選擇器，等它出現才截圖 |
| `waitMs` | 等待毫秒（HA 有很多 shadow DOM 需要 hydrate） |
| `viewport` | `{ width, height }` |
| `fresh` | `true` = 用未登入的新 context（如登入頁截圖） |
| `actions[]` | 截圖前的互動 |
| `annotations[]` | 要疊在圖上的紅色標注 |

`actions[]` 支援：

```json
{ "click": "text=Create floor" }
{ "hover": "some-selector" }
{ "press": "Escape" }
{ "type": { "selector": "input[name=x]", "text": "foo" } }
{ "wait": 2000 }
{ "waitFor": "some-selector" }
{ "url": "/config/other-page" }
```

`annotations[]` 支援三型：

```json
{ "type": "callout", "at": {"x":720,"y":40}, "number": 1, "text": "說明文字" }
{ "type": "box", "selector": "some-element" }
{ "type": "box", "at": {"x":100,"y":200}, "w": 300, "h": 60 }
{ "type": "arrow", "from": {"x":100,"y":100}, "to": {"x":300,"y":200} }
{ "type": "arrow", "from": {"x":100,"y":100}, "selector": "target-element" }
```

### 安全

> **這是活的 HA。** capture.js 只做「開啟頁面 / 開啟對話框 / 截圖 / 關閉頁面」，關頁面 = 未儲存的 draft 丟掉，不會弄壞你家設定。**請絕對不要在 `actions[]` 裡加 `text=Save` / `text=Delete` / `text=Remove` 之類的 click。**

## 部署

這是一個純靜態站，把整個目錄丟到任何靜態託管都能跑。常見選擇：

- **本專案 maintenance_portal**：把 `/tmp/ha_tutorial/` 全部搬進 `maintenance_portal/static/ha_tutorial/`，加一條 nginx location 就好。
- **Zeabur / Cloudflare Pages / Netlify**：直接指向這個資料夾。
- **內網 nginx**：`root /tmp/ha_tutorial;` + `try_files $uri $uri/ /index.html;`。

`.gitignore` 已排除 `.env`、`storage_state.json`、`node_modules/`。

## 尚未截圖的 figure

有些章節裡的 `<figure class="shot">` 目前指向還沒抓下來的檔案（例如某些對話框、進階步驟），會顯示斜線背景的佔位圖。要補上：在 `annotations.json` 加一筆對應的 shot 定義後重跑 capture.js。

## 授權

供 WoowTech 內部教學使用。
