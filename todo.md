# NAV 網站改善 Todo

> 目的：以目前 `main` 分支的實際程式碼為準，持續整理 Vanilla JS + JSON + PWA 架構，提升可維護性、穩定性、效能與使用體驗。
>
> 標記規則：`[x]` 已由目前程式碼確認完成、`[ ]` 尚未完成、`[~]` 已有部分實作但仍需完整驗收或重構。
>
> 本次重新掃描範圍：主站 HTML、`js/`、`js/data/`、`data/`、`admin/`、`css/`、PWA / Service Worker、版本自動化與目前 Todo。掃描結論已依目前實際程式碼更新，不把「有做一部分」誤標成完成。

## 1. 架構重整

- [~] 拆分 `js/app.js`，目前已有 `data.js`、`storage.js`、`search.js`、`navigation.js`、`render.js`、`theme.js`、`update.js` 等模組，但 `app.js` 仍同時負責 App state、初始化、全域事件、錯誤 UI 與資料收集
- [ ] 建立明確的 Core / Data / Features / Views / Services 模組分層
- [ ] 建立集中式 UI / App state，避免 `app.js` 的 `data / all / map / favorites / recent / active` 與 DOM 狀態分散
- [~] 統一事件處理方式，目前主站互動多數集中到 `app.js` delegation，但 `theme.js`、`card-tooltip.js`、Command Palette 等仍各自註冊事件
- [x] 已移除一批重複、失效或沒有實際用途的程式碼
- [ ] 統一模組間 API 與命名規則
- [ ] 補上正式的初始化生命週期 / module contract，避免依賴 script 載入順序的隱性全域函式

## 2. Data / 資料層

- [~] 整理 `data/data.json` 的資料結構與欄位規則，目前同時存在頂層 `links` 與 `list[].links` 兩種形態
- [~] 建立資料 normalize / validation 流程，目前已有 metadata 建立與收藏 / 最近使用 normalize，但沒有完整的 `data.json` schema validation
- [x] 已統一連結、分類、標籤、狀態等 metadata 的處理方式
- [ ] 建立啟動時的重複資料檢查與無效 URL 檢查
- [ ] 避免 render 層直接依賴過多原始資料結構
- [ ] 建立唯一資料模型，讓 `flat / src / tabData` 不必理解原始 JSON 的多種結構

## 3. 導航與路由

- [~] `navigation.js` 已集中首頁、分類、收藏、最近使用、常用頁面的主要切換邏輯
- [ ] 評估並導入輕量 History API router
- [ ] 統一首頁、分類、收藏、最近使用、推薦、搜尋頁面的 navigation API
- [ ] 確保瀏覽器上一頁 / 下一頁行為正常
- [~] PWA shortcut query 可在重新載入後恢復指定頁面，但一般頁面狀態仍無法透過 URL 恢復
- [ ] 讓分類、搜尋、頁面狀態可被 URL 表示並支援直接開啟
- [ ] 移除目前依賴 `location.search` 後再 `replaceState` 清除參數的過渡式導航邏輯

## 4. Render / UI

- [~] `render.js` 已統一 Card / Card body / Grid 的基本生成方式，但 renderer 尚未依頁面與元件職責進一步拆分
- [x] 已有統一 Card component 的資料與 DOM 生成入口
- [ ] 統一 Grid / List 顯示模式，目前實際 render 主要只有 Grid
- [x] 已有空資料、載入中、錯誤、離線等基本 UI
- [~] 已有 `responsive.css` 與多層 CSS responsive 規則，但尚未完成手機 / 平板 / 桌面的全站驗收
- [~] 已補部分鍵盤操作與 accessibility 屬性，但尚未完成完整 accessibility audit
- [ ] 減少不必要的整頁 `main.innerHTML` 重建，特別是搜尋、切頁、收藏操作
- [ ] 統一頁面 renderer contract，避免 `home / page / categoryPage / quick / group` 各自組 HTML
- [ ] 實際驗收收藏拖曳、分類切換、搜尋結果與空狀態的視覺一致性

## 5. 搜尋

- [x] 已有 `parseSearchQuery()`，支援一般文字與 `tag/category/subcategory/type/status/domain` filter
- [x] 已將搜尋與 metadata filter 接到同一套 `searchLinks()` 介面
- [ ] 改善搜尋結果排序與相關性，目前主要是 `includes()` 全字串匹配，沒有 ranking
- [ ] 優化大量資料下的搜尋效能，目前每次輸入都重新掃描全部 `all`
- [~] Command Palette 與一般搜尋已共用 `searchLinks()`，但兩邊仍各自處理結果、鍵盤操作與頁面行為
- [ ] 統一 Search / Command Palette 的 query、result、navigation contract
- [ ] 補充引號、多詞、部分 filter、filter value escape 等 query parser 邊界案例

## 6. 收藏 / 最近使用

- [x] `storage.js` 已集中收藏 / 最近使用的 localStorage 基本 API
- [~] 收藏與最近使用已有 normalize、去重與 state 變數，但仍直接由 `app.js` 持有 mutable state
- [x] 已有 localStorage JSON 損壞 / 無效資料的基本容錯
- [x] 已有收藏排序 / 拖曳 reorder 邏輯
- [~] 收藏狀態可保存，但目前沒有真正的 Grid / List 顯示模式切換
- [x] URL normalization + `key()` 已降低同一網址因 query / hash / 尾斜線差異造成重複紀錄的問題
- [ ] 補上資料集本身的 duplicate URL / duplicate title 檢查
- [ ] 統一 Recent timestamp 與 Recent record 的資料生命週期，避免兩套 localStorage 資料失同步

## 7. PWA / Service Worker

- [x] 已有版本化 cache name 與舊 `chi-nav-*` cache 清理
- [x] JS / CSS / `data.json` 已有 Network First 策略，可在網路正常時更新快取
- [~] Service Worker 已有 offline fallback，但資源失敗時部分情況仍只丟出錯誤，尚未形成完整離線 UX
- [~] `bootstrap.js` 已使用 `updateViaCache: 'none'` 註冊 SW，但尚未提供明確的新版更新提示 / reload 流程
- [x] 已有核心 assets precache
- [~] manifest 已有 shortcuts 與基本 icon，但 icon 尺寸 / maskable / 多平台 PWA metadata 尚未完整驗收
- [ ] 檢查第三方 Font Awesome CDN 在離線安裝狀態下的 fallback
- [ ] 驗證 SW 更新時舊版頁面、JS、CSS、data.json 不會混用

## 8. 效能

- [~] 目前 JS 已拆成多個功能檔，但仍以傳統 `<script>` 全域載入，尚未完成 module / loading strategy 整理
- [ ] 減少首次載入不必要的 JavaScript
- [ ] 評估 JS module 載入順序與初始化流程
- [ ] 優化大量卡片的 render，避免每次切頁都重新產生整個 Grid
- [~] favicon 使用 lazy loading、domain fallback，但每張卡仍可能觸發 Google favicon 與 fallback favicon 請求
- [x] `data.json` 主站初始化目前只有一次明確 fetch
- [ ] 檢查 Admin 與主站各自 fetch data 的快取與失效策略
- [ ] 實際量測搜尋、分類切換、收藏排序在大量資料下的效能

## 9. 錯誤處理與穩定性

- [~] `app.js` 已統一主要 data fetch / JSON parse 初始化錯誤
- [~] 已有 offline / error / retry UI 與 console logging，但模組級錯誤仍可能中斷後續初始化
- [x] 卡片 favicon 已有 primary → root domain → origin favicon → 首字母 fallback
- [~] 已有部分 runtime guard，例如 DOM optional chaining 與資料型別檢查，但尚未全面覆蓋所有函式
- [ ] 統一全站 error / Toast API，不讓不同模組各自決定錯誤呈現方式
- [ ] 為搜尋、storage、navigation、Command Palette 增加邊界條件 guard
- [ ] 建立可診斷的初始化錯誤資訊，而不是只顯示通用「無法載入」

## 10. Admin / 資料管理

- [x] Quick Add 已能依目前 `data.json` 產生分類 / 子分類
- [x] Quick Add 已有必填欄位、URL、分類、子分類驗證
- [x] Quick Add 已檢查同名稱或同網址，避免直接新增重複項目
- [~] Cloudflare Worker API 錯誤已有 HTTP / JSON error handling，但前後端 error contract 尚未正式化
- [x] Admin Secret 沒有硬編碼到 repository，提交時才由使用者輸入
- [~] 前台 metadata validation 與 Admin Quick Add validation 仍是兩套邏輯
- [ ] 建立共用 validation schema / validation utility
- [ ] 補 Admin API timeout、retry 與更明確的錯誤分類
- [ ] 檢查 Admin 頁面本身的 accessibility 與 responsive layout

## 11. 版本與變更紀錄

- [x] 已保留 `.github/workflows/version.yml` 的自動版本號機制
- [x] 目前版本號為四段式 `MAJOR.MINOR.COMMIT.ADMIN`
- [x] 版本資訊目前由 `version.json` 統一提供，主站 footer 顯示一次
- [x] `changelog.json` 會由 GitHub Actions 自動新增 commit / admin 紀錄
- [~] 版本 bump 依 commit message 與 GitHub Actions 執行，仍需確認 workflow 自身產生的 commit 不會造成不必要的版本循環
- [ ] 建立版本號、changelog、commit SHA 三者的一致性檢查
- [ ] 修正 Todo 中原本寫成 `CHANGELOG.md` 的舊描述，統一以實際 `changelog.json` 為準

## 12. CSS / Design System

- [~] 已存在 `design-system.css`，但目前仍同時存在 `style.css`、`enhancements.css`、`responsive.css`、`theme.css`、`update.css`、`category-page.css`、`card-layout.css` 等多層樣式來源
- [ ] 整理 CSS 模組之間的依賴關係與載入順序
- [ ] 移除重複 CSS
- [~] 已開始使用設計 token / 共用元件樣式，但尚未完成 spacing、font-size、radius、color token 全面統一
- [~] Card / Button / Input / Tab 已有各自樣式，但仍有多檔案分散定義
- [~] dark mode / light mode 已有 theme system，但尚未完成全站一致性驗收
- [ ] 降低 selector 複雜度與 cascade overlap
- [ ] 建立 CSS ownership 規則，明確規定每個元件由哪個 stylesheet 負責

## 13. Accessibility

- [~] 主站已有 semantic HTML、部分 `aria-label`、`aria-live`、`aria-busy`、dialog 屬性
- [~] 已有部分 `aria-expanded / aria-selected` 等需求的基礎結構，但尚未逐項驗證
- [~] 搜尋、Command Palette、品牌按鈕、側邊欄已有部分鍵盤操作
- [ ] 完整檢查所有互動元件的鍵盤操作
- [ ] 補齊必要的 `aria-label / aria-expanded / aria-selected` 狀態同步
- [ ] 完整檢查 focus ring 與 focus return，尤其 Command Palette 關閉後焦點位置
- [ ] 檢查文字與背景對比度
- [ ] 檢查螢幕閱讀器下主要導航、搜尋、收藏流程
- [ ] Admin 頁面同步進行 accessibility audit

## 14. 測試與品質

- [ ] 建立基本 smoke test
- [ ] 測試首頁載入與初始化失敗 recovery
- [ ] 測試分類切換
- [ ] 測試搜尋與 filter parser
- [ ] 測試收藏新增 / 移除 / 排序 / normalize
- [ ] 測試最近使用與 timestamp
- [ ] 測試 Command Palette 鍵盤流程
- [ ] 測試 PWA / Service Worker 更新與 offline fallback
- [ ] 測試 Admin Quick Add 驗證與 API error
- [ ] 建立 mobile / tablet / desktop 回歸檢查清單
- [ ] 建立 console error / warning 檢查
- [ ] 建立 broken URL / duplicate data 檢查

## 15. 最終整理

- [ ] 全站重新檢查 console error / warning
- [ ] 全站檢查 broken link
- [ ] 全站檢查 mobile / tablet / desktop layout
- [ ] 全站檢查 PWA 安裝與更新
- [ ] 全站檢查資料完整性、duplicate 與 invalid URL
- [ ] 全站檢查程式碼是否仍有重複或過度耦合
- [ ] 更新 README / 開發文件
- [ ] 完成一次完整 regression test
- [ ] 清理 Todo 中所有已過時、與實際檔案不一致的描述

## 本次掃描後的主要技術債

1. `app.js` 仍是最大的 orchestration hotspot，雖然功能已拆到多個檔案，但 state 與初始化責任仍集中。
2. `data.json` 仍是半結構化資料，頂層 `links` 與 `list[].links` 兩種格式讓 Data / Render 層需要知道原始結構。
3. Navigation 沒有真正的 History API router，URL 目前主要只服務 PWA shortcuts。
4. Render 會大量使用 `main.innerHTML` 重建頁面，後續可針對局部更新與 renderer contract 重構。
5. Search 已有 filter parser，但沒有 relevance ranking，且每次輸入都重新掃描所有資料。
6. CSS 已有 design system，但仍存在多層 stylesheet 疊加，cascade ownership 尚未清楚。
7. PWA cache 基礎已完整不少，但更新 UX、第三方 CDN 離線行為與跨版本一致性仍需驗收。
8. Admin 與前台各自做 validation，應抽成共用 schema / utility。
9. 目前沒有真正的 automated regression / smoke test，完成重構前不能只依賴人工檢查。

## 建議下一步實作順序

1. `app.js` / Core state 重構
2. Data normalize + validation + duplicate / URL audit
3. Render contract 與局部更新
4. History API navigation
5. Search ranking + Search / Command Palette 共用邏輯
6. Storage / Recent lifecycle 整理
7. CSS ownership / design system 清理
8. PWA update / offline UX
9. Admin / validation 共用化
10. Accessibility audit
11. Smoke / regression test
12. 最終全站驗收
