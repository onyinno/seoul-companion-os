# Seoul Companion OS

Seoul Companion OS 是一個以 **手機優先（mobile-first）** 設計的首爾旅遊管理 Web App，專注把出發前、在地行程與每日預算整合到同一個清晰介面。

## 這個 App 是甚麼

Seoul Companion OS 提供「單一旅程、分頁式操作」體驗，讓使用者可在同一套流程中完成：
- 首頁中樞總覽
- 每日行程安排
- 機票／住宿／診所預約查看
- 出發前準備清單
- 購物清單與預算聯動
- 旅程預算分析與匯率換算

## 核心功能

- 首頁指揮中心（Home Command Center）
- 行程規劃（Itinerary Planner）
- 預約總覽與登機證風格資訊卡（Booking Overview）
- 準備清單（Prep Checklist）
- 購物清單（Shopping List）與預算整合
- 預算儀表板（Budget Dashboard）
- KRW ⇄ HKD 即時匯率換算（透過 app 端點）
- 設定（主題、字級、深色模式、視覺偏好）
- 旅程基本資料與封面編輯
- Google Maps 外連
- 本機持久化（Local Persistence）

## 技術棧（Tech Stack）

- **Framework**: Next.js 14（App Router）
- **UI**: React 18 + Tailwind CSS
- **State 管理**: Zustand（含 persist）
- **動畫**: Framer Motion
- **圖示**: Lucide React
- **語言**: TypeScript

## 部署狀態（Deployment Status）

目前專案狀態為：
- ✅ 可在本地開發與建置（`npm run dev` / `npm run build`）
- ✅ 具備生產版本所需核心功能
- ℹ️ 實際雲端部署平台可按團隊需要接入（如 Vercel）

## v1.0.0 狀態

**Seoul Companion OS v1.0.0 已達功能完整（feature-complete）里程碑。**

此版本重點在於：
- 完成旅程核心流程閉環（首頁 → 行程 → 預約 → 準備 → 購物 → 預算 → 設定）
- 完成 KRW ⇄ HKD 即時匯率換算及備援可用性
- 完成旅程資料與封面自訂
- 維持手機優先、路由優先（route-first）架構

---

如需版本更新內容，請參閱 [`CHANGELOG.md`](./CHANGELOG.md)。

## Supabase v2 前置設定

已新增 Supabase v2 前置設定文件（僅環境變數與平台設定，不包含功能實作）：

- [`docs/supabase-setup.md`](./docs/supabase-setup.md)

Firebase 文件已標記為 deprecated：

- [`docs/firebase-setup.md`](./docs/firebase-setup.md)

