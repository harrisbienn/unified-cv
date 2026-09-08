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
const generatedCvTitle = document.querySelector(".cv-heading + h1");
const sectionHeadings = [
  ...document.querySelectorAll(".cv-document > h1"),
].filter((heading) => heading !== generatedCvTitle);

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

const proficiencyLogos = new Map([
  ["ArcGIS Pro", "arcgis"],
  ["ArcGIS Enterprise", "arcgis"],
  ["ArcGIS Experience Builder", "arcgis"],
  ["ArcGIS Dashboards", "arcgis"],
  ["ArcMap", "arcgis"],
  ["QGIS", "qgis"],
  ["OpenStreetMap", "openstreetmap"],
  ["Python", "python"],
  ["JavaScript", "javascript"],
  ["R", "r"],
  ["Jupyter", "jupyter"],
  ["Databricks", "databricks"],
  ["RStudio", "rstudioide"],
  ["PyCharm", "pycharm"],
  ["scikit-learn", "scikitlearn"],
  ["TensorFlow", "tensorflow"],
  ["ArcGIS Online", "arcgis"],
  ["macOS", "apple"],
  ["Linux", "linux"],
  ["Ubuntu", "ubuntu"],
  ["CentOS", "centos"],
  ["ArcGIS ModelBuilder", "arcgis"],
]);

function shieldMessage(value) {
  return value
    .replaceAll("-", "--")
    .replaceAll("_", "__")
    .replaceAll(" ", "_");
}

function proficiencyShieldUrl(proficiency) {
  const logo = proficiencyLogos.get(proficiency);
  const parameters = new URLSearchParams({ style: "flat-square" });
  if (logo) {
    parameters.set("logo", logo);
    parameters.set("logoColor", "white");
    parameters.set("logoSize", "auto");
  }

  const message = shieldMessage(proficiency);
  return `https://img.shields.io/badge/${message}-125e57?${parameters}`;
}

function enhanceProficiencies() {
  const heading = document.querySelector("#technical-proficiencies");
  if (!heading) return;

  const entries = [];
  let currentNode = heading.nextElementSibling;
  while (currentNode && currentNode.tagName !== "H1") {
    if (currentNode.tagName === "P" && currentNode.querySelector("strong")) {
      entries.push(currentNode);
    }
    currentNode = currentNode.nextElementSibling;
  }

  if (!entries.length) return;

  const instructions = document.createElement("p");
  instructions.className = "proficiency-instructions";
  instructions.textContent = "Select a category to explore individual proficiencies.";

  const accordion = document.createElement("div");
  accordion.className = "proficiency-accordion";

  entries.forEach((entry) => {
    const source = entry.cloneNode(true);
    const label = source.querySelector("strong");
    const category = label?.textContent.replace(/:\s*$/, "").trim();
    label?.remove();

    const proficiencies = source.textContent
      .replace(/^:\s*/, "")
      .split(/\s*·\s*/)
      .map((proficiency) => proficiency.trim())
      .filter(Boolean);

    if (!category || !proficiencies.length) return;

    const group = document.createElement("details");
    group.className = "proficiency-group";

    const summary = document.createElement("summary");
    const categoryLabel = document.createElement("span");
    categoryLabel.className = "proficiency-category";
    categoryLabel.textContent = category;

    const count = document.createElement("span");
    count.className = "proficiency-count";
    count.textContent = `${proficiencies.length} ${
      proficiencies.length === 1 ? "proficiency" : "proficiencies"
    }`;
    summary.append(categoryLabel, count);

    const badges = document.createElement("div");
    badges.className = "proficiency-badges";
    badges.setAttribute("role", "list");
    badges.setAttribute("aria-label", `${category} proficiencies`);

    proficiencies.forEach((proficiency) => {
      const badge = document.createElement("span");
      badge.className = "proficiency-badge";
      badge.setAttribute("role", "listitem");
      badge.setAttribute("aria-label", proficiency);

      const fallback = document.createElement("span");
      fallback.className = "proficiency-badge-fallback";
      fallback.textContent = proficiency;

      const image = document.createElement("img");
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";
      image.dataset.src = proficiencyShieldUrl(proficiency);
      image.addEventListener("load", () => badge.classList.add("is-shielded"), {
        once: true,
      });
      image.addEventListener("error", () => image.remove(), { once: true });

      badge.append(fallback, image);
      badges.append(badge);
    });

    group.append(summary, badges);
    group.addEventListener("toggle", () => {
      if (!group.open || group.dataset.shieldsRequested) return;
      group.dataset.shieldsRequested = "true";
      group.querySelectorAll("img[data-src]").forEach((image) => {
        image.src = image.dataset.src;
        image.removeAttribute("data-src");
      });
    });
    accordion.append(group);
    entry.remove();
  });

  heading.after(instructions, accordion);
}

enhanceProficiencies();

const publicationThumbnails = new Map([
  [
    "10.1016/j.jenvman.2022.115589",
    {
      src: "assets/publications/habitat-restoration.jpg",
      alt: "Cover of the Journal of Environmental Management",
    },
  ],
  [
    "10.1016/j.ecoena.2019.100015",
    {
      src: "assets/publications/coastal-community-nbs.jpg",
      alt: "First page of Engaging coastal community members about natural and nature-based solutions",
    },
  ],
  [
    "10.1007/s10109-019-00313-2",
    {
      src: "assets/publications/participatory-modeling.jpg",
      alt: "First page of Elevating local knowledge through participatory modeling",
    },
  ],
  [
    "10.34237/1008819",
    {
      src: "assets/publications/double-exposure.jpg",
      alt: "First page of Double exposure and dynamic vulnerability",
    },
  ],
  [
    "10.1061/(ASCE)HY.1943-7900.0001659",
    {
      src: "assets/publications/predictive-tools.jpg",
      alt: "First page of Knowledge-based predictive tools for coastal restoration and protection planning",
    },
  ],
  [
    "10.34237/1008813",
    {
      src: "assets/publications/gulf-wide-data.jpg",
      alt: "First page of Gulf-wide data synthesis for restoration planning",
    },
  ],
  [
    "10.1016/j.ecolind.2017.10.005",
    {
      src: "assets/publications/freshwater-inflow.jpg",
      alt: "First page of Modeling current and future freshwater inflow needs of a subtropical estuary",
    },
  ],
]);

function generatedSectionEntries(sectionHeading) {
  const entries = [];
  let currentEntry;
  let currentNode = sectionHeading.nextElementSibling;

  while (currentNode && currentNode.tagName !== "H1") {
    const nextNode = currentNode.nextElementSibling;
    if (currentNode.tagName === "H2") {
      currentEntry = { heading: currentNode, details: [] };
      entries.push(currentEntry);
    } else if (currentEntry) {
      currentEntry.details.push(currentNode);
    }
    currentNode = nextNode;
  }

  return entries;
}

function normalizeSplitHeading(heading, titleClass, locationClass) {
  const parts = [...heading.children].filter(
    (child) => child.tagName === "STRONG",
  );
  if (!parts.length) return;

  const title = document.createElement("span");
  title.className = titleClass;
  title.textContent = parts[0].textContent;

  const normalizedParts = [title];
  if (parts[1]) {
    const location = document.createElement("span");
    location.className = locationClass;
    location.textContent = parts[1].textContent;
    normalizedParts.push(location);
  }

  heading.replaceChildren(...normalizedParts);
}

function militaryHonorList(summary) {
  const honors = summary
    .split(/\s*;\s*/)
    .map((honor) => honor.replace(/^and\s+/i, "").replace(/\.$/, "").trim())
    .filter(Boolean);

  const list = document.createElement("ul");
  list.className = "award-honor-list";
  honors.forEach((honor) => {
    const item = document.createElement("li");
    item.textContent = honor.charAt(0).toUpperCase() + honor.slice(1);
    list.append(item);
  });

  return list;
}

function enhanceEntryCards(headingId, cardType) {
  const sectionHeading = document.querySelector(`#${headingId}`);
  if (!sectionHeading) return;

  const entries = generatedSectionEntries(sectionHeading);
  if (!entries.length) return;

  const cardList = document.createElement("div");
  cardList.className = `cv-card-list ${cardType}-card-list`;
  cardList.setAttribute("role", "list");

  entries.forEach((entry) => {
    const card = document.createElement("article");
    card.className = `cv-entry-card ${cardType}-card`;
    card.setAttribute("role", "listitem");

    const body = document.createElement("div");
    body.className = "entry-card-body";

    const dateNode = entry.details.find((node) => node.tagName === "P");
    if (dateNode) {
      const date = document.createElement("span");
      date.className = "entry-card-date";
      date.textContent = dateNode.textContent;
      body.append(date);
      dateNode.remove();
    }

    entry.heading.classList.add("entry-card-title");
    if (cardType === "presentation") {
      normalizeSplitHeading(
        entry.heading,
        "presentation-title",
        "presentation-location",
      );
    } else if (cardType === "award") {
      normalizeSplitHeading(entry.heading, "award-title", "award-location");
    }
    body.append(entry.heading);

    const isMilitaryHonors =
      cardType === "award" &&
      entry.heading.textContent.trim().toLowerCase() ===
        "military service honors";
    const militarySummary = isMilitaryHonors
      ? entry.details.find(
          (node) => node !== dateNode && node.tagName === "P",
        )
      : null;

    entry.details.forEach((node) => {
      if (node === dateNode) return;
      if (node === militarySummary) {
        body.append(militaryHonorList(node.textContent));
        node.remove();
      } else {
        body.append(node);
      }
    });

    if (cardType === "publication") {
      const doiLink = body.querySelector('a[href^="https://doi.org/"]');
      const thumbnail = publicationThumbnails.get(doiLink?.textContent.trim());
      if (doiLink && thumbnail) {
        const thumbnailLink = document.createElement("a");
        thumbnailLink.className = "publication-thumbnail";
        thumbnailLink.href = doiLink.href;
        thumbnailLink.setAttribute(
          "aria-label",
          `Open ${entry.heading.textContent.trim()} via DOI`,
        );

        const image = document.createElement("img");
        image.src = thumbnail.src;
        image.alt = thumbnail.alt;
        image.width = 360;
        image.height = 480;
        image.loading = "lazy";
        image.decoding = "async";
        image.addEventListener("error", () => thumbnailLink.remove(), {
          once: true,
        });

        thumbnailLink.append(image);
        card.append(thumbnailLink);
      }
    }

    card.append(body);
    cardList.append(card);
  });

  sectionHeading.after(cardList);
}

enhanceEntryCards("peer-reviewed-publications", "publication");
enhanceEntryCards("presentations", "presentation");
enhanceEntryCards("awards-and-honors", "award");

const profileCardIcons = new Map([
  ["BirdNET", "♪"],
  ["SpatioTemporal Asset Catalog", "◇"],
  ["Outdoor pursuits", "↟"],
  ["Community service", "♥"],
]);

function enhanceLabeledCardSection(headingId) {
  const heading = document.querySelector(`#${headingId}`);
  if (!heading) return;

  const entries = [];
  let currentNode = heading.nextElementSibling;
  while (currentNode && currentNode.tagName !== "H1") {
    const nextNode = currentNode.nextElementSibling;
    if (currentNode.tagName === "P" && currentNode.querySelector("strong")) {
      entries.push(currentNode);
    }
    currentNode = nextNode;
  }

  if (!entries.length) return;

  const cardList = document.createElement("div");
  cardList.className = "profile-card-list";
  cardList.setAttribute("role", "list");

  entries.forEach((entry) => {
    const source = entry.cloneNode(true);
    const sourceLabel = source.querySelector("strong");
    const label = sourceLabel?.textContent.replace(/:\s*$/, "").trim();
    sourceLabel?.remove();
    const description = source.textContent.replace(/^:\s*/, "").trim();
    if (!label || !description) return;

    const card = document.createElement("article");
    card.className = "profile-card";
    card.setAttribute("role", "listitem");

    const icon = document.createElement("span");
    icon.className = "profile-card-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = profileCardIcons.get(label) || "•";

    const content = document.createElement("div");
    content.className = "profile-card-content";

    const title = document.createElement("h2");
    title.className = "profile-card-title";
    title.textContent = label;

    const copy = document.createElement("p");
    copy.className = "profile-card-description";
    copy.textContent = description;

    content.append(title, copy);
    card.append(icon, content);
    cardList.append(card);
    entry.remove();
  });

  heading.after(cardList);
}

enhanceLabeledCardSection("open-source-and-civic-technology");
enhanceLabeledCardSection("community-and-interests");

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
