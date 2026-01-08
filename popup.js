document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("usageChart").getContext("2d");
  const timeList = document.getElementById("timeList");
  const resetBtn = document.getElementById("resetBtn");

  const today = new Date().toISOString().split("T")[0];

  // Load today's usage from storage
  chrome.storage.local.get([today], (result) => {
    if (chrome.runtime.lastError) {
      console.error("Storage error:", chrome.runtime.lastError);
      return;
    }

    const dayData = result[today] || {};
    const labels = [];
    const values = [];

    // Populate list and chart data
    for (const site in dayData) {
      const seconds = Math.floor((dayData[site] || 0) / 1000);
      if (seconds === 0) continue; // skip sites with 0s

      const displayTime = seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m`;

      labels.push(site);
      values.push(seconds); // chart in seconds for better granularity

      const div = document.createElement("div");
      div.className = "site";
      div.innerHTML = `<span>${site}</span><span>${displayTime}</span>`;
      timeList.appendChild(div);
    }

    if (labels.length === 0) {
      timeList.innerHTML = "<p style='text-align:center'>No data yet</p>";
    }

    // Create doughnut chart
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: ["#6366f1", "#22c55e", "#f97316", "#ef4444", "#14b8a6"],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        cutout: "65%",
        plugins: {
          legend: { display: false },
          title: { display: true, text: "Today's Website Usage" }
        }
      }
    });
  });

  // Reset today's data
  resetBtn.onclick = () => {
    chrome.storage.local.remove(today, () => {
      location.reload();
    });
  };
});
