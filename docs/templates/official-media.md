# 官方影音／其他公開歌曲模板

適用於使用者已確認的「官方合作影音」與「其他官方公開歌曲」。每個歌曲／企劃一頁；同曲語言版本或不同影片分段記錄，不按每支影片建立一張發行。

```yaml
---
id: media-待填
type: official-media
title: "官方歌曲或企劃名稱"
status: draft
verification: partial
updated_at: "YYYY-MM-DD"
verified_at: null
category: collaboration
published_date: null
date_precision: unknown
reference_date: null
date_basis: "閱讀排序依據；不可假裝是首發日"
artists: [QWER]
partners: []
languages: []
availability: [official-video]
sources: []
related: []
---
```

- `category`：collaboration 放 `wiki/collaborations/`；original-publication 放 `wiki/other-songs/`。來源不足以判斷新的收錄性質時先討論。
- `published_date` 只填已證實的官方公開日，精度用 day／month／year／unknown。無法確認用 null，不把演出、公告或報導日代入。
- `reference_date` 是索引用的已知節點，`date_basis` 必須明說是公開、演出、合作公告或「截至已公開」。它與公開日相同時不賦予另一種事件意義。
- 韓文 ko、日文 ja、未知 und；日本市場影片不直接推定日文演唱。
- `availability` 記發表形式；有證據的歷史官方免費下載可加 historical-official-free-download，不表示今日可用。

## 段落與規則

1. 2–3 句有來源的歌曲／企劃介紹；有不同語言或改編版本時，各寫 2–3 句已知資訊，不虛構聲音特色。
2. 基本資料：演唱、合作對象、作品用途、分類及正式音源發行查核狀態。
3. 版本與時間表：每個版本／影片的日期、日期意義、官方入口與存取限制。
4. 歌曲 `song-`、版本 `track-`、錄音關係待查的收錄項 `appearance-` 對照。
5. 來源與待查：來源紀錄 ID、讀取範圍；影片頁讀取失敗不冒充已觀看，搜尋定位入口須標明。

Embracing Me 曾提供官方免費音檔，依使用者決定仍在合作影音。REBOUND 是既有歌曲的合作影片，不因此增加歌曲主體；青少年銀行服務的品牌身分不是歌曲題材的推論。若後來找到正式發行，新增 release 關聯，保留最初公開節點與歌曲 ID，不改寫歷史。

完成後更新分類 index、Wiki 總索引、音樂時間索引、coverage、questions 與 append-only log；保持 draft。參考 [Shine All Night](../../wiki/collaborations/shine-all-night.md)、[청춘서약](../../wiki/other-songs/youth-pledge.md)。

## 網站的章節約定

H2 使用 `作品與分類`、`版本、時間與官方入口`、`編輯用歌曲／版本對照`、`來源與待查`；另可有 `逐公開版本簡介` 或 `逐版本簡介`、`歌曲推薦入口`。新增未知章節應同步更新共用轉換，避免漏掉內容。

基本資料為兩欄表格；版本表使用四欄「日期或範圍｜性質｜已確認內容｜入口與限制」。每列性質需在同頁唯一且能穩定辨識影片／版本，例如韓國版 MV、日版公開影片，不能一律寫 MV。網站依性質產生錨點，新增列不應改動其他列的錨點。

曲目索引會列出每個官方影音入口並連回對應段落，仍保持企劃數、入口數及錄音數的差別。不能從多支影片或不同市場版本直接推論新增歌曲／錄音。
