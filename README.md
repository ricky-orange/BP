# SAP 廠商付款條件查詢

GitHub 保存原始碼，工地使用 Apps Script 部署後的 `/exec` 網址。查詢時由 Apps Script 讀取私有 Google Sheet，支援廠商編號精確查詢及公司名稱關鍵字查詢。

## 部署

1. 開啟試算表 `M_BP_Supplier` →「擴充功能」→「Apps Script」。
2. 將本 repo 的 `Code.gs` 貼到指令碼檔，新增名為 `Index` 的 HTML 檔，貼入 `Index.html`。
3. 在「專案設定」→「指令碼屬性」新增 `SPREADSHEET_ID`，值為試算表網址中 `/d/` 與 `/edit` 之間的 ID。若底部分頁名稱與 `M_BP_Supplier` 不同，另設 `SUPPLIER_TAB` 為實際分頁名稱。
4. 確認分頁第一列有 `SD_SUPPLIER`、`COM_NAME`、`PAY_TERMS_FN`。廠商編號與付款代碼建議設成純文字後再匯入，以保留前導零。
5. 選「部署」→「新增部署」→「網頁應用程式」。執行身分選「我」。如果工地使用同一 Google Workspace 網域的帳號，存取權限選該網域並完成授權。以工地帳號測試 `/exec` 網址後再提供給使用者。若工地使用網域外帳號，需另外配置可限制指定帳號的登入機制再開放。
6. 之後若修改程式，在「管理部署」選取既有部署並建立新版本，沿用原查詢網址。

## 資料更新

每次搜尋即時讀取 Google Sheet。手動修改或內網排程成功更新試算表後，下一次搜尋即可取得新資料。內網排程可用 `ConnectionStrings["iPSConnectionString"]` 從 `M_BP_Supplier` 讀取指定三欄，再以 Sheets API 完整更新資料分頁。這個 repo 提供查詢頁，內網排程需另外部署。

`PAY_TERMS_FN` 空白和 `0301` 都顯示「工程-5日/20日電匯」，未知代碼會顯示原代碼。
