# QWER Stage Notes

繁體中文非官方 QWER 樂團與音樂介紹網站。本專案以 **AGENTS.md → 來源紀錄 → Markdown Wiki → Astro 共用版型** 的流程建立可持續擴充的網站。

資料盤點截止 **2026-11-09**；程式與交付整理於 2026-11-10 完成。**目前正準備部署至使用者指定的 [GitHub Repository](https://github.com/Eugene-xyz/Generative-AI-Text-and-Image-Synthesis-Principles-and-Practice-HW9)，公開網址尚待部署後驗證。**

## 直接看網站

雙擊根目錄 **[index.html](index.html)**，或用 Chrome／Edge 開啟；不需要安裝 Node。請保留完整資料夾，圖片、字型、內頁都使用本地檔案。Spotify 與外部來源需要網路；播放器由讀者點擊才載入，播放條件由平台決定。

[樂團介紹](band/index.html) · [四位成員](members/index.html) · [歌曲推薦](recommendations/index.html) · [音樂作品](discography/index.html) · [曲目索引](discography/tracks/index.html) · [時間線](timeline/index.html) · [來源](sources/index.html)

## 已具備的功能

- 樂團背景與四位成員正式職涯頁：組團前身分、平台、代表經歷、加入過程、角色、時間節點與照片署名。
- 13 筆正式發行、7 個合作影音企劃、1 首其他官方公開歌曲；依日期、載體與版本區分。曲目索引可搜尋，共 60 個收錄／影音入口，並非 60 首不同歌曲。
- 37 個時間節點，可按年份與類別篩選；演出、頒獎典禮、音樂節目一位與影音節點分開，28 個事件詳情保留來源與日期辨識。
- 12 首歌曲推薦、四條聆聽路線；Dear、T.B.H、Dreamer 依序置頂。各曲有理由、版本、來源與官方／正版入口。
- 深色莓紅舞台配色、桌面與手機版、鍵盤選單、章節跳轉、點擊載入 Spotify 封面與播放器。

## 上傳與作業繳交

依 **[GitHub Pages 發布步驟](docs/github-pages.md)** 上傳完整資料夾內容，Pages 選 **Deploy from a branch → main → /(root)**。根目錄已提供 index.html 和 .nojekyll；不要選 docs，也不要只上傳單一 HTML 或 ZIP。

專案檔案較多，建議用 GitHub Desktop 整批提交。GitHub 網頁每批上傳數量有限；完整操作與官方文件連結見發布步驟。

公開成功後再填 **[繳交模板](SUBMISSION.md)**：個人標題、專案簡介、Repository／網頁真實連結、AGENTS.md 與擴充說明。個資由使用者自行填到課堂繳交內容。**[創作過程](docs/project-process.md)** 保留多輪決策與 AI 分工；請用自己的話說明你理解的規則。

## 哪些檔案要修改

| 位置 | 用途 |
| --- | --- |
| [AGENTS.md](AGENTS.md) | AI 先讀的目的、設計、結構、命名、查核與開發規則 |
| wiki/ | 唯一人工維護的內容主檔 |
| raw/sources/ | 來源定位、查閱日與支持範圍；既有紀錄不覆寫 |
| docs/templates/ | 成員、作品、影音、事件與推薦等可重用模板 |
| src/ | Astro 路由、共用版型、資料轉換與 CSS |
| public/ | 已確認使用依據的圖片與授權主檔 |
| 根目錄 index.html、各網頁資料夾、_astro/、images/、licenses/ | 可直接發布的生成結果；不要手改 |
| .site-files.json | 生成檔案清單與雜湊，匯出器只管理這些檔案 |
| docs/publication-review.json | 內容發布審閱；修改 Wiki 後需重新審閱 |

## 開發與重新產生網站

只有要修改內容／版型時才需要 **Node.js 24.15 以上**與 **pnpm 11.25.0**。依賴版本已鎖定，請保留 pnpm-lock.yaml、pnpm-workspace.yaml。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

依終端顯示的本機網址查看開發預覽；按 Ctrl+C 停止。

| 指令 | 用途 |
| --- | --- |
| `pnpm check` | Astro／TypeScript 與內容欄位檢查 |
| `pnpm build:preview` | 可包含草稿的 dist-preview，帶 noindex |
| `pnpm preview:local` | 以 HTTP 預覽 dist-preview |
| `pnpm build` | 檢查發布狀態與內容審閱後產生 dist |
| `pnpm build:site` | 正式建置、檢查、更新根目錄 HTML／資源，再檢查相對連結 |
| `pnpm check:site` | 檢查根目錄網站連結、錨點、標題及內嵌互動程式 |
| `pnpm package:repo` | 產生不含依賴／快取的 github-ready 副本；目的資料夾須為空 |

安裝前先停止本專案的開發／預覽伺服器，避免 Windows 原生套件被占用。套件配置採專案內快取與 hoisted 佈局，已鎖定相容 runtime；不必為了上傳再安裝套件。

### 新增一張專輯的實際流程

1. 讓 AI 依 AGENTS.md 讀 Wiki 規則及 [作品模板](docs/templates/release.md)。實際查來源並新增 source record。
2. 在 wiki/releases/ 建立新頁，填入發行日期、曲目、版本 ID、官方入口及有來源的簡介，先保持 draft。
3. 新增引用 release_id 的發行事件；同步索引、相關推薦、待查表與只追加日誌。日期只由作品主檔維護。
4. 執行 `pnpm check`、`pnpm build:preview`，檢視新頁、版本與來源。共用元件會產生作品頁、列表、曲目索引及時間線。
5. 完成實際審閱後改 ready，記錄發布審閱，再重新建置：

```sh
pnpm review:content -- wiki/releases/實際檔名.md --date 實際日期 --note "實際審閱的來源、版本與呈現範圍"
pnpm build:site
```

上方檔名與日期是說明用，執行時換成英文小寫檔名與 YYYY-MM-DD。partial 頁另外加 `--limits` 列出已明示的待查項；**不把尚待核對的內容改成 checked**。新增發行事件等依賴頁也需完成相同審閱。詳見 [AGENTS 第 6 節](AGENTS.md)。

## 資料、素材與作者分工

本版沿用使用者逐步確認的 66 個 Wiki 實體及 61 份來源紀錄；23 頁仍保留 partial 查核狀態與具體限制。ready 表示在這個明示範圍內準備交付，並非資料全無缺漏。網站不自動監控新消息。

合照與個人照片使用 K-POPIT 케이팝잇 的 Showcase 素材，依 CC BY 3.0 標示作者與來源；字型保留 SIL OFL。Spotify 封面只在原生播放器顯示。詳見 [素材紀錄](docs/assets.md) 及網站來源頁；不能把引用當成第三方全部素材的使用許可。

AI 協助整理資料與程式實作，使用者參與選題、規則、範圍、選曲與設計決策。未宣稱所有內容均由使用者手寫，亦未代替使用者填寫個人心得。

## 驗證紀錄

最新結果見 [完整網站驗證](docs/final-validation.md)；早期逐步完成的紀錄保存於 [驗證歷史](docs/validation-history.md) 和 [Wiki 日誌](wiki/log.md)。本機檢查不能取代上傳後的公開網址驗證。
