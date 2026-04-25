# Supabase Setup (v2 Foundation)

本文件僅用於 **v2 前置設定**，目前不會變更 v1 行為，也不會啟用圖片上傳 UI 或完整雲端同步。

## 1) 建立 Supabase 專案

1. 前往 Supabase Dashboard 建立（或選擇）專案。
2. 於專案設定中取得以下 **public client** 設定：
   - Project URL
   - Publishable key（anon / publishable）

需要的環境變數：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## 2) 啟用登入方式（Shared account + Anonymous fallback）

### 2-1) Email / Password（建議給私人情侶共用）

在 Supabase Dashboard：

1. 進入 **Authentication**。
2. 啟用 **Email** provider。
3. 建立一組要給雙方裝置共用的帳號（同一 Email / password）。

目前私人雙人使用情境下，建議兩支手機都登入同一組 Supabase 帳戶，作為「同一份資料」的身份基礎。

### 2-2) Anonymous（保留相容）

在 Supabase Dashboard：

1. 進入 **Authentication**。
2. 啟用 **Anonymous** 登入。

匿名登入仍可作為 fallback，避免未登入共享帳戶時功能直接失效。
但匿名帳戶是「每台裝置各自獨立」，不適合跨裝置共享資料。

## 3) 建立私有 Storage bucket（相片檔案）

在 Supabase Dashboard：

1. 進入 **Storage**。
2. 建立 bucket。
3. bucket 名稱必須使用：`trip-photos`。
4. 設定為 **private**（非公開）。

## 3-1) 套用 Storage policies（SQL Editor）

在啟用任何照片上傳 UI 前，請先到 Supabase Dashboard → **SQL Editor**，手動執行：

- `docs/supabase-storage-policies.sql`

此 SQL 會在 `storage.objects` 建立 bucket `trip-photos` 的 RLS policies，限制為：

- 僅 `authenticated` 使用者可存取
- 第一層資料夾必須等於 `auth.uid()::text`
- 路徑需符合：
  - `{userId}/shopping/{itemId}/{fileId}.jpg`
  - `{userId}/activities/{activityId}/{fileId}.jpg`
- 使用者只能對自己的資料夾做 `insert/select/update/delete`

> 注意：`trip-photos` 必須維持 **private**，不要改成 public。

## 3-2) 建立 Shopping metadata table（Supabase Database）

請到 Supabase Dashboard → **SQL Editor**，執行：

- `docs/supabase-shopping-items.sql`

此 table 用於同步購物清單的 metadata（名稱、價格、地圖連結、是否完成、相片 storage path 等）。
在目前設計中：

- `shared account` 登入後，兩台裝置會拿到同一個 `auth.uid()`（也就是同一個 `user_id`）
- `shopping_items.user_id` 會綁定 `auth.uid()`
- SQL 會授權 `authenticated` 角色可透過 Data API 存取 table（`select/insert/update/delete`）
- 仍由 RLS policy 限制僅能讀寫 `user_id = auth.uid()` 的資料列

## 4) 設定 Vercel Environment Variables

在 Vercel 專案設定中加入：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

建議依需求分別配置到 Production / Preview / Development。

## 5) 本地開發 `.env.local`

請手動建立 `.env.local`（不要提交）：

```bash
cp .env.example .env.local
```

再填入 `NEXT_PUBLIC_SUPABASE_*` 的實際值。

## 6) 安全注意事項

- **絕對不要提交** `.env.local`。
- **絕對不要提交** `service_role` key。
- client 端僅可使用 `NEXT_PUBLIC_SUPABASE_*`。

## 7) v2 方向（尚未在此 PR 實作）

- Shopping 清單已可透過 Supabase Database 同步 metadata（目前僅 shopping 範圍）。
- Shopping 頁面會在登入後、頁面載入、以及回到頁面焦點時重新抓取 `shopping_items`，並嘗試即時同步變更（Realtime）。
- Shopping 照片檔案仍儲存在 Supabase Storage `trip-photos`，前端以 signed URL 暫時讀取。
- signed URL 為短時效連結，不是永久公開網址。
- Activity / itinerary / 其他模組的完整同步尚未導入。
- Activity 照片上傳 UI 仍在後續版本加入。
- 真正的跨成員模型仍會在後續版本逐步導入（例如 `trip_members` 多成員資料模型）。
- 在 `trip_members` 上線前，若要讓兩台裝置看到同一份旅行資料，請先使用「同一個 shared Supabase 帳戶」登入。
- 本階段以「shared account + shopping 同步」為主，不變更既有路由架構與 v1 主要操作體驗。
