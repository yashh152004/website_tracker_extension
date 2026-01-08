const timeList = document.getElementById("timeList");
const resetBtn = document.getElementById("resetBtn");
const ctx = document.getElementById("usageChart");

const today = new Date().toISOString().split("T")[0];

chrome.storage.local.get([today], (data) => {
  const dayData = data[today] || {};
  const labels = [];
  const values = [];

  for (const site in dayData) {
    const seconds = Math.floor(dayData[site] / 1000);
    labels.push(site);
    values.push(Math.floor(seconds / 60));

    const div = document.createElement("div");
    div.className = "site";
    div.innerHTML = `<span>${site}</span><span>${seconds}s</span>`;
    timeList.appendChild(div);
  }

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: [
          "#6366f1", "#22c55e", "#f97316", "#ef4444", "#14b8a6"
        ]
      }]
    },
    options: {
      plugins: {
        legend: { display: false }
      }
    }
  });
});

resetBtn.onclick = () => {
  chrome.storage.local.remove(today, () => location.reload());
};
