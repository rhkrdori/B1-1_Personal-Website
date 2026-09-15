const CONFIG = {
  name: "채령",
  githubUsername: "rhkrdori",
};

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const themeToggle = document.querySelector(".theme-toggle");
const scrollTopButton = document.querySelector(".scroll-top");
const projectsGrid = document.querySelector("#projects-grid");
const projectDescription = document.querySelector("#project-description");
const filterButton = document.querySelector(".filter-button");
let repositories = [];
let showingFeaturedOnly = false;
const fallbackRepositories = [
  {
    name: "A_Plus_Simulator",
    description: "Unity 3D game",
    html_url: "https://github.com/rhkrdori/A_Plus_Simulator",
    language: "C#",
    stargazers_count: 0,
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    name: "thunder-suryong",
    description:
      "All-in-one study management app with study-plan and quiz features.",
    html_url: "https://github.com/real-jeongeun-park/thunder-suryong",
    language: "JavaScript",
    stargazers_count: 0,
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    name: "Seat-Hunter-front",
    description: "Seat Hunter frontend project",
    html_url: "https://github.com/Seat-Hunter/Seat-Hunter-front",
    language: "JavaScript",
    stargazers_count: 0,
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    name: "Seat-Hunter-back",
    description: "Seat Hunter backend project",
    html_url: "https://github.com/Seat-Hunter/Seat-Hunter-back",
    language: "Python",
    stargazers_count: 0,
    updated_at: "2025-01-01T00:00:00Z",
  },
];

document.querySelectorAll(".owner-name").forEach((element) => {
  element.textContent = CONFIG.name;
});
document.title = `${CONFIG.name} | Portfolio`;

const savedTheme = localStorage.getItem("portfolio-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
setTheme(savedTheme || (prefersDark ? "dark" : "light"));

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.innerHTML = `<span aria-hidden="true">${theme === "dark" ? "☀" : "☾"}</span>`;
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환",
  );
}

themeToggle.addEventListener("click", () => {
  const nextTheme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("portfolio-theme", nextTheme);
  setTheme(nextTheme);
});

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("active");
  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
});

document.querySelectorAll(".nav-menu a").forEach((link) =>
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  }),
);

function updateScrollControls() {
  header.classList.toggle("scrolled", window.scrollY > 60);
  scrollTopButton.classList.toggle("visible", window.scrollY > 300);
}

window.addEventListener("scroll", updateScrollControls, { passive: true });
updateScrollControls();
scrollTopButton.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" }),
);
document.querySelectorAll('a[href="#top"]').forEach((link) =>
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }),
);

const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }),
  { threshold: 0.2 },
);
document
  .querySelectorAll(".reveal")
  .forEach((element) => observer.observe(element));

function renderProjects(notice = "") {
  const displayed = showingFeaturedOnly
    ? repositories.filter(({ stargazers_count }) => stargazers_count > 0)
    : repositories;
  filterButton.textContent = showingFeaturedOnly
    ? "전체 보기"
    : "인기 프로젝트";
  if (!displayed.length) {
    renderProjectState("표시할 프로젝트가 없습니다.");
    return;
  }
  projectsGrid.innerHTML =
    `${notice ? `<div class="api-notice"><p>${notice}</p><button class="retry-button" type="button">다시 시도</button></div>` : ""}` +
    displayed
      .map(
        ({
          name,
          description,
          html_url,
          language,
          stargazers_count,
          updated_at,
        }) => `
    <a class="project-card" href="${html_url}" target="_blank" rel="noopener noreferrer">
      <span class="repo-type">${language || "PROJECT"} / ${new Date(updated_at).getFullYear()}</span><h3>${name}</h3>
      <p>${description || "프로젝트 설명이 아직 등록되지 않았습니다."}</p>
      <div class="project-meta"><span>★ ${stargazers_count}</span><span>자세히 보기 ↗</span></div>
    </a>`,
      )
      .join("");
  const retryButton = document.querySelector(".retry-button");
  if (retryButton) retryButton.addEventListener("click", fetchProjects);
}
function renderProjectState(message, isError = false) {
  projectsGrid.innerHTML = `<div class="project-state">${isError ? `<p>${message}</p><button class="button button-ghost retry-button" type="button">다시 시도</button>` : `<div class="loader" aria-label="로딩 중"></div><p>${message}</p>`}</div>`;
  const retryButton = document.querySelector(".retry-button");
  if (retryButton) retryButton.addEventListener("click", fetchProjects);
}
async function fetchProjects() {
  projectDescription.textContent = `@${CONFIG.githubUsername}의 GitHub 프로젝트`;
  renderProjectState("프로젝트를 불러오는 중입니다…");
  try {
    const response = await fetch(
      `https://api.github.com/users/${CONFIG.githubUsername}/repos?sort=updated&per_page=6`,
    );
    if (!response.ok) throw new Error(`GitHub API ${response.status}`);
    repositories = (await response.json()).filter(({ fork }) => !fork);
    if (!repositories.length) {
      projectsGrid.innerHTML =
        '<div class="project-state"><p>표시할 프로젝트가 없습니다.</p></div>';
      return;
    }
    renderProjects();
  } catch (error) {
    console.error(error);
    repositories = fallbackRepositories;
    projectDescription.textContent =
      "GitHub API 요청 제한으로 예비 프로젝트 목록을 표시하고 있습니다.";
    renderProjects(
      "실시간 프로젝트를 불러올 수 없습니다. 아래 카드는 예비 목록입니다.",
    );
  }
}
filterButton.addEventListener("click", () => {
  showingFeaturedOnly = !showingFeaturedOnly;
  renderProjects();
});

const form = document.querySelector("#contact-form");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function showError(input, message) {
  input.closest(".field").querySelector(".error-message").textContent = message;
}
function validateInput(input) {
  const value = input.value.trim();
  if (!value) {
    showError(input, "필수 입력 항목입니다.");
    return false;
  }
  if (input.type === "email" && !emailPattern.test(value)) {
    showError(input, "이메일 형식을 확인해주세요.");
    return false;
  }
  showError(input, "");
  return true;
}
form
  .querySelectorAll("input, textarea")
  .forEach((input) =>
    input.addEventListener("input", () => validateInput(input)),
  );
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const inputs = [...form.querySelectorAll("input, textarea")];
  const valid = inputs.map(validateInput).every(Boolean);
  const success = form.querySelector(".form-success");
  success.textContent = valid
    ? "메시지를 받았습니다. 빠르게 답장드릴게요!"
    : "";
  if (valid) form.reset();
});

fetchProjects();
