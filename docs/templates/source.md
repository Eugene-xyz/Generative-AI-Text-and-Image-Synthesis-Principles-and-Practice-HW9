# 來源紀錄模板

將下方樣式複製到 `raw/sources/src-編號-主題.md`，實際讀取來源後再填寫。`null` 表示未知，不可自行補日期。

```yaml
---
id: src-編號-主題
type: source_record
title: "原始標題"
publisher: "發布單位"
url: "完整來源網址"
published_at: null
publication_note: "若只有期別或其他日期線索，在此說明"
accessed_at: "實際查閱日 YYYY-MM-DD"
access_status: read
language: ko
capture_mode: reference-and-short-excerpt
scope: "實際讀取的段落／頁數及未讀範圍"
---
```

正文固定寫：來源定位、必要原文短摘錄（如有）、可核對欄位及使用限制。短摘錄保留原貌，中文整理另放 Wiki。無法讀取時改標存取狀態，不用該來源作為已驗證證據。

完成後按 [納入流程](../../AGENTS.md) 更新來源索引與日誌；已納入的來源紀錄更正時另建關聯紀錄。
