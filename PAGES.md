# GitHub Pages 版部署

GitHub Pages 提供查詢介面。Cloudflare Worker 轉送查詢，Apps Script 讀取私有 Google Sheet。這個版本延續原網址的免登入查詢模式，任何人都可查詢符合條件的資料。瀏覽器的跨來源設定只限制瀏覽器，無法作為身分驗證。

## Google Apps Script

1. 到 script.google.com 建立新的獨立 Apps Script 專案，將 `api/Code.gs` 貼到指令碼檔，儲存。
2. 在專案設定新增指令碼屬性 `SPREADSHEET_ID`、`BP_API_SECRET`。後者請使用密碼產生器建立至少 32 字元的隨機密碼。分頁名稱若與 `M_BP_Supplier` 不同，新增 `SUPPLIER_TAB`。
3. 部署為網頁應用程式，執行身分選「我」，存取權限選「任何人」，授權後複製 `/exec` 網址。API 會驗證共用密碼才查詢。原本的 Apps Script 查詢頁可以繼續使用，切換完成後可封存其部署。

## Cloudflare Workers

1. 在 Workers & Pages 建立 Worker，匯入 GitHub 的 `ricky-orange/BP`，使用 `main`，部署命令使用 `npx wrangler deploy`，根目錄為 repo 根目錄。
2. 在 Worker 的 Settings → Variables and Secrets 新增 `APPS_SCRIPT_URL`，填新的 Apps Script `/exec` 網址。另新增 Secret `BP_API_SECRET`，填與 Apps Script 相同的值。密碼只放這兩處。
3. 複製 Worker 的 HTTPS 網址，加上 `/search`，填入 `docs/config.json` 的 `apiUrl`。例如 `https://bp-supplier-api.example.workers.dev/search`。

## GitHub Pages

在 repo Settings → Pages 選 Deploy from a branch，分支選 `main`，目錄選 `/docs`。部署成功後，在 https://ricky-orange.github.io/BP/ 用一筆已知統編驗證查詢。若使用自訂網域，將 `api/worker.js` 的 `origin` 改為新網域並重新部署。
