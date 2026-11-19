const qs = (selector) => document.querySelector(selector);
let jumpSeconds = 5;
let duration = 0;
let isSeeking = false;
let isAdjustingVolume = false;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

function render(result) {
  if (!result?.ok) {
    qs("#title").textContent = result?.error || "未連接";
    return;
  }
  qs("#title").textContent = result.title || "YouTube";
  qs("#play").textContent = result.paused ? "○" : "●";
  qs("#mute").textContent = "🚫︎";
  qs("#mute").classList.toggle("muted", result.muted);
  if (!isAdjustingVolume) {
    const volume = Number.isFinite(result.volume) ? result.volume : 100;
    qs("#volume").value = volume;
    qs("#volume").style.setProperty("--position", `${volume}%`);
    qs("#volume-value").textContent = volume;
  }
  qs("#current").textContent = formatTime(result.currentTime);
  qs("#duration").textContent = formatTime(result.duration);
  duration = result.duration;
  if (!isSeeking) {
    const percent = result.duration ? result.currentTime / result.duration * 100 : 0;
    qs("#progress").value = percent;
    qs("#progress").style.setProperty("--position", `${percent}%`);
  }
}

async function send(action) {
  const result = await chrome.runtime.sendMessage({ type: "control", action });
  render(result);
}

document.querySelectorAll("button[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    send(action === "back" || action === "forward" ? `${action}:${jumpSeconds}` : action);
  });
});

document.querySelectorAll("button[data-seconds]").forEach((button) => {
  button.addEventListener("click", () => {
    jumpSeconds = Number(button.dataset.seconds);
    document.querySelectorAll("button[data-seconds]").forEach((item) => item.classList.toggle("active", item === button));
    qs("#back small").textContent = jumpSeconds;
    qs("#forward small").textContent = jumpSeconds;
    qs("#back").title = `後退 ${jumpSeconds} 秒`;
    qs("#forward").title = `前進 ${jumpSeconds} 秒`;
  });
});

const progress = qs("#progress");
progress.addEventListener("pointerdown", () => { isSeeking = true; });
progress.addEventListener("input", () => {
  const percent = Number(progress.value);
  progress.style.setProperty("--position", `${percent}%`);
  qs("#current").textContent = formatTime(duration * percent / 100);
});
progress.addEventListener("change", async () => {
  const targetTime = duration * Number(progress.value) / 100;
  await send(`seek:${targetTime}`);
  isSeeking = false;
});
progress.addEventListener("pointerup", () => { isSeeking = false; });

const volume = qs("#volume");
let volumeTimer;
volume.addEventListener("pointerdown", () => { isAdjustingVolume = true; });
volume.addEventListener("input", () => {
  const value = Number(volume.value);
  volume.style.setProperty("--position", `${value}%`);
  qs("#volume-value").textContent = value;
  clearTimeout(volumeTimer);
  volumeTimer = setTimeout(() => {
    chrome.runtime.sendMessage({ type: "control", action: `volume:${value}` });
  }, 50);
});
volume.addEventListener("change", async () => {
  clearTimeout(volumeTimer);
  await send(`volume:${Number(volume.value)}`);
  isAdjustingVolume = false;
});
volume.addEventListener("pointerup", () => { isAdjustingVolume = false; });

send("status");
setInterval(() => send("status"), 1000);
