# 開發與驗證歷史

此文件保存先前階段的 README 紀錄；最新操作請以 [專案 README](../README.md) 與 [AGENTS.md](../AGENTS.md) 為準。

# QWER Stage Notes

QWER 非官方樂團與音樂介紹網站，使用繁體中文 Markdown Wiki 作為內容主檔，搭配 Astro、TypeScript、原生 CSS；預計使用 GitHub Pages 公開。

首頁已獲確認：莓紅舞台配色、成員優先、Dear／T.B.H／Dreamer 置頂，採用 2024 Showcase 合照。已延伸成員總覽及 Chodan、Magenta、Hina、Siyeon 四個正式職涯內頁，使用同場個人照片 B 組，包含經歷、加入過程、角色、年表、待查說明與來源。首頁與成員已獲使用者確認。已完成音樂作品總覽、13 筆正式發行與 8 個官方影音內頁，以及可搜尋的全部曲目索引；數位封面由 Spotify 點擊載入。音樂頁已獲確認；本輪新增時間線總覽與 28 個事件正式內頁，可依年份與類別篩選，並保留 9 個影音／合作節點。樂團及推薦仍提供通用閱讀預覽。目前未建立遠端 Repository，也未公開部署。

[開發規範](../AGENTS.md) · [Wiki 索引](../wiki/index.md) · [網站規格](site-spec.md) · [素材紀錄](assets.md)

## 先看網站

這次交付附有 `review/` 確認副本。在檔案總管雙擊 `review/index.html`，即可查看首頁；照片、字型與內頁均在資料夾內。需要保留整個 `review/` 資料夾。它是可重新產生的輸出，不提交 Git；修改網站後，按下方指令重建。

本輪入口為 `review/timeline/index.html`，事件詳情在 `review/timeline/<事件檔名>/index.html`；首頁與導覽可直接前往。音樂入口為 `review/discography/index.html`，曲目索引為 `review/discography/tracks/index.html`。作品與官方影音連結會開啟同一份共用正式版型；Spotify 需網路，黑膠無同版播放器。成員入口為 `review/members/index.html`；四位個人頁分別在 `review/members/chodan/index.html`、`magenta/index.html`、`hina/index.html`、`siyeon/index.html`。首頁故事連結及上方「四位成員」選單已接到正式內頁。`review/` 不提交 Git，GitHub 上請依指令自行產生，或使用日後實際部署的網址。

開發時用 `pnpm dev`，依終端顯示的本機網址開啟。預設為 `http://127.0.0.1:4321/`；按 Ctrl+C 關閉伺服器。既有 Wiki 保持 `draft`，本機預覽標有 noindex。

## 安裝與指令

需要 Node.js 24.15 或以上，以及 pnpm 11.25.0。版本記於 `package.json`，依賴由 `pnpm-lock.yaml` 鎖定。在專案根目錄執行：

```sh
pnpm install --frozen-lockfile
pnpm dev
```

完成修改後：

```sh
pnpm check
pnpm build:preview
node scripts/check-build.mjs
node scripts/export-review.mjs
node scripts/check-build.mjs review / --offline
```

| 指令 | 用途 |
| --- | --- |
| `pnpm dev` | 啟動可讀草稿的 Astro 開發伺服器 |
| `pnpm check` | 內容 schema 與 Astro／TypeScript 檢查 |
| `pnpm build:preview` | 驗證關聯、產生 `dist-preview/`，保留 noindex |
| `pnpm preview:local` | 以 HTTP 瀏覽剛才的 `dist-preview/` |
| `node scripts/check-build.mjs` | 檢查輸出 HTML 的連結、資源、錨點、標題與 noindex |
| `node scripts/export-review.mjs` | 將預覽轉為相對路徑與內嵌互動程式，產生 `review/` |
| `pnpm build` | 公開版本建置；目前會因草稿／待查內容而阻擋，不能用預覽目錄直接代替 |

`pnpm-workspace.yaml` 採 hoisted 佈局與專案內套件儲存區，避免依賴 Windows 符號連結權限。它也為 `@astrojs/astro2tsx` 補上與其 emnapi core 相符的 runtime 1.11.3，避免套件自動選到不相容的 2.x beta。這些設定及鎖定檔需一起保留。安裝前關閉本專案的 Node 開發／預覽伺服器，避免 Windows 原生套件被鎖住。

## 檔案如何分工

- `raw/sources/`：來源定位、查閱日期與支持範圍；既有紀錄不覆寫。
- `wiki/`：唯一人工維護的樂團知識與歌曲導聆，使用 `docs/templates/` 中的模板。
- `src/content.config.ts`：載入與驗證 Wiki，保留既有 ID。
- `src/lib/`：來源關聯、摘要、日期、Markdown 清理與站內連結轉換。
- `src/data/home.ts`：首頁選用 ID、排序與分類名稱；事實與正版音樂網址仍取自 Wiki。
- `src/data/site.ts`、`src/data/member-photos.ts`、`public/`：網站名稱、已選合照與個人照片的素材資訊、原圖及字型授權。
- `src/components/`、`src/layouts/`、`src/styles/`：共用導覽、頁尾、頁殼與莓紅舞台樣式。
- `src/pages/`：首頁、成員總覽與四個人物頁、音樂總覽與曲目索引、作品／影音正式頁、時間線與事件頁、全部筆記、通用閱讀與來源頁。
- `src/lib/music.ts`、`src/components/MusicWork.astro`：作品表格及版本轉換、共用正式版型；Spotify 展示設定在 `src/data/music-embeds.ts`，不另存封面圖檔。
- `docs/`：網站約定、完整 Wiki 規則與素材紀錄。

## 之後新增內容的方式

以新增一張作品為例：先依 `docs/wiki-rules.md` 查閱官方資料，新增來源紀錄；複製作品模板至 `wiki/releases/<英文小寫連字號>.md`，填入穩定 ID、日期、類型、曲目版本、逐曲簡介與官方入口。保持 `draft`，未知細節明列待查。

接著新增引用 `release_id` 的發行事件、更新相關頁面與 Wiki 索引，並在日誌追加實際修改紀錄。正式作品頁、曲目索引與作品列表會由資料產生；若要放到首頁，再討論是否調整 `src/data/home.ts` 的精選 ID。最後執行上方檢查，不需重寫整個首頁。

成員與推薦摘要依固定章節、表格列取得，標題約定詳見 `docs/site-spec.md`。修改欄位或標題時，同步更新共用轉換及模板；缺漏應讓檢查失敗，不能悄悄補猜測值。

以補充成員經歷為例：新增已讀來源，在該成員 Wiki 的對應章節補寫，年表用「時間／內容／日期的意義」三欄保留精度及來源。四個正式頁面會自動沿用 `src/components/MemberProfile.astro`，不需再寫一份 HTML 或複製人物資料。選圖及署名從 `src/data/member-photos.ts` 讀取。舊 `/read/members/` 連結仍可用，與新路由共用版型。

## GitHub Pages 準備

目前為靜態輸出，所有站內路由與素材均透過同一 base。後續確認 Repository 後，設定 `SITE_URL` 為 GitHub Pages 網域、`SITE_BASE` 為 `/Repository名稱/`，再建立 Actions。自訂網域或帳號首頁的 base 使用 `/`。目前沒有填入假 Repository 或聲稱已部署。

在 PowerShell 模擬專案子路徑：

```powershell
$env:SITE_BASE = '/qwer-stage-notes/'
pnpm build:preview
node scripts/check-build.mjs dist-preview /qwer-stage-notes/
Remove-Item Env:SITE_BASE
```

正式公開前，所有會呈現的 Wiki 與依賴必須經確認為 `ready`／`checked`，且圖片授權與待查項已處理。首頁版型確認不會自動提升內容狀態。

## 首頁階段驗證紀錄（2026-11-09）

- Astro／TypeScript：14 個程式檔，0 errors、0 warnings、0 hints。
- 預覽建置：69 個頁面，包含首頁、兩個閱讀入口及 66 個既有 Wiki 實體。
- 最終輸出檢查：1,807 個站內連結與資源，錨點及 noindex 檢查通過；`review/` 副本亦通過相同檢查。
- Chrome 已檢視桌面 1440px 與手機 390px；合照正常載入，手機選單開合、成員閱讀入口可用，無頁面橫向溢位。
- `/qwer-stage-notes/` 子路徑建置及相同連結檢查通過；公開建置如預期以 `PUBLIC_CONTENT_NOT_READY` 阻擋草稿／待查頁面。
- 推薦總覽確認有 12 首、四個分類；手機選單 Enter 開啟、Escape 關閉並返回焦點。檢視時未觀察到瀏覽器 console error。
- 全庫結構檢查通過：148 份 Markdown、61 份來源、66 個 Wiki 實體，所有實體仍為 draft。既有來源、人物、作品與事件正文保持原樣，日誌只追加。
- `review/` 的相對連結與內嵌選單已透過 HTTP 檢視；瀏覽器工具限制 `file://` 導航，因此未自動測試雙擊開啟模式。未驗證音訊試播、真實手機瀏覽器或遠端 GitHub Pages 部署。

畫面紀錄：[桌面整頁](previews/home-desktop.jpg) · [手機整頁](previews/home-mobile.jpg)。這些圖片記錄本輪確認版，原始碼與 Wiki 才是後續維護的主檔。

## 成員內頁驗證紀錄（2026-11-09）

- Astro／TypeScript：20 個程式檔，0 errors、0 warnings、0 hints；無新增套件或變動鎖定檔。
- 預覽建置：74 頁；新增成員總覽與四個正式路由，舊人物閱讀路由仍使用同一版型。
- HTML 檢查：2,159 個站內連結與資源、錨點、單一主標題及 noindex 通過；`/qwer-stage-notes/` 專案子路徑亦通過。可攜 `review/` 的相對連結及內嵌選單檢查通過。
- 四頁分別保留原 Wiki 的 3、3、3、4 個職涯節點，以及全部外部引用網址；Siyeon 的畢業宣布與最後活動日、Magenta 的本人回憶與報導差異均保留。既有 61 份來源與 66 個實體正文未改動，仍為 draft。
- Chrome 檢視桌面 1440px、手機 390px；照片正常載入、沒有頁面橫向溢位。已操作成員總覽、四人切換、章節跳轉、藝名說明展開、首頁 Hina 入口；手機選單 Enter 開啟、Escape 關閉並返回焦點。
- 本輪使用靜態 HTTP 伺服器檢視建置輸出及 `review/`；副本沒有外部 JavaScript 檔案依賴，選單可操作，檢視時沒有觀察到 console error。Astro 開發伺服器未在本次等待時間內就緒，已停止，沒有把它記為驗證通過。
- `file://` 雙擊模式、真實手機與遠端 GitHub Pages 仍未自動驗證。內容狀態與正式公開維持原規則。

畫面紀錄：[成員總覽桌面](previews/members-desktop.jpg) · [成員總覽手機](previews/members-mobile.jpg) · [Chodan 桌面全文](previews/member-chodan-desktop.jpg) · [Siyeon 手機全文](previews/member-siyeon-mobile.jpg)。


## 音樂作品內頁驗證紀錄（2026-11-09～11-10）

- AGENTS 更新至 v0.11；新增音樂總覽、全部曲目索引、13 個正式發行及 8 個影音正式頁，舊音樂閱讀路由共用相同版型。未新增套件、改動鎖定檔或覆寫歌曲事實。
- Astro／TypeScript 31 檔：0 errors、0 warnings、0 hints。預覽建置 97 頁；根路徑與 `/qwer-stage-notes/` 子路徑各通過 3,820 個站內連結／資源、錨點、單一主標題與 noindex 檢查。
- `review/` 可攜副本通過 3,937 個連結／資源檢查，含先前副本保留的樣式資源；97 個頁面均無外部 JavaScript 檔案依賴。透過 HTTP 實際操作相對連結、搜尋及點擊載入播放器。未以工具自動測試 file:// 雙擊模式。
- 21 個音樂頁均保留原 Wiki 的所有外部引用、版本與日期限制；既有 61 份來源及 66 個實體正文保持原樣。全部曲目索引 60 筆，包含正式發行 48 筆、合作影音 11 筆、其他公開歌曲 1 筆；不宣稱為不同歌曲數。
- 12 個 Spotify 入口已核對對應作品、封面與曲表。瀏覽器實際驗證首張及 To Be Continued：點擊前無 iframe／遠端封面，點擊後顯示 Spotify 封面及曲目，外開連結保留。沒有點擊播放或驗證完整音訊。
- Chrome 檢視 1440px、390px 與 320px；無頁面橫向溢位。320px 的播放器可用寬度約 281px。CD Only 的商品資料不是音源、LP 六曲全部曲序待查、To Be Continued 四軌日韓版本與 Shine All Night 日本公開版語言限制均保留。
- 搜尋測試：Discord＋日文、Dear、Shine、無結果、清除恢復 60 筆；版本連結可到對應段落，影音的 Unicode 錨點也已實際操作。多行曲名改為整個文字區可點擊。手機選單 Enter 開啟、Escape 關閉並返回焦點；沒有觀察到瀏覽器 console error。
- 本輪仍為本機確認版，未建立 GitHub 遠端或部署。未驗證真實手機瀏覽器、全曲播放與遠端 GitHub Pages；原有待查資訊及 draft 狀態不變。

畫面紀錄：[作品總覽桌面](previews/music-index-desktop.jpg) · [作品總覽手機](previews/music-index-mobile.jpg) · [Spotify 封面桌面](previews/music-spotify-desktop.jpg) · [320px 播放器](previews/music-spotify-narrow.jpg) · [曲目搜尋手機](previews/music-search-mobile.jpg) · [黑膠手機](previews/music-lp-mobile.jpg) · [合作影音手機](previews/music-collaboration-mobile.jpg)。

## 之後新增一筆時間線事件

先與使用者確認收錄範圍，再依 [事件模板](templates/event.md) 建檔並補來源，選正確類別、日期精度與日期意義。活動使用自身日期，作品發行引用 `release_id`。`src/lib/timeline.ts` 和 `EventPage.astro` 會自動產生總覽、篩選與正式事件頁；不另維護一份活動資料。影音的額外時間節點由 `src/data/timeline.ts` 引用 Wiki 版本列，不抄另一份日期。

檢查時特別確認跨日範圍、事前公布與典禮日、出演與得獎的差別，以及同場活動沒有重複計數。更新管理索引、待查表及只追加日誌，執行既有檢查，再檢視桌面與手機。


## 時間線內頁驗證紀錄（2026-11-10）

- AGENTS 更新至 v0.12，新增時間線總覽與 28 個正式事件內頁；舊事件路由共用同一版型。網站沿用既有莓紅舞台配色，未新增套件、圖片或變更鎖定檔。
- 總覽共 37 筆：出道 1、正式發行 13、演出 7、頒獎典禮 6、音樂節目一位 1、影音公開／合作節點 9。影音包含 Shine All Night 日本公開版的「截至已公開」節點，不將其計為新增音源或演出。
- Astro／TypeScript 38 檔：0 errors、0 warnings、0 hints。根路徑與 `/qwer-stage-notes/` 子路徑各建置 126 頁，通過 5,021 個內部連結／資源、錨點、單一主標題與 noindex 檢查。
- `review/` 副本通過 5,138 個連結／資源檢查；126 頁無外部 JavaScript 檔案依賴。透過 HTTP 實際操作相對連結、年份／類別篩選、來源展開與手機選單。
- 37 筆日期與完整期間均吻合既有 Wiki 時間線；13 筆發行由作品日期取得。28 個事件頁保留 35 個不同的外部引用網址及 206 個表格內容值。61 份既有來源與 66 個 Wiki 實體正文未改動，包含原 draft／partial 狀態與 2026-11-09 資料截止。
- Chrome 檢視 1440px、390px、320px；無頁面橫向溢位。已驗證年份與類別交集、空結果及清除、鍵盤啟用篩選、來源展開、回到時間節點、事件／作品連結及章節跳轉。手機選單 Enter 開啟、Escape 關閉並返回焦點；觀察期間無 console error。
- 代表頁已檢視 D Awards 的事前選定／公布與典禮日、Show Champion 未出演、KCON 兩日舞台、MMA 同場演出，以及出道與發行的相互連結。未知日期／語言／版本仍維持原有說明。
- 本輪是本機確認版，未建立遠端或部署。`review/` 已透過 HTTP 驗證；file:// 雙擊模式、真實手機與遠端 GitHub Pages 未自動測試。

畫面紀錄：[時間線桌面](previews/timeline-desktop.jpg) · [分類篩選](previews/timeline-filtered.jpg) · [手機時間線](previews/timeline-mobile.jpg) · [事件桌面](previews/timeline-event-desktop.jpg) · [手機日期辨識](previews/timeline-dates-mobile.jpg)。
