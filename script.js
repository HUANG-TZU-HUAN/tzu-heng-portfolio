const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  }
);

revealElements.forEach((el, index) => {
  el.style.transitionDelay = `${index * 90}ms`;
  observer.observe(el);
});

const yearNode = document.getElementById("year");
if (yearNode) {
  yearNode.textContent = new Date().getFullYear().toString();
}

function buildEvidenceCard(item) {
  const card = document.createElement("article");
  card.className = "card evidence-card";

  const title = document.createElement("h3");
  title.textContent = item.title || "Untitled Item";
  card.appendChild(title);

  const meta = document.createElement("p");
  meta.className = "evidence-meta";
  const metaParts = [item.category, item.type || "Document", item.date].filter(Boolean);
  meta.textContent = metaParts.join(" | ");
  card.appendChild(meta);

  if (item.description) {
    const desc = document.createElement("p");
    desc.className = "evidence-desc";
    desc.textContent = item.description;
    card.appendChild(desc);
  }

  const link = document.createElement("a");
  link.className = "project-link";
  link.href = item.url || "#";
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = item.label || "Open";
  card.appendChild(link);

  return card;
}

async function renderEvidence() {
  const mount = document.getElementById("evidence-list");
  if (!mount) {
    return;
  }

  try {
    const response = await fetch("data/evidence.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to load evidence.json");
    }

    const items = await response.json();
    if (!Array.isArray(items) || items.length === 0) {
      mount.innerHTML = '<p class="evidence-empty">No documents yet.</p>';
      return;
    }

    items.forEach((item) => {
      mount.appendChild(buildEvidenceCard(item));
    });
  } catch (_error) {
    mount.innerHTML = '<p class="evidence-empty">Unable to load supporting documents.</p>';
  }
}

renderEvidence();
