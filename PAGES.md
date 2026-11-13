# GitHub Pages 版部署

1. 在 [BP 的 Pages 設定](https://github.com/ricky-orange/BP/settings/pages) 選 Deploy from a branch，選 main 和 /docs，然後儲存。
2. 開啟 [SAP 廠商付款條件查詢](https://ricky-orange.github.io/BP/) 並測試一筆已知統編。

前端在開啟網頁時讀取 Google Sheets 已發佈的 CSV，在瀏覽器內查詢。使用 SD_SUPPLIER、COM_NAME、PAY_TERMS。請維持試算表的自動重新發佈，Google 更新 CSV 後，重新載入網頁就可讀取更新後的資料。

CSV 可由任何人下載。網站部署不需要 Cloudflare、Apps Script 或 BP_API_SECRET。原本的 Apps Script 查詢頁可以獨立使用。

[已發佈的 CSV](https://docs.google.com/spreadsheets/d/e/2PACX-1vSixigqeW99mSQdJss48AqEJ4gNMhex9-BcUmtRJ-8njbNANXgytX4IwzHMSnl8JintvYu8GIXmfJyi/pub?output=csv)
