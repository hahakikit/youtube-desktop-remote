const YOUTUBE_URLS = ["https://www.youtube.com/*", "https://music.youtube.com/*"];

async function findYouTubeTab() {
  const tabs = await chrome.tabs.query({ url: YOUTUBE_URLS });
  if (!tabs.length) return null;

  const saved = await chrome.storage.session.get("lastYouTubeTabId");
  return tabs.find((tab) => tab.id === saved.lastYouTubeTabId)
    || tabs.find((tab) => tab.audible)
    || tabs.find((tab) => tab.active)
    || tabs.at(-1);
}

async function control(action) {
  const tab = await findYouTubeTab();
  if (!tab?.id) return { ok: false, error: "找不到已打開的 YouTube 影片" };

  await chrome.storage.session.set({ lastYouTubeTabId: tab.id });
  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [action],
      func: (requestedAction) => {
        const video = document.querySelector("video");
        if (!video) return { ok: false, error: "這個分頁暫時沒有影片" };

        if (requestedAction === "toggle") {
          if (video.paused) video.play(); else video.pause();
        } else if (requestedAction.startsWith("back")) {
          const seconds = Number(requestedAction.split(":")[1]) || 10;
          video.currentTime = Math.max(0, video.currentTime - seconds);
        } else if (requestedAction.startsWith("forward")) {
          const seconds = Number(requestedAction.split(":")[1]) || 10;
          video.currentTime = Math.min(video.duration || Infinity, video.currentTime + seconds);
        } else if (requestedAction.startsWith("seek:")) {
          const seconds = Number(requestedAction.slice(5));
          if (Number.isFinite(seconds)) video.currentTime = Math.max(0, Math.min(video.duration || Infinity, seconds));
        } else if (requestedAction === "mute") {
          video.muted = !video.muted;
        } else if (requestedAction.startsWith("volume:")) {
          const volume = Number(requestedAction.slice(7));
          if (Number.isFinite(volume)) {
            video.volume = Math.max(0, Math.min(1, volume / 100));
            video.muted = false;
          }
        }

        return {
          ok: true,
          paused: video.paused,
          muted: video.muted,
          volume: Math.round(video.volume * 100),
          currentTime: video.currentTime,
          duration: Number.isFinite(video.duration) ? video.duration : 0,
          title: document.title.replace(/\s*-\s*YouTube\s*$/, "")
        };
      }
    });
    return result;
  } catch (_) {
    return { ok: false, error: "無法控制影片，請重新載入 YouTube 分頁" };
  }
}

chrome.action.onClicked.addListener(async () => {
  const current = await chrome.windows.getAll({ populate: true, windowTypes: ["popup"] });
  const existing = current.find((window) => window.tabs?.some((tab) => tab.url?.includes("controller.html")));
  if (existing) {
    await chrome.windows.update(existing.id, { focused: true });
    return;
  }
  await chrome.windows.create({
    url: chrome.runtime.getURL("controller.html"),
    type: "popup",
    width: 290,
    height: 218,
    focused: true
  });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "control") return;
  control(message.action).then(sendResponse);
  return true;
});

chrome.commands.onCommand.addListener((command) => {
  const action = { "toggle-play": "toggle", rewind: "back", forward: "forward" }[command];
  if (action) control(action);
});
