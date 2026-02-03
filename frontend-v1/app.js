const API_BASE = "http://127.0.0.1:8000/api";

let levelChart = null;
let tagChart = null;

// 티어 색상 매핑
const tierColors = [
  "#2d2d2d", // Unrated (0)
  "#ad5600",
  "#ad5600",
  "#ad5600",
  "#ad5600",
  "#ad5600", // Bronze (1-5)
  "#435f7a",
  "#435f7a",
  "#435f7a",
  "#435f7a",
  "#435f7a", // Silver (6-10)
  "#ec9a00",
  "#ec9a00",
  "#ec9a00",
  "#ec9a00",
  "#ec9a00", // Gold (11-15)
  "#27e2a4",
  "#27e2a4",
  "#27e2a4",
  "#27e2a4",
  "#27e2a4", // Platinum (16-20)
  "#00b4fc",
  "#00b4fc",
  "#00b4fc",
  "#00b4fc",
  "#00b4fc", // Diamond (21-25)
  "#ff0062",
  "#ff0062",
  "#ff0062",
  "#ff0062",
  "#ff0062", // Ruby (26-30)
  "#b300e0", // Master (31)
];

// 난이도 라벨
const levelLabels = [
  "Unrated",
  "B5",
  "B4",
  "B3",
  "B2",
  "B1",
  "S5",
  "S4",
  "S3",
  "S2",
  "S1",
  "G5",
  "G4",
  "G3",
  "G2",
  "G1",
  "P5",
  "P4",
  "P3",
  "P2",
  "P1",
  "D5",
  "D4",
  "D3",
  "D2",
  "D1",
  "R5",
  "R4",
  "R3",
  "R2",
  "R1",
  "M",
];

const tierNames = [
  "Unrated",
  "Bronze V",
  "Bronze IV",
  "Bronze III",
  "Bronze II",
  "Bronze I",
  "Silver V",
  "Silver IV",
  "Silver III",
  "Silver II",
  "Silver I",
  "Gold V",
  "Gold IV",
  "Gold III",
  "Gold II",
  "Gold I",
  "Platinum V",
  "Platinum IV",
  "Platinum III",
  "Platinum II",
  "Platinum I",
  "Diamond V",
  "Diamond IV",
  "Diamond III",
  "Diamond II",
  "Diamond I",
  "Ruby V",
  "Ruby IV",
  "Ruby III",
  "Ruby II",
  "Ruby I",
  "Master",
];

const RECENT_SEARCHES_KEY = "solvedac_recent_searches";
const MAX_RECENT_SEARCHES = 5;

function getTierBadgeUrl(tier) {
  return `https://static.solved.ac/tier_small/${tier}.svg`;
}

function getRecentSearches() {
  const data = localStorage.getItem(RECENT_SEARCHES_KEY);
  return data ? JSON.parse(data) : [];
}

function saveRecentSearch(handle) {
  let searches = getRecentSearches();
  // 중복 제거
  searches = searches.filter((h) => h !== handle);
  // 맨 앞에 추가
  searches.unshift(handle);
  // 최대 개수 유지
  searches = searches.slice(0, MAX_RECENT_SEARCHES);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
  displayRecentSearches();
}

function displayRecentSearches() {
  const container = document.getElementById("recentSearches");
  const list = document.getElementById("recentList");
  const searches = getRecentSearches();

  if (!container || !list) return;

  if (searches.length === 0) {
    container.classList.remove("show");
    return;
  }

  container.classList.add("show");
  list.innerHTML = "";

  searches.forEach((handle) => {
    const item = document.createElement("span");
    item.className = "recent-item";
    item.textContent = handle;
    item.onclick = () => {
      document.getElementById("handleInput").value = handle;
      loadUserData();
    };
    list.appendChild(item);
  });
}

async function loadUserData() {
  const handle = document.getElementById("handleInput").value.trim();
  if (!handle) {
    showError("아이디를 입력해주세요.");
    return;
  }

  showLoading(true);
  hideError();

  try {
    const [profileRes, statsRes, tagsRes, grassRes, problemsRes] =
      await Promise.all([
        fetch(`${API_BASE}/user/${handle}`),
        fetch(`${API_BASE}/user/${handle}/stats`),
        fetch(`${API_BASE}/user/${handle}/tags`),
        fetch(`${API_BASE}/user/${handle}/grass`),
        fetch(`${API_BASE}/user/${handle}/problems`),
      ]);

    if (
      !profileRes.ok ||
      !statsRes.ok ||
      !tagsRes.ok ||
      !grassRes.ok ||
      !problemsRes.ok
    ) {
      throw new Error("API 요청 실패");
    }

    const profile = await profileRes.json();
    const stats = await statsRes.json();
    const tags = await tagsRes.json();
    const grass = await grassRes.json();
    const problems = await problemsRes.json();

    displayProfile(profile);
    displayLevelChart(stats);
    displayTagChart(tags);
    displayGrass(grass);
    displayProblems(problems);
    saveRecentSearch(handle);

    document.getElementById("chartsGrid").classList.add("show");
  } catch (error) {
    showError(`사용자를 찾을 수 없습니다: ${handle}`);
    console.error("에러 상세:", error);
  } finally {
    showLoading(false);
  }
}

function displayProfile(profile) {
  const card = document.getElementById("profileCard");
  const image = document.getElementById("profileImage");
  const handle = document.getElementById("profileHandle");
  const tierBadge = document.getElementById("tierBadge");
  const tierNameEl = document.getElementById("tierName");
  const solved = document.getElementById("solvedCount");
  const rating = document.getElementById("rating");
  const ranking = document.getElementById("ranking");
  const streak = document.getElementById("maxStreak");

  if (card) card.classList.add("show");
  if (image)
    image.src =
      profile.profile_image_url ||
      "https://static.solved.ac/misc/default_profile.png";
  if (handle) handle.textContent = profile.handle;
  if (tierBadge) tierBadge.src = getTierBadgeUrl(profile.tier);
  if (tierNameEl) tierNameEl.textContent = tierNames[profile.tier] || "Unrated";
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

function displayGrass(grassData) {
  const section = document.getElementById("grassSection");
  const container = document.getElementById("grassContainer");
  const currentStreak = document.getElementById("currentStreak");
  const longestStreak = document.getElementById("longestStreak");

  if (section) section.classList.add("show");
  if (currentStreak) currentStreak.textContent = grassData.current_streak;
  if (longestStreak) longestStreak.textContent = grassData.longest_streak;

  if (!container) return;

  // 날짜별 value 맵 생성
  const grassMap = {};
  grassData.grass.forEach((item) => {
    grassMap[item.date] = item.value;
  });

  // 최근 1년 날짜 생성 (일요일 시작)
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  // 시작일을 일요일로 맞춤
  const startDate = new Date(oneYearAgo);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  container.innerHTML = "";

  // 53주 x 7일 그리드 생성
  const days = [];
  const currentDate = new Date(startDate);

  while (currentDate <= today) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  days.forEach((date) => {
    const dateStr = date.toISOString().split("T")[0];
    const value = grassMap[dateStr];

    const dayEl = document.createElement("div");
    dayEl.className = "grass-day";
    dayEl.title = `${dateStr}: ${value || 0}문제`;

    if (value === "frozen") {
      dayEl.style.backgroundColor = "#00b4fc";
      dayEl.title = `${dateStr}: 프리즌`;
    } else if (value >= 10) {
      dayEl.style.backgroundColor = "#39d353";
    } else if (value >= 5) {
      dayEl.style.backgroundColor = "#26a641";
    } else if (value >= 3) {
      dayEl.style.backgroundColor = "#006d32";
    } else if (value >= 1) {
      dayEl.style.backgroundColor = "#0e4429";
    }

    container.appendChild(dayEl);
  });
}

function displayProblems(problemData) {
  const section = document.getElementById("problemsSection");
  const list = document.getElementById("problemList");

  if (section) section.classList.add("show");
  if (!list) return;

  list.innerHTML = "";

  problemData.items.forEach((problem) => {
    const li = document.createElement("li");
    li.className = "problem-item";

    const tierColor = tierColors[problem.level] || "#333";
    const tierName = levelLabels[problem.level] || "?";

    li.innerHTML = `
            <img src="${getTierBadgeUrl(problem.level)}" alt="${tierName}" width="20" height="20">
            <div class="problem-info">
                <a class="problem-title" href="https://www.acmicpc.net/problem/${problem.problem_id}" target="_blank">
                  ${problem.title}
                </a>
                <div class="problem-tags">
                  ${problem.tags.map((tag) => `<span class="problem-tag">${tag}</span>`).join("")}
                </div>
            </div>
            <div class="problem-id">#${problem.problem_id}</div>
    `;

    list.appendChild(li);
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

// 페이지 로드 시 최근 검색 표시
document.addEventListener("DOMContentLoaded", () => {
  displayRecentSearches();
});
