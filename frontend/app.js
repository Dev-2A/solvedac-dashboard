const API_BASE = "http://127.0.0.1:8000/api";

let levelChart = null;
let tagChart = null;

// 티어 색상 매핑
const tierColors = [
  "#2d2d2d", // Unrated (0)
  "#ad5600", "#ad5600", "#ad5600", "#ad5600", "#ad5600", // Bronze (1-5)
  "#435f7a", "#435f7a", "#435f7a", "#435f7a", "#435f7a", // Silver (6-10)
  "#ec9a00", "#ec9a00", "#ec9a00", "#ec9a00", "#ec9a00", // Gold (11-15)
  "#27e2a4", "#27e2a4", "#27e2a4", "#27e2a4", "#27e2a4", // Platinum (16-20)
  "#00b4fc", "#00b4fc", "#00b4fc", "#00b4fc", "#00b4fc", // Diamond (21-25)
  "#ff0062", "#ff0062", "#ff0062", "#ff0062", "#ff0062", // Ruby (26-30)
  "#b300e0", // Master (31)
];

// 난이도 라벨
const levelLabels = [
  "Unrated",
  "B5", "B4", "B3", "B2", "B1",
  "S5", "S4", "S3", "S2", "S1",
  "G5", "G4", "G3", "G2", "G1",
  "P5", "P4", "P3", "P2", "P1",
  "D5", "D4", "D3", "D2", "D1",
  "R5", "R4", "R3", "R2", "R1",
  "M",
];

async function loadUserData() {
  const handle = document.getElementById("handleInput").value.trim();
  if (!handle) {
    showError("아이디를 입력해주세요.");
    return;
  }

  showLoading(true);
  hideError();

  try {
    // 프로필, 난이도별 통계, 태그별 통계 동시 요청
    const [profile, stats, tags] = await Promise.all([
      fetch(`${API_BASE}/user/${handle}`).then((r) => r.json()),
      fetch(`${API_BASE}/user/${handle}/stats`).then((r) => r.json()),
      fetch(`${API_BASE}/user/${handle}/tags`).then((r) => r.json()),
    ]);

    displayProfile(profile);
    displayLevelChart(stats);
    displayTagChart(tags);
  } catch (error) {
    showError(`사용자를 찾을 수 없습니다: ${handle}`);
    console.error(error);
  } finally {
    showLoading(false);
  }
}

function displayProfile(profile) {
  const card = document.getElementById("profileCard");
  const image = document.getElementById("profileImage");
  const handle = document.getElementById("profileHandle");
  const solved = document.getElementById("solvedCount");
  const rating = document.getElementById("rating");
  const ranking = document.getElementById("ranking");
  const streak = document.getElementById("maxStreak");

  // 요소 존재 여부 디버깅
  console.log("Elements found:", {
    card: !!card,
    image: !!image,
    handle: !!handle,
    solved: !!solved,
    rating: !!rating,
    ranking: !!ranking,
    streak: !!streak,
  });

  if (card) card.classList.add("show");
  if (image) image.src = profile.profile_image_url || "https://static.solved.ac/misc/default_profile.png";
  if (handle) handle.textContent = profile.handle;
  if (solved) solved.textContent = profile.solved_count.toLocaleString();
  if (rating) rating.textContent = profile.rating.toLocaleString();
  if (ranking) ranking.textContent = profile.ranking?.toLocaleString() || "-";
  if (streak) streak.textContent = profile.max_streak.toLocaleString();
}

function displayLevelChart(stats) {
  const ctx = document.getElementById("levelChart").getContext("2d");

  // 기존 차트 파괴
  if (levelChart) {
    levelChart.destroy();
  }

  const data = stats.map((s) => s.solved);
  const colors = stats.map((s) => tierColors[s.level] || "#333");

  levelChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: stats.map((s) => levelLabels[s.level] || s.level),
      datasets: [
        {
          label: "푼 문제 수",
          data: data,
          backgroundColor: colors,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: "#aaa" },
          grid: { color: "#333" },
        },
        x: {
          ticks: { color: "#aaa" },
          grid: { display: false },
        },
      },
    },
  });
}

function displayTagChart(tags) {
  const ctx = document.getElementById("tagChart").getContext("2d");

  // 기존 차트 파괴
  if (tagChart) {
      tagChart.destroy();
  }

  // 상위 10개 태그만
  const topTags = tags.sort((a, b) => b.solved - a.solved).slice(0, 10);

  tagChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: topTags.map((t) => t.tag_name),
      datasets: [
        {
          data: topTags.map((t) => t.solved),
          backgroundColor: [
            "#17d4a5",
            "#00b4fc",
            "#ec9a00",
            "#ff0062",
            "#b300e0",
            "#435f7a",
            "#ad5600",
            "#27e2a4",
            "#ff6b6b",
            "#4ecdc4",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "right",
          labels: { color: "#eee" },
        },
      },
    },
  });
}

function showLoading(show) {
  document.getElementById("loading").style.display = show ? "block" : "none";
}

function showError(message) {
  const errorEl = document.getElementById("error");
  errorEl.textContent = message;
  errorEl.style.display = "block";
  document.getElementById("profileCard").classList.remove("show");
}

function hideError() {
  document.getElementById("error").style.display = "none";
}

// Enter 키로 검색
document.getElementById("handleInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    loadUserData();
  }
});