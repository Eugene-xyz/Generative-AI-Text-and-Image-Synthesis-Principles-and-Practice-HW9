# 歌曲推薦模板

新增前先確認選曲、分類與導聆角度。複製到 `wiki/recommendations/<song-slug>.md`，將下列佔位內容改為實際值；`song_id`、`version_id` 沿用既有作品表，不另建虛構歌曲頁。

```yaml
---
id: recommendation-<song-slug>
type: recommendation
title: "正式曲名｜歌曲推薦"
status: draft
verification: partial
updated_at: "實際修改日 YYYY-MM-DD"
verified_at: null
sources: [實際讀過的來源ID]
related: [已存在的作品或官方影音頁ID]
song_id: song-既有識別碼
version_id: track-既有版本識別碼
work_id: release-既有作品識別碼
category: youth-introduction
order_in_category: 1
featured_order: null
selection_basis: user-approved-proposal
selection_confirmed_at: "實際確認日 YYYY-MM-DD"
viewpoint: website-guide
viewpoint_author: "AI 草擬導聆，使用者確認採用"
listen_url: "已核對的官方或正版入口"
listen_kind: album-track
listen_locator: "專輯第幾軌與頁面曲名；單曲或影片則標入口性質"
link_checked_at: "實際連結核對日 YYYY-MM-DD"
playback_verified: false
---
```

## 欄位與排序

| 欄位 | 規則 |
| --- | --- |
| `category` | 青春入門 `youth-introduction`；陪伴與勇氣 `companionship-courage`；樂團故事與創作 `band-story-creation`；更多音樂面貌 `more-musical-facets` |
| `order_in_category` | 同分類顯示順序；從 1 起，不重複。不是發行時序或排名 |
| `featured_order` | Dear = 1、T.B.H = 2、Dreamer = 3；其餘 null。置頂只引用既有推薦，不另建副本 |
| `selection_basis` | 使用者主動指定為 `user-requested`；AI 提案經使用者採用為 `user-approved-proposal`。未確認候選不得寫成已選 |
| `viewpoint` | 本輪 `website-guide`。不得改成使用者個人經歷；若要改口吻，先取得實際心得並確認 |
| `version_id`／`work_id` | 從作品頁或官方影音頁選取對應的版本及實體 ID；`related` 只填已存在頁面 ID，不填尚無頁面的 song／track ID |
| `listen_kind` | `song`、`album-track`、`single`、`official-linkhub`、`official-video`；資料頁與商品頁不能冒充音源 |
| 查核欄位 | `verified_at` 記敘述核對；`link_checked_at` 記入口核對；頁面可讀不等於實際試播。僅播放成功時才可將 `playback_verified` 改 true 並記錄範圍 |

## 正文樣式

以下 H1、分類與六個 H2 為每首共用結構：

```markdown
# 官方曲名（韓文原名）

分類：**已確認分類**

## 適合誰聽

用一句話指出讀者興趣或聆聽情境。

## 推薦理由（網站導聆）

寫 2–3 句具體理由，連結歌曲背景和推薦情境；避免每首套用同一句形容。

## 歌曲背景與來源

簡述支持導聆的已核對背景，附外部來源及既有作品頁。聲音特色要歸屬發行介紹、訪談或有紀錄的實際聆聽；不猜測樂器、速度、情緒或歌詞意義。

## 推薦版本與官方收聽

使用表格列版本／語言／載體、所屬作品、官方或正版入口、曲序定位。保留會影響選曲的版本差異與尚待核對資訊。

## 選曲與查核紀錄

交代選曲來源、已確認的導聆口吻、來源紀錄連結及未解缺口；不把選曲確認當作公開或音訊已驗證。

## 相關頁面

連回推薦總覽、對應作品與 Wiki 索引。
```

## 完成流程

1. 確認歌曲、版本與分類已獲同意，避免和既有推薦重複；先讀 [AGENTS.md](../../AGENTS.md)。
2. 實際開啟來源及收聽入口；來源紀錄沿用已讀範圍，新證據另建紀錄。不能以使用者同意取代事實查核。
3. 更新推薦總覽、Wiki 總索引、作品回連與 `related`；發行日期仍由作品頁維護，推薦不另維護一套日期。
4. 記錄決策於待查／已處理清單，日誌只追加。依實際範圍檢查 ID、版本歸屬、來源、連結與排序。
5. 新頁維持 draft；公開階段另核對依賴頁面。已知缺漏沿用原有待查處理方式，不反覆詢問。
