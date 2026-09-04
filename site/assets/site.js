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

function enhanceTimeline(headingId, instructionText) {
  const sectionHeading = document.querySelector(`#${headingId}`);
  if (!sectionHeading) return;

  const sectionNodes = [];
  let currentNode = sectionHeading.nextElementSibling;
  while (currentNode && currentNode.tagName !== "H1") {
    sectionNodes.push(currentNode);
    currentNode = currentNode.nextElementSibling;
  }

  const entries = [];
  let currentEntry;
  for (const node of sectionNodes) {
    if (node.tagName === "H2") {
      currentEntry = { heading: node, details: [] };
      entries.push(currentEntry);
    } else if (currentEntry) {
      currentEntry.details.push(node);
    }
  }

  if (!entries.length) return;

  const instructions = document.createElement("p");
  instructions.className = "timeline-instructions";
  instructions.textContent = instructionText;

  const timeline = document.createElement("div");
  timeline.className = "cv-timeline";
  timeline.setAttribute("role", "list");

  entries.forEach((entry) => {
    const dateNode = entry.details.find((node) => node.tagName === "P");
    const timelineItem = document.createElement("div");
    timelineItem.className = "timeline-item";
    timelineItem.setAttribute("role", "listitem");

    const disclosure = document.createElement("details");
    disclosure.className = "timeline-entry";

    const summary = document.createElement("summary");
    const heading = document.createElement("h2");
    heading.innerHTML = entry.heading.innerHTML;
    const headingText = Array.from(heading.childNodes).find(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
    );
    if (headingText) {
      const [affiliationText, locationText] = headingText.textContent
        .replace(/^\s*,\s*/, "")
        .split(/\s+--\s+/, 2);
      const affiliation = document.createElement("span");
      affiliation.className = "timeline-affiliation";
      affiliation.textContent = affiliationText.trim();
      headingText.replaceWith(affiliation);

      if (locationText) {
        const location = document.createElement("span");
        location.className = "timeline-location";
        location.textContent = locationText.trim();
        affiliation.after(location);
      }
    }

    if (dateNode) {
      const date = document.createElement("span");
      date.className = "timeline-date";
      date.textContent = dateNode.textContent;
      heading.append(date);
    }

    const content = document.createElement("div");
    content.className = "timeline-content";
    entry.details.forEach((node) => {
      if (node !== dateNode) content.append(node);
    });

    summary.append(heading);
    disclosure.append(summary, content);
    timelineItem.append(disclosure);
    timeline.append(timelineItem);
    entry.heading.remove();
    dateNode?.remove();
  });

  sectionHeading.after(instructions, timeline);
}

enhanceTimeline(
  "professional-experience",
  "Select a role to view its details.",
);
enhanceTimeline(
  "education-and-training",
  "Select an education or training entry to view its details.",
);

const specialtyBadges = [
  {
    label: "Flood Risk",
    src: "https://img.shields.io/badge/Flood_Risk-0F6B78?style=flat-square",
  },
  {
    label: "Spatial Analysis",
    src: "https://img.shields.io/badge/Spatial_Analysis-0F6B78?style=flat-square",
  },
  {
    label: "Scientific Visualization",
    src: "https://img.shields.io/badge/Scientific_Visualization-0F6B78?style=flat-square",
  },
  {
    label: "Python",
    src: "https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white",
  },
  {
    label: "ArcGIS",
    src: "https://img.shields.io/badge/ArcGIS-2C7AC3?style=flat-square&logo=arcgis&logoColor=white",
  },
  {
    label: "SQL",
    src: "https://img.shields.io/badge/SQL-336791?style=flat-square",
  },
  {
    label: "Claude",
    src: "https://img.shields.io/badge/Claude-D97757?style=flat-square&logo=anthropic&logoColor=white",
  },
  {
    label: "OpenAI Codex",
    src: "https://img.shields.io/badge/OpenAI_Codex-412991?style=flat-square&logo=openai&logoColor=white",
  },
  {
    label: "DevOps",
    src: "https://img.shields.io/badge/DevOps-2088FF?style=flat-square&logo=githubactions&logoColor=white",
  },
  {
    label: "Containers",
    src: "https://img.shields.io/badge/Containers-2496ED?style=flat-square&logo=docker&logoColor=white",
  },
  {
    label: "AWS",
    src: "https://img.shields.io/badge/AWS-FF9900?style=flat-square",
  },
];

function enhanceSpecialties() {
  const heading = document.querySelector(
    "#project-contributions-and-specialties",
  );
  const list = heading?.nextElementSibling;
  if (!heading || list?.tagName !== "UL") return;

  list.classList.add("specialty-grid");

  const showcase = document.createElement("div");
  showcase.className = "specialty-showcase";

  const label = document.createElement("p");
  label.className = "specialty-showcase-label";
  label.textContent = "Working toolkit";

  const badges = document.createElement("div");
  badges.className = "specialty-badges";
  badges.setAttribute("role", "list");
  badges.setAttribute("aria-label", "Highlighted specialties and tools");

  specialtyBadges.forEach((badge) => {
    const item = document.createElement("span");
    item.className = "specialty-badge";
    item.setAttribute("role", "listitem");
    item.setAttribute("aria-label", badge.label);

    const fallback = document.createElement("span");
    fallback.className = "specialty-badge-fallback";
    fallback.textContent = badge.label;

    const image = document.createElement("img");
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("load", () => item.classList.add("is-loaded"), {
      once: true,
    });
    image.src = badge.src;

    item.append(fallback, image);
    badges.append(item);
  });

  showcase.append(label, badges);
  heading.after(showcase);
}

enhanceSpecialties();

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
