const documentRoot = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("cv-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light";

function applyTheme(theme) {
  documentRoot.dataset.theme = theme;
  themeToggle?.setAttribute("aria-pressed", String(theme === "dark"));
}

applyTheme(savedTheme || preferredTheme);

themeToggle?.addEventListener("click", () => {
  const theme = documentRoot.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(theme);
  localStorage.setItem("cv-theme", theme);
});

const sectionNavigation = document.querySelector("[data-section-nav]");
const sectionHeadings = [
  ...document.querySelectorAll(".cv-document > h1:not(:first-child)"),
];

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

for (const heading of sectionHeadings) {
  heading.id ||= slugify(heading.textContent);
  const link = document.createElement("a");
  link.href = `#${heading.id}`;
  link.textContent = heading.textContent;
  sectionNavigation?.append(link);
}

if ("IntersectionObserver" in window && sectionNavigation) {
  const links = [...sectionNavigation.querySelectorAll("a")];
  const observer = new IntersectionObserver(
    (entries) => {
      const activeEntry = entries.find((entry) => entry.isIntersecting);
      if (!activeEntry) return;
      for (const link of links) {
        link.toggleAttribute(
          "aria-current",
          link.hash === `#${activeEntry.target.id}`,
        );
      }
    },
    { rootMargin: "-18% 0px -70%", threshold: 0 },
  );

  sectionHeadings.forEach((heading) => observer.observe(heading));
}

const projectSection = document.querySelector("[data-github-user]");
const projectGrid = projectSection?.querySelector("[data-project-grid]");

function formatDate(dateString) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function projectCard(repository) {
  const article = document.createElement("article");
  article.className = "project-card";

  const heading = document.createElement("h3");
  const link = document.createElement("a");
  link.href = repository.html_url;
  link.textContent = repository.name;
  heading.append(link);

  const description = document.createElement("p");
  description.textContent = repository.description || "Public GitHub repository";

  const metadata = document.createElement("div");
  metadata.className = "project-meta";
  const language = document.createElement("span");
  language.textContent = repository.language || "Mixed stack";
  const updated = document.createElement("span");
  updated.textContent = `Updated ${formatDate(repository.updated_at)}`;
  metadata.append(language, updated);

  article.append(heading, description, metadata);
  return article;
}

async function loadProjects() {
  if (!projectSection || !projectGrid) return;
  const username = projectSection.dataset.githubUser;

  try {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=12&type=owner`,
      { headers: { Accept: "application/vnd.github+json" } },
    );

    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);

    const repositories = await response.json();
    const originalRepositories = repositories.filter(
      (repository) => !repository.fork && !repository.archived,
    );
    const featuredRepositories = (
      originalRepositories.length ? originalRepositories : repositories
    ).slice(0, 4);

    projectGrid.replaceChildren();
    if (!featuredRepositories.length) {
      const emptyMessage = document.createElement("p");
      emptyMessage.className = "project-status";
      emptyMessage.textContent = "No public projects are available right now.";
      projectGrid.append(emptyMessage);
      return;
    }

    featuredRepositories.forEach((repository) => {
      projectGrid.append(projectCard(repository));
    });
  } catch (error) {
    const fallback = document.createElement("p");
    fallback.className = "project-status";
    fallback.textContent =
      "GitHub projects could not be loaded. Use the profile link below to browse them directly.";
    projectGrid.replaceChildren(fallback);
  }
}

loadProjects();
