# NAV 網站改善 Todo

> 目標：在維持目前 Vanilla JS + JSON + PWA 架構的前提下，逐步整理程式、提升可維護性、穩定性與使用體驗。
>
> 原則：小步驟重構，不一次推翻整個網站；完成一項就勾一項。

## 1. 架構重整

- [ ] 拆分 `js/app.js`，降低單一檔案的責任與複雜度
- [ ] 建立明確的 Core / Data / Features / Views / Services 模組分層
- [ ] 建立集中式 UI / App state，避免狀態散落在全域變數與 DOM
- [ ] 統一事件處理方式，避免不同模組重複監聽相同事件
- [ ] 檢查並移除重複、已失效或沒有實際用途的程式碼
- [ ] 統一模組間 API 與命名規則

## 2. Data / 資料層

- [ ] 整理 `data/data.json` 的資料結構與欄位規則
- [ ] 建立資料 normalize / validation 流程
- [ ] 統一連結、分類、標籤、狀態等 metadata 的處理方式
- [ ] 檢查重複資料與無效 URL
- [ ] 避免 render 層直接依賴過多原始資料結構

## 3. 導航與路由

- [ ] 整理 `navigation.js` 的頁面切換邏輯
- [ ] 評估導入輕量 History API 路由
- [ ] 統一首頁、分類、收藏、最近使用、推薦、搜尋頁面的 navigation API
- [ ] 確保瀏覽器上一頁 / 下一頁行為正常
- [ ] 確保重新整理後能正確恢復目前頁面

## 4. Render / UI

- [ ] 拆分 `render.js`，將卡片、列表、首頁、分類頁等 renderer 分離
- [ ] 統一 Card component 的資料與 DOM 生成方式
- [ ] 統一 Grid / List 顯示模式
- [ ] 改善空資料、載入中、錯誤狀態的 UI
- [ ] 檢查響應式排版在手機 / 平板 / 桌面上的一致性
- [ ] 檢查鍵盤操作與基本 accessibility
- [ ] 減少不必要的 DOM 重建

## 5. 搜尋

- [ ] 整理搜尋 query parser
- [ ] 統一搜尋與分類 / 標籤 / 狀態 filter 的資料介面
- [ ] 改善搜尋結果排序與相關性
- [ ] 優化大量資料下的搜尋效能
- [ ] 檢查 Command Palette 與一般搜尋是否有重複邏輯

## 6. 收藏 / 最近使用

- [ ] 整理 `storage.js` 的 localStorage API
- [ ] 統一收藏、最近使用資料的 state 管理
- [ ] 增加 localStorage 損壞 / 無效資料的容錯
- [ ] 檢查收藏排序與拖曳操作
- [ ] 檢查收藏 Grid / List 切換狀態是否能正確保存
- [ ] 避免同一連結因資料格式差異產生重複紀錄

## 7. PWA / Service Worker

- [ ] 完整檢查 `sw.js` 的快取策略
- [ ] 確保新版 JS / CSS / `data.json` 能可靠更新
- [ ] 改善 Service Worker 更新提示與使用者體驗
- [ ] 檢查離線狀態下的 fallback 行為
- [ ] 清理過期 cache，避免長期累積
- [ ] 檢查 manifest、icons、shortcuts 是否完整

## 8. 效能

- [ ] 減少首次載入不必要的 JavaScript
- [ ] 評估 JS module 載入順序與初始化流程
- [ ] 優化大量卡片的 render
- [ ] 優化 favicon / 圖片載入
- [ ] 避免重複 fetch `data.json`
- [ ] 檢查搜尋、分類切換、收藏排序的效能

## 9. 錯誤處理與穩定性

- [ ] 統一 fetch / JSON parse 錯誤處理
- [ ] 統一錯誤訊息與 Toast 行為
- [ ] 檢查外部 URL / favicon 失效時的 fallback
- [ ] 避免單一模組錯誤導致整個網站停止初始化
- [ ] 增加必要的 runtime guard

## 10. Admin / 資料管理

- [ ] 檢查 `admin/` 與主站資料結構的一致性
- [ ] 改善 Quick Add 的輸入驗證
- [ ] 確保新增資料不會產生重複項目
- [ ] 檢查 Cloudflare Worker API 錯誤時的處理
- [ ] 確保管理介面不洩漏 Secret / Token
- [ ] 評估將資料驗證邏輯與前台共用

## 11. 版本與變更紀錄

- [ ] 保留現有自動版本號機制
- [ ] 確保版本號只在必要位置顯示，避免 UI 重複
- [ ] 檢查版本號與實際 commit 變更是否一致
- [ ] 確保 `CHANGELOG.md` 自動更新內容正確
- [ ] 建立重構期間的版本變更檢查流程

## 12. CSS / Design System

- [ ] 整理 CSS 模組之間的依賴關係
- [ ] 移除重複 CSS
- [ ] 統一 spacing、font-size、border-radius 等設計 token
- [ ] 統一 Card / Button / Input / Tab 等元件樣式
- [ ] 檢查 dark mode 與 light mode 一致性
- [ ] 降低 selector 複雜度與樣式互相覆蓋的情況

## 13. Accessibility

- [ ] 檢查互動元件是否有正確的 semantic HTML
- [ ] 補齊必要的 aria-label / aria-expanded / aria-selected
- [ ] 確保鍵盤可以操作主要功能
- [ ] 檢查 focus 狀態
- [ ] 檢查文字與背景對比度
- [ ] 檢查螢幕閱讀器下的主要導航流程

## 14. 測試與品質

- [ ] 建立基本 smoke test
- [ ] 測試首頁載入
- [ ] 測試分類切換
- [ ] 測試搜尋與 filter
- [ ] 測試收藏新增 / 移除 / 排序
- [ ] 測試最近使用
- [ ] 測試 Command Palette
- [ ] 測試 PWA / Service Worker 更新
- [ ] 測試 Admin Quick Add
- [ ] 建立重構後的回歸檢查清單

## 15. 最終整理

- [ ] 全站重新檢查 console error / warning
- [ ] 全站檢查 broken link
- [ ] 全站檢查 mobile / desktop layout
- [ ] 全站檢查 PWA 安裝與更新
- [ ] 全站檢查資料完整性
- [ ] 全站檢查程式碼是否仍有重複或過度耦合
- [ ] 更新 README / 開發文件
- [ ] 完成一次完整 regression test

## 建議實作順序

1. `app.js` 拆分與 Core state
2. Data layer 整理與 validation
3. Render layer 拆分
4. Navigation / Router 整理
5. Favorites / Recent / Search 整理
6. CSS / Design System 整理
7. PWA / Service Worker 強化
8. Admin / 錯誤處理強化
9. Accessibility
10. 測試與最終 regression
