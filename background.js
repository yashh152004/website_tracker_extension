let activeDomain = null;
let startTime = null;

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function saveTime() {
  if (!activeDomain || !startTime) return;
  const elapsed = Date.now() - startTime; // in ms
  const today = getTodayKey();

  chrome.storage.local.get([today], (data) => {
    const dayData = data[today] || {};
    dayData[activeDomain] = (dayData[activeDomain] || 0) + elapsed;
    chrome.storage.local.set({ [today]: dayData });
  });

  startTime = Date.now();
}

// Track active tab change
chrome.tabs.onActivated.addListener(async (info) => {
  saveTime();
  const tab = await chrome.tabs.get(info.tabId);
  if (tab && tab.url.startsWith("http")) {
    activeDomain = new URL(tab.url).hostname;
    startTime = Date.now();
  } else {
    activeDomain = null;
  }
});

// Track tab URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url.startsWith("http")) {
    saveTime();
    activeDomain = new URL(tab.url).hostname;
    startTime = Date.now();
  }
});

// Track window focus changes
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  saveTime();
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    activeDomain = null;
  } else {
    const [tab] = await chrome.tabs.query({ active: true, windowId });
    if (tab && tab.url.startsWith("http")) {
      activeDomain = new URL(tab.url).hostname;
      startTime = Date.now();
    }
  }
});
