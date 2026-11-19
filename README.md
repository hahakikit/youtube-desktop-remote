# YouTube Desktop Remote

A small, discreet desktop controller for YouTube playback—without switching back to the YouTube tab.

一個低調、輕量的 Chrome 迷你遙控器。即使 YouTube 分頁留在背景，也能控制播放、跳轉、進度及音量。

## 功能

- 播放與暫停影片
- 向前或向後跳轉 5、10、30 或 60 秒
- 拖動時間軸，直接跳到影片的指定位置
- 調節影片音量
- 靜音與解除靜音
- 顯示影片名稱、目前時間及總長度
- 支援全域鍵盤快捷鍵
- 支援 YouTube 及 YouTube Music
- 獨立迷你視窗，YouTube 分頁可留在背景
- 無帳號、無廣告、無分析追蹤

## 安裝方法

本擴充功能目前未上架 Chrome Web Store，需要以「未封裝擴充功能」方式安裝。

1. 按 GitHub 頁面右上方的 **Code**。
2. 選擇 **Download ZIP**。
3. 解壓縮下載的 ZIP 檔案。
4. 在 Chrome 網址列輸入 `chrome://extensions`。
5. 開啟右上角的「開發人員模式」。
6. 按「載入未封裝項目」。
7. 選擇包含 `manifest.json` 的 `youtube-remote` 資料夾。
8. 把「YouTube 桌面遙控器」釘選到 Chrome 工具列。

安裝後，先打開一個 YouTube 影片，再按 Chrome 工具列上的擴充功能圖示，即可開啟迷你遙控器。

## 鍵盤快捷鍵

### macOS

- `Command + Shift + Space`：播放／暫停
- `Command + Shift + ←`：後退 10 秒
- `Command + Shift + →`：前進 10 秒

### Windows／Linux

- `Ctrl + Shift + Space`：播放／暫停
- `Ctrl + Shift + ←`：後退 10 秒
- `Ctrl + Shift + →`：前進 10 秒

如快捷鍵與其他程式衝突，可前往 `chrome://extensions/shortcuts` 修改。

## 隱私與權限

本擴充功能採用本機運作，不會把資料傳送到任何伺服器。

- 不會收集或儲存瀏覽記錄
- 不會收集個人資料
- 不會使用分析、追蹤或遙測服務
- 不需要登入或建立帳號
- 不會讀取 YouTube 以外的網站
- 不會下載或重新發布影片內容
- 所有控制指令都只在你的 Chrome 瀏覽器內執行

擴充功能需要以下權限：

- `scripting`：在已開啟的 YouTube 分頁中控制影片播放器
- `storage`：記住目前正在控制的 YouTube 分頁
- `youtube.com` 及 `music.youtube.com`：權限僅限這兩個網站

原始碼完全公開，歡迎自行檢查。

## 注意事項

- Chrome 不允許一般擴充功能強制視窗永遠置頂，因此遙控器可能被其他視窗遮蓋；鍵盤快捷鍵仍可使用。
- YouTube 更新播放器結構後，部分功能可能需要相應調整。
- 重新載入或更新擴充功能後，可能需要重新整理已開啟的 YouTube 分頁。
- 本工具控制的是 YouTube 網頁中的影片音量，不是電腦的系統音量。

## 授權

本專案採用 [MIT License](LICENSE)。你可以自由使用、修改及分享，但請保留原有的授權聲明。

## 免責聲明

This project is independent and is not affiliated with, endorsed by, or sponsored by YouTube or Google. YouTube and Google are trademarks of Google LLC.

本專案是獨立開發的非官方工具，與 YouTube 或 Google 沒有隸屬、認可或贊助關係。
