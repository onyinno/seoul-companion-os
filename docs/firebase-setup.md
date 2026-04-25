# Firebase Setup (v2 Preparation)

本文件僅用於 **v2 前置設定**，目前不會變更 v1 行為，也不會啟用圖片上傳功能。

## 1) 建立 Firebase 專案與 Web App

1. 前往 Firebase Console 建立或選擇一個專案。
2. 在專案中新增 **Web App**。
3. 取得 Web App 設定值（僅 client config，不是私鑰）。

需要的環境變數：

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

> 注意：此階段不使用 Firebase Analytics。

## 2) 啟用 Anonymous Authentication

在 Firebase Console：

1. 進入 **Authentication**。
2. 啟用 **Anonymous** 登入提供者。

這是 v2 雲端功能的最小身份識別基礎。

## 3) 建立 Firebase Storage Bucket

在 Firebase Console：

1. 進入 **Storage**。
2. 建立預設 bucket（建議同專案區域策略）。

此 bucket 供未來 v2 購物項目照片儲存使用。

## 4) 設定 Vercel Environment Variables

在 Vercel 專案設定中加入下列變數（Production / Preview / Development 視需求）：

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

請勿填入私鑰或 service account JSON。

## 5) 本地開發 `.env.local`

請手動建立 `.env.local`（不要提交）：

```bash
cp .env.example .env.local
```

再將上述 `NEXT_PUBLIC_FIREBASE_*` 值填入。

## 6) 安全注意事項

- **絕對不要提交** `.env.local`。
- **絕對不要提交** Firebase Admin 私鑰、service account JSON。
- `.env.example` 僅保留空白 placeholder，方便團隊同步欄位。


## 7) 可選：環境變數驗證 helper

專案已預留 `lib/firebase-env.ts`，可安全讀取 `process.env` 並檢查必要欄位是否齊全。

- 若缺少任一 `NEXT_PUBLIC_FIREBASE_*`，helper 會回傳 `enabled: false`。
- 此設計可讓 Firebase 功能在未配置時保持停用，避免影響既有 v1 行為。

