# 完整網站驗證

驗證日期：2026-11-10（Asia/Taipei）。檢查對象為根目錄可發布版，先以本機 HTTP 檢查，再完成 GitHub Pages 公開部署與瀏覽驗證；QWER 資料盤點截止仍為 2026-11-09。

## 建置與資料一致性

| 項目 | 實際結果 |
| --- | --- |
| Astro／TypeScript | 45 個檔案，零錯誤、零警告、零提示 |
| 正式建置與根目錄匯出 | 140 個 HTML（含相容舊路由）、272 個管理中的網站檔案；根目錄有 index.html、.nojekyll |
| 內部連結／資源 | 5,743 個檢查通過；包含錨點、CSS 字型及圖片路徑 |
| GitHub 專案子路徑 | 相對連結以 /qwer-stage-notes/ 檢查通過，未依賴固定 Repository 名稱 |
| Wiki | 66 個實體具逐頁發布紀錄；23 頁保留 partial 與可見的資料限制 |
| 原始證據 | 61 份來源紀錄位元組未變；查核狀態、查核日期及原事件／作品日期保持不變 |
| 引用與舊路由 | 66 頁保留原 Markdown 外部引用，共 103 個不同網址；舊／新路由錨點一致 |
| 計數 | 時間線 37 筆；全部曲目索引 60 個收錄／影音入口；12 個數位作品播放器按鈕 |
| 預載行為 | 所有實體頁初始 HTML 沒有外部 iframe，讀者點擊才建立播放器 |
| 內容狀態防護 | 測試副本中的 draft、conflict、未重新審閱的修改與缺少限制的 partial 都被拒絕 |
| 匯出防護 | 測試副本人為修改生成檔後，匯出停止並保留修改，不覆蓋使用者變更 |

本輪修正 Windows 換行與 Markdown 解析器換行不一致造成的作品表格重複／段落截斷，以及事件表格定位失敗。重新建置後，21 個音樂正式頁的原始表格不再與卡片重複顯示，原引用仍完整保留。檢查器另驗證生成檔雜湊、重複錨點與內嵌 JavaScript 語法。

## 實際瀏覽與操作

- 以瀏覽器檢視 1440px 桌面、390px 手機與 320px 窄畫面；新樂團／推薦頁、長名稱及已展開表格未見整頁橫向溢位。這是視窗尺寸測試，並非真實手機測試。
- 樂團合照正常載入；官方角色原文可展開，四位成員入口連到正式人物頁。
- 推薦總覽保留 Dear → T.B.H → Dreamer 順序；分類錨點能跳轉，Dear 的版本連結到正確作品曲目段落；其他公開曲仍保留官方影片與版本限制。
- 手機選單可用鍵盤開啟／Escape 關閉，焦點回到選單按鈕；主要導覽可切換正式內頁。
- 曲目搜尋 Discord 顯示 13 筆、日文顯示 5 筆；無結果提示正常，清除後回到 60 筆。搜尋結果包括版本敘述，不等於相同數目的獨立歌曲。
- 時間線選 2024 年與「音樂節目一位」顯示 Show Champion 一筆；切到 2023 年為零筆，清除後恢復 37 筆。
- Harmony from Discord 播放器點擊前為零 iframe，點擊後顯示 Spotify 官方封面與四軌數位曲表；未按播放。其他作品的同版入口沿用既有核對紀錄。
- 本次觀察的瀏覽器 console 無 error／warning。截圖存於 [previews](previews/final-recommendations-desktop.jpg)。

## 驗證界線

已完成使用者既有 Repository 的上傳、Pages 設定與公開瀏覽驗證，結果見下節；沒有代替使用者提交課堂作業。尚未實際測試 file:// 雙擊、真實手機、所有平台的完整音訊播放或所有外部來源當日可用性。

正式交付不表示資料全無缺漏：LP 曲序、部分合作影音日期／語言與再次收錄的錄音關係等，繼續依 [待查表](../wiki/questions.md) 明示。沒有為交付把 partial 改成 checked。

## GitHub Pages 公開驗證

- 目標：[HW9 Repository](https://github.com/Eugene-xyz/Generative-AI-Text-and-Image-Synthesis-Principles-and-Practice-HW9)。依使用者授權直接提交完整 529 檔，保留既有歷史，未強制推送；目前專案樹不含臨時 ZIP、上傳標記或新增的寫入型工作流程。
- 首次完整發布 commit 為 `ab3940a66b4ec00a7e3eaf9d0b97a65c7725051b`；其 Git tree `773751eeba0ff2fbeece5c578ea10bf70ac9f6cd` 與本機 529 個檔案逐檔 Git blob 雜湊一致。本節與繳交連結屬後續文件更新。
- 實際 Repository 子路徑 `/Generative-AI-Text-and-Image-Synthesis-Principles-and-Practice-HW9/` 通過 140 HTML、5,743 個內部連結／資源與錨點檢查。
- Settings → Pages 顯示 **Your site is live at**，Source 為 **Deploy from a branch**，分支 **main**、資料夾 **/(root)**，HTTPS 啟用。GitHub 自動產生的 [Pages 部署紀錄](https://github.com/Eugene-xyz/Generative-AI-Text-and-Image-Synthesis-Principles-and-Practice-HW9/actions/runs/42673926304) 結果為 success。
- [公開網站](https://eugene-xyz.github.io/Generative-AI-Text-and-Image-Synthesis-Principles-and-Practice-HW9/) 以不含登入 Cookie／Token 的獨立 HTTP 請求取得 **200**，回應為 HTML 並含 QWER Stage Notes 標題，確認可匿名讀取。
- 在公開網址實際瀏覽首頁、Chodan 內頁、音樂總覽、曲目索引、時間線與推薦頁。合照與人物照片正常載入；人物內頁重新整理成功；首頁及該人物頁未見橫向溢位。推薦前三首順序為 Dear → T.B.H → Dreamer。
- 公開版曲目搜尋 Discord 顯示 13 筆；時間線選 2024 與音樂節目一位顯示 Show Champion 一筆，清除後恢復 37 筆。觀察期間未見 console error／warning，首頁初始為零外部 iframe。
- 本輪只更新部署說明與連結，66 個 Wiki 實體、61 份來源紀錄及生成網站維持已驗證內容；資料截止日與 partial 限制未變。
