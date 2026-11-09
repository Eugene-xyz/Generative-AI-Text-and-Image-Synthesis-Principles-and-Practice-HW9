# 一般時間線事件模板

適用已確認的演出、頒獎典禮與音樂節目一位。新建 `wiki/timeline/<event-slug>.md`，檔名英文小寫與連字號。先查是否已有同一活動；新增收錄項目先討論。發行事件沿用 `release_id`，不要套此模板另存發行日期。

```yaml
---
id: event-事件識別碼
type: event
title: "活動原名與必要中文說明"
status: draft
verification: partial
updated_at: "實際修改日 YYYY-MM-DD"
verified_at: null
date: null
date_end: null
date_precision: unknown
date_basis: performance-date
category: performance
sources: []
related: []
---
```

| 類別 | category | date_basis | 日期意義 |
| --- | --- | --- | --- |
| 演出 | performance | performance-date | 實際演出日／期間 |
| 頒獎典禮 | award-ceremony | ceremony-date | 典禮日；事前頒獎資訊另列 |
| 音樂節目一位 | music-show-win | broadcast-award-date | 當集播出結果日 |

`date_precision` 沿用 day／month／year／unknown；日期只填已知精度。單日 `date_end: null`，跨日填有來源的結束日並保留完整顯示；同一期間事件以起日排序。多場巡演不要把全部未來城市包成已完成期間。

正文依序寫：

1. **標題與摘要**：日期／期間、活動原名與 2–3 句摘要，事實旁附具體外部來源。
2. **事件資料**：類別、日期意義、地點／節目、完成證據。來源只說預定就不能寫成已演出。
3. **事件內容**：演出簡述或獎項表。獎項列原名、得獎對象、對應歌曲（有證據才填）、結果與來源；音樂節目另寫出演情況。同場典禮的舞台表演放同頁。
4. **日期辨識**：分列實際事件、事前選定／公布、新聞或貼文發布日、查核日；不從網址推定發布日。
5. **收錄理由**：明標「編輯選擇」，不把主觀重要性當官方評價。
6. **範圍與待查**：缺少的個別影片上線、實際頒獎日或曲目細節逐項列明。未知不補猜測，`checked` 只限本頁已核內容，仍有必要缺漏用 `partial`。
7. **相關頁面與來源紀錄**：使用既有 ID、標準相對 Markdown 連結；提供時間線、總索引及 raw/sources 入口。

建立後同步 [總索引](../../wiki/index.md)、[發展時間線](../../wiki/timeline/index.md)、[待查表](../../wiki/questions.md)，並在 [日誌](../../wiki/log.md) 追加實際變更與檢查結果。頁面仍為 draft；正式公開依 [AGENTS.md](../../AGENTS.md) 辦理。

可參考 [MMA 同場演出](../../wiki/timeline/mma-2024.md)、[跨日粉絲演唱會](../../wiki/timeline/first-fancon-seoul.md)、[D Awards 日期辨識](../../wiki/timeline/d-awards-2025.md)、[音樂節目首次一位](../../wiki/timeline/show-champion-first-win.md)。

## 正式網站的章節與產生規則

新增一般活動時，依上述格式使用以下完整 H2 名稱，不加序號：

```markdown
## 事件資料
## 事件內容
## 日期辨識
## 收錄理由
## 範圍與待查
## 相關頁面
```

- `事件資料` 使用「欄位／內容」兩欄表；來源引用及備註放事件摘要、事件內容或日期辨識，不在資料表外另塞隱藏段落。
- 事件內容與日期辨識各可有一張 Markdown 表格；第一欄作每筆記錄標題，其他欄完整保留為標籤／內容。獎項、得獎對象、對應歌曲、結果與出演情況不能在轉換時丟失。需要多表或新章節時同步修改共用轉換。
- 完成建檔與查核後，時間線、年份／類別篩選、來源清單及事件內頁由同一 Wiki 自動產生。不手寫另一份 HTML、日期陣列或事件計數。
- 發行事件保留 `category: release` 與 `release_id` 的既有簡短格式，不另外填 `date`／`date_end`。出道事件保留已確認的出道日期，不能推定成立日期。
- `date_basis` 必須符合類別；跨日保留結束日。無法確定月／日就使用對應精度或 null，網站另組顯示，不將未知時間補成占位日期。
- 追加影音節點仍屬影音頁，不套此模板增建重複事件；選定後在顯示設定引用原作品 ID 與版本表的性質名稱，日期與來源仍由 Wiki 讀取。
