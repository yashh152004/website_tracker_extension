let activeTabId = null;
let activeDomain = null;
let startTime = null;

// Track tab changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  saveTime(); // Save time of previous tab
  const tab = await chrome.tabs.get(activeInfo.tabId);
  startTracking(tab);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === activeTabId && changeInfo.status === "complete") {
    saveTime();
    startTracking(tab);
  }
});

function startTracking(tab) {
  activeTabId = tab.id;
  activeDomain = new URL(tab.url).hostname;
  startTime = Date.now();
}

function saveTime() {
  if (!activeDomain || !startTime) return;

  const elapsed = Date.now() - startTime;
  chrome.storage.local.get([activeDomain], (result) => {
    const prevTime = result[activeDomain] || 0;
    const newTime = prevTime + elapsed;
    chrome.storage.local.set({ [activeDomain]: newTime });
  });
}
