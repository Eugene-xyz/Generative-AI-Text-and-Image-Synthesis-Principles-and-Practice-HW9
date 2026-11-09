# AGENTS.md — QWER Stage Notes

文件版本：v1.0 完整網站與 GitHub 交付  
最後更新：2026-11-10（Asia/Taipei）

## 1. 專案目的

建立繁體中文的非官方 QWER 樂團與音樂介紹網站，讓讀者認識四位成員組團前的身分、活動平台、代表經歷、加入過程，以及樂團作品、重要活動與歌曲推薦。本作業的核心是可重複使用的規則與內容格式；新增內容應沿用 Wiki 和共用版型。

名稱為 **QWER Stage Notes**，副標「QWER 樂團與音樂筆記」。本站與樂團及所屬單位沒有官方合作或背書關係。繁體中文正文搭配韓文／官方英文原名，非官方譯名必須標明。

## 2. 開始工作前

1. 先讀本文件、[README](README.md)、[Wiki 索引](wiki/index.md)。
2. 修改內容必讀 [Wiki 規則](docs/wiki-rules.md)、相關原頁及來源；使用 [模板](docs/templates/README.md)。
3. 修改網站必讀 [網站規格](docs/site-spec.md) 與對應共用元件。
4. 事實缺口與需要使用者選擇的事項分開記於 [待查表](wiki/questions.md)。使用者已確認的事項沿用，不重複詢問；新的選曲、圖片或收錄範圍先討論。

使用者最新指示優先。使用者於 2026-11-10 更新授權，要求 AI 將完成版上傳至既有 Repository `Eugene-xyz/Generative-AI-Text-and-Image-Synthesis-Principles-and-Practice-HW9`，並以 main／根目錄啟用 GitHub Pages、驗證公開瀏覽。這取代先前「自行上傳」的安排；保留既有 Git 歷史，不強制推送。繳交個資留空。首頁使用標準檔名 `index.html`。

## 3. 已確認內容與頁面結構

| 網頁 | 用途與共用方式 |
| --- | --- |
| `/` | 合照與摘要 → 四位成員 → Dear、T.B.H、Dreamer → 作品 → 時間線 → 來源 |
| `/band/` | 成團背景、成員入口、團名與出道、作品與活動、資料範圍；`BandPage.astro` |
| `/members/`、`/members/<slug>/` | 四人總覽及共同職涯版型；`MemberProfile.astro` |
| `/discography/`、`/discography/<slug>/` | 正式發行按日期排列；`MusicWork.astro` |
| `/discography/tracks/` | 可搜尋的全部收錄／影音索引，連回穩定版本錨點 |
| `/collaborations/<slug>/`、`/other-songs/<slug>/` | 合作影音與其他官方公開歌曲分開，不混算正式發行 |
| `/timeline/`、`/timeline/<slug>/` | 年份／類別篩選，事件由 Wiki 產生；`EventPage.astro` |
| `/recommendations/`、`/recommendations/<slug>/` | 12 首、四分類、三首置頂；`RecommendationPage.astro` |
| `/sources/`、`/library/` | 來源、資料範圍、素材署名與全站入口 |

舊 `/read/` 路由共用正式元件，避免維護兩套內容。程式路由與部署根目錄的 `index.html` 對應，例如 `/band/` 匯出為 `band/index.html`。

資料盤點截止 **2026-11-09**：13 筆正式發行、7 個合作影音企劃、1 首其他公開曲；14 筆已選活動（演出 7、頒獎典禮 6、首次音樂節目一位 1）。時間線另整合出道、發行與影音節點，目前 37 筆。曲目索引目前 60 個收錄／影音入口，不能稱為 60 首不同歌曲。計數由 Wiki 計算，更新後不手改頁面數字。

## 4. 視覺與操作規範

深色搖滾舞台風格，沿用莓紅配色；色彩、字型與共用間距由 `src/styles/tokens.css` 管理。

| 用途 | 色碼 |
| --- | --- |
| 背景／區塊 | `#0C0E13`／`#171B24` |
| 主文字／次文字 | `#F4F5F7`／`#B7BFCD` |
| 莓紅／冰藍 | `#FF647C`／`#83D9EE` |
| 分隔線 | `#343B49` |

- 中文使用 Noto Sans TC，英文展示字使用 Barlow Condensed；正文約 16–18px、行高約 1.8。手機長文改單欄，保留完整日期與版本標示。
- 目前合照 C 與個人照 B 組均為 2024 Showcase，K-POPIT 케이팝잇、CC BY 3.0；使用原比例、保留署名與授權。換照片必須先提供候選，不能使用搬運圖或 AI 假成員照片。素材紀錄見 [assets](docs/assets.md)。
- 數位封面只由完整 Spotify 原生播放器呈現，點擊才建立 iframe；不預載、不自動播放、不下載或抽出封面。提供外開備援及隱私說明。LP 沒有同版播放器，保留圖形與官方公告。
- 推薦優先沿用 `src/data/music-embeds.ts` 已核對的同版 Spotify 專輯入口並註明曲目位置；其他官方公開歌曲使用原官方影片。Wiki 原查核連結保留，新增平台須實際核對版本。
- 必須支援手機選單、鍵盤、可見焦點、跳到主要內容、語義化標題與圖片替代文字。尊重減少動態偏好；不只用顏色表達分類。
- 網站讀者不需要看到內部 ID、草稿流程或開發設定；資料限制與引用必須清楚可見。

## 5. Wiki 與查核規則

資料流程固定為 **raw 來源紀錄 → wiki Markdown → 網站**。`wiki/` 是唯一人工維護的內容主檔；`src/data/` 只存顯示順序、已選素材／平台與額外節點的引用，不再抄人物經歷、發行日期或歌曲事實。

- 優先官方資料、本人訪談與可靠報導；實際讀過才能記錄為已核對。各項事實就近附來源，原 `raw/sources/` 不覆寫，新證據另建紀錄。
- 分清事件日、發布日、查閱日；只知年月就保留年月，未知不補值。網站建置不能自動更新 `verified_at` 或資料截止日。
- 成員頁明寫組團前身分、平台、內容類型、代表經歷、加入過程及角色；歷史 Twitch 身分不等於目前平台。本人回憶必須有歸屬，保留 Magenta 起學時間的來源差異。
- 正式發行、合作影音、其他公開歌曲分開。OST、語言、載體另作屬性；CD Only、LP、重製、混音、伴奏及再收錄不能混成相同錄音。
- LP 六曲曲序未核對就寫待查，不擅編 A1–B3；原版參考不能冒充 LP 音源。頁面可讀不等於音訊已試播。
- 既有缺漏依使用者 D013 決定：保留已確認內容，缺項逐一說明；不因準備發布把 partial 改成 checked。不得捏造傳聞、個人經驗或聲音評析。

### 內容模板與命名

- 檔名用英文小寫連字號，元件 PascalCase。識別碼保持穩定；改標題不能順便改 ID。
- 成員、作品、影音、事件、推薦各使用 `docs/templates/` 的對應模板。規定的 H2、表頭和版本欄位不能任意改名；需要新格式時同步改轉換與檢查，未知結構應報錯。
- Markdown 轉換先統一 LF／CRLF 換行；依解析器的表格原文切割時，找不到對應位置必須報錯，不能把原始表格與轉換後卡片重複顯示。
- 每頁有 `id`、`type`、`title`、`status`、`verification`、日期、`sources`、`related`。新頁先 draft，來源與關聯 ID 必須存在。
- 事件分正式出道、正式發行、演出、頒獎典禮、音樂節目一位；影音另列。發行事件只用 `release_id` 引用日期，活動保留 `date_end` 與日期意義。同典禮的多獎／演出及跨日系列不拆成重複事件。
- 追加影音節點從原版本表取日期；Shine All Night 日本公開版的 2025-09-11 是「截至已公開」，不是首次上線日或已確認的日文錄音。
- 推薦固定四分類：青春入門、陪伴與勇氣、樂團故事與創作、更多音樂面貌。Dear → T.B.H → Dreamer 置頂，另出現在原分類時不重算。版本對應作品既有 song／version ID；理由採網站導聆，不冒充使用者心得。
- 維護相關索引、待查表與交叉連結；`wiki/log.md` 只追加實際做過的工作，不捏造 Git 歷史或查核結果。

## 6. 發布準備與內容狀態

`ready` 表示本頁可在明示的資料範圍內交付；`verification` 記事實核對狀態，二者分開。使用者已逐步確認內容與例外，並於 2026-11-10 要求完整交付。本輪把已審閱內容納入發布準備；**未宣稱已上線，也不將既有 partial 改成 checked**。

- 公開建置需全部頁面與依賴為 ready、無 conflict，且與 `docs/publication-review.json` 的逐頁檔案雜湊相符。
- partial 頁必須在正文保留具體限制，並在發布審閱紀錄列出待查項。這延續使用者同意的「已確認內容先收錄」方式。
- 新增或修改 Wiki 後先用預覽檢視，再核對來源與限制；完成審閱後才更新 ready 與發布紀錄。不得為使建置通過而批次假核准，不能刪除檢查或用預覽輸出代替。
- 記錄指令：`pnpm review:content -- wiki/<分類>/<頁面>.md --date YYYY-MM-DD --note "本次實際審閱範圍"`；partial 另加 `--limits F001,F002` 等。此指令只記錄雜湊，不自動變更頁面狀態或事實核對日。

## 7. 檔案結構與開發流程

```text
生成式HW9/
├── index.html、.nojekyll、.site-files.json  # 自動匯出的發布首頁與清單
├── band/、members/、discography/…          # 自動匯出的靜態內頁
├── _astro/、images/、licenses/            # 發布資源
├── AGENTS.md、README.md、SUBMISSION.md
├── wiki/、raw/sources/                   # 內容與證據
├── docs/                                # 規格、模板、發布與創作紀錄
├── src/                                 # Astro 路由、共用元件、資料轉換、CSS
├── public/                              # 已確認可使用的素材主檔
├── scripts/                             # 建置、審閱與匯出檢查
└── package.json、pnpm-lock.yaml 等設定
```

1. 先改規則／模板（若需要），再改 Wiki 或共用程式。根目錄 HTML 與發布資源是衍生結果，不能手改。
2. 執行 `pnpm check`、`pnpm build:preview`，檢查相關頁面、來源與版本。
3. 內容符合發布條件後執行 `pnpm build:site`：公開建置、連結檢查、匯出根目錄、再驗證相對連結及互動腳本。
4. 檢視桌面／手機與受影響的功能；需要時測試子路徑。測試只寫實際結果。
5. 同步索引、日誌與交付說明；依 [發布步驟](docs/github-pages.md) 提交。

`node_modules/`、`.pnpm-store/`、`.astro/`、`dist/`、`dist-preview/`、`review/`、個資、憑證與快取不提交。根目錄的靜態網站輸出**本版本需要提交**，讓使用者可直接上傳及用 main／根目錄發布。

匯出器只更新 `.site-files.json` 管理的生成檔；遇到人為修改或路徑衝突必須停止，不可刪除 source／Wiki。打包以白名單列出來源與生成檔，檢查大檔、私密設定與失效連結。

## 8. GitHub 與作業交付

- 本版採 GitHub Pages「Deploy from a branch → main → /(root)」，不需要學生先設定 Actions 或安裝 Node。需修改網站時才使用 Astro 開發流程。
- 保留 `.nojekyll`、全部內頁、圖片與字型；只傳 index.html 不足以運作。相對路徑可適應不同 Repository 名稱。
- 本次已獲使用者授權上傳至上述既有 Repository 及啟用 Pages；完成部署後須實際確認公開網址與主要功能。沒有部署結果不能宣稱已上線，後續更新沿用相同流程。
- `SUBMISSION.md` 包含專案簡介、GitHub／網頁待填位置、AGENTS 與擴充方式；個資由使用者在課堂繳交內容填寫。
- [創作紀錄](docs/project-process.md) 保留實際的多輪設計決策與 AI 分工；不聲稱全由手寫、不捏造個人心得，不保證老師給分或不判抄襲。學生應能說明規則並示範新增內容。

方法參考：[LLM Wiki 構想](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)。本專案使用簡化 Markdown Wiki，不含聊天機器人、向量資料庫或自動追蹤新消息。
