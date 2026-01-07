const timeList = document.getElementById("timeList");

chrome.storage.local.get(null, (items) => {
  const domains = Object.keys(items);
  if (domains.length === 0) {
    timeList.innerText = "No data yet!";
    return;
  }

  domains.forEach(domain => {
    const timeMs = items[domain];
    const seconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const displayTime = minutes > 0 ? `${minutes} min ${seconds % 60} sec` : `${seconds} sec`;

    const div = document.createElement("div");
    div.innerText = `${domain}: ${displayTime}`;
    timeList.appendChild(div);
  });
});
