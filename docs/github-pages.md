# 上傳 GitHub 與公開網站

這份專案已包含正式建置的根目錄 `index.html`、內頁、圖片、字型與原始碼；你可以直接上傳，無須先安裝 Node。**使用者已指定 [既有 Repository](https://github.com/Eugene-xyz/Generative-AI-Text-and-Image-Synthesis-Principles-and-Practice-HW9) 並授權 AI 上傳及啟用 Pages；最新部署狀態以 README 與驗證紀錄為準。** 下列步驟保留作為未來自行更新或重建網站的指引。

## 建議方式：GitHub Desktop

專案包含多個內頁與字型檔，建議使用 [GitHub Desktop](https://desktop.github.com/) 整批提交。GitHub 網頁一次最多上傳 100 個檔案；請勿把整個 ZIP 當作網站上傳。參考 [GitHub 檔案上傳說明](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)。

1. 在 GitHub 建立新的 **Public** Repository，名稱可用 `qwer-stage-notes`。本專案已有 README，建立時不用再新增 README、.gitignore 或 License。
2. 在 GitHub Desktop 選 **File → Clone repository → URL**，貼上剛建立的 Repository 網址，選一個新的空資料夾作為本機位置。參考 [官方複製步驟](https://docs.github.com/en/desktop/adding-and-cloning-repositories/cloning-and-forking-repositories-from-github-desktop)。
3. 將「生成式HW9」**裡面的全部內容**複製到剛複製下來的資料夾。不要再包一層「生成式HW9」；開啟 Repository 第一層就應看到 `index.html` 與 `AGENTS.md`。
4. 確認 `.nojekyll`、`.site-files.json`、`_astro/`、`images/`、`licenses/` 都有複製；不要刪掉檔案總管中名稱以點開頭的檔案。
5. 回 GitHub Desktop，檢查變更清單，Summary 可寫 `Complete QWER Stage Notes website`。按 **Commit to main**，再按 **Push origin**；介面若顯示 **Publish branch**，先發布該分支。
6. 回 GitHub Repository，確認根目錄有 `index.html`、`AGENTS.md`、`README.md`、`src/`、`wiki/`、`raw/` 及網頁資料夾。

如果使用網頁上傳，必須分批、每批不超過 100 檔，維持資料夾層級並確認隱藏檔也已加入。使用 GitHub Desktop 較不容易漏檔。

## 啟用 GitHub Pages

1. 開啟 Repository 的 **Settings → Pages**。
2. 在 **Build and deployment → Source** 選 **Deploy from a branch**。
3. Branch 選 **main**，資料夾選 **/(root)**，按 **Save**。
4. 等待 GitHub 顯示部署成功，使用該頁提供的 **Visit site** 開啟網站。

本版刻意把可發布首頁放在根目錄，並附 `.nojekyll` 讓 Astro 的 `_astro/` 資源能直接使用。不要選 `/docs`；那裡是開發文件。選項與發布來源規則依 [GitHub Pages 官方文件](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

## 公開後確認與繳交

- 從無登入視窗開啟實際網站，確認首頁、合照、四位成員、歌曲推薦、曲目搜尋與時間線篩選可用。
- 點開一個內頁，再重新整理，確認沒有 404；手機也檢查一次。
- 開啟作品頁，先確認外開 Spotify 入口，再依需要載入播放器。完整播放依平台、登入與地區條件。
- Repository 網址可從 GitHub 的 Code 頁取得；網頁網址以 Settings → Pages 的成功結果為準。將兩個真實連結填入 [繳交模板](../SUBMISSION.md)。

不要僅因為檔案已上傳就宣稱網站可公開瀏覽。GitHub Pages 入口檔與確認網站的方法見 [官方建立網站說明](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)。

## 之後修改網站

修改 Wiki 或 src 後，在專案根目錄執行 README 的檢查、發布審閱與 `pnpm build:site`。把更新後的原始碼、Wiki、`.site-files.json`、根目錄 HTML 與資源一起提交；不要只改 GitHub 上的 HTML。此版本不需要另建 GitHub Actions 建置工作流程。

個人學號、姓名等請填在你送交課堂的文字，不要另外提交到公開 Repository。老師的實際收件欄位與規定優先。
