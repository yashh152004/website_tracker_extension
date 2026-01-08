const timeList = document.getElementById("timeList");
const resetBtn = document.getElementById("resetBtn");

chrome.storage.local.get(null, (items) => {
  const domains = Object.keys(items);

  if (domains.length === 0) {
    timeList.innerHTML = "<p style='text-align:center;color:#777;'>No data yet</p>";
    return;
  }

  domains.forEach(domain => {
    const timeMs = items[domain];
    const totalSeconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const siteDiv = document.createElement("div");
    siteDiv.className = "site";

    siteDiv.innerHTML = `
      <div class="site-name">${domain}</div>
      <div class="site-time">${minutes}m ${seconds}s</div>
    `;

    timeList.appendChild(siteDiv);
  });
});

// Reset button
resetBtn.addEventListener("click", () => {
  chrome.storage.local.clear(() => {
    location.reload();
  });
});
