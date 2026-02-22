// ------- Gallery Data (edit this) -------
const GALLERIES = [
  {
    id: "nature",
    title: "Nature",
    description: "Landscapes, plants, and outdoor textures.",
    items: [
      { src: "./assets/nature-1.jpg", title: "Mossy Path", tags: ["forest", "green"] },
      { src: "./assets/nature-2.jpg", title: "Golden Dunes", tags: ["desert", "sunset"] },
      { src: "./assets/nature-3.jpg", title: "Lake Morning", tags: ["water", "mist"] },
    ],
  },
  {
    id: "architecture",
    title: "Architecture",
    description: "Shapes, structures, and city patterns.",
    items: [
      { src: "./assets/architecture-1.jpg", title: "Glass Grid", tags: ["modern", "lines"] },
      { src: "./assets/architecture-2.jpg", title: "Old Stone", tags: ["historic", "texture"] },
      { src: "./assets/architecture-3.jpg", title: "Night Street", tags: ["city", "lights"] },
    ],
  },
  {
    id: "portraits",
    title: "Portraits",
    description: "People, expressions, and studio scenes.",
    items: [
      { src: "./assets/portraits-1.jpg", title: "Soft Light", tags: ["studio", "warm"] },
      { src: "./assets/portraits-2.jpg", title: "Profile", tags: ["mono", "contrast"] },
      { src: "./assets/portraits-3.jpg", title: "Smile", tags: ["candid", "bright"] },
    ],
  },
];

// ------- Helpers -------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

$("#year").textContent = new Date().getFullYear();

const tabs = $("#galleryTabs");
const grid = $("#grid");
const titleEl = $("#galleryTitle");
const descEl = $("#galleryDesc");
const chipsEl = $("#tagChips");
const searchInput = $("#searchInput");
const emptyState = $("#emptyState");

// State
let activeGalleryId = GALLERIES[0]?.id ?? null;
let activeTag = "All";
let searchText = "";

// Lightbox state
let visibleItems = [];
let lightboxIndex = 0;

function getActiveGallery() {
  return GALLERIES.find(g => g.id === activeGalleryId) || GALLERIES[0];
}

function uniqueTags(items) {
  const set = new Set();
  items.forEach(i => (i.tags || []).forEach(t => set.add(t)));
  return Array.from(set).sort((a,b) => a.localeCompare(b));
}

function normalize(s) {
  return (s || "").toString().trim().toLowerCase();
}

function matchesSearch(item) {
  if (!searchText) return true;
  const q = normalize(searchText);
  const hay = normalize(item.title) + " " + normalize((item.tags || []).join(" "));
  return hay.includes(q);
}

function matchesTag(item) {
  if (activeTag === "All") return true;
  return (item.tags || []).includes(activeTag);
}

function buildTabs() {
  tabs.innerHTML = "";
  GALLERIES.forEach(g => {
    const btn = document.createElement("button");
    btn.className = "tab";
    btn.type = "button";
    btn.textContent = g.title;
    btn.setAttribute("aria-selected", g.id === activeGalleryId ? "true" : "false");
    btn.addEventListener("click", () => {
      activeGalleryId = g.id;
      activeTag = "All";
      searchText = "";
      searchInput.value = "";
      render();
    });
    tabs.appendChild(btn);
  });
}

function buildChips(items) {
  const tags = ["All", ...uniqueTags(items)];
  chipsEl.innerHTML = "";

  tags.forEach(tag => {
    const btn = document.createElement("button");
    btn.className = "chip" + (tag === activeTag ? " is-active" : "");
    btn.type = "button";
    btn.textContent = tag;
    btn.addEventListener("click", () => {
      activeTag = tag;
      renderGrid();
      updateChipsActive();
    });
    chipsEl.appendChild(btn);
  });
}

function updateChipsActive() {
  $$(".chip", chipsEl).forEach((chip) => {
    chip.classList.toggle("is-active", chip.textContent === activeTag);
  });
}

function renderGrid() {
  const g = getActiveGallery();
  titleEl.textContent = g.title;
  descEl.textContent = g.description;

  visibleItems = (g.items || []).filter(it => matchesTag(it) && matchesSearch(it));

  grid.innerHTML = "";
  emptyState.hidden = visibleItems.length !== 0;

  visibleItems.forEach((item, idx) => {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;

    const img = document.createElement("img");
    img.className = "thumb";
    img.src = item.src;
    img.alt = item.title || "Gallery image";
    img.loading = "lazy";

    const meta = document.createElement("div");
    meta.className = "card__meta";

    const left = document.createElement("div");
    const t = document.createElement("div");
    t.className = "card__title";
    t.textContent = item.title || "Untitled";

    const tags = document.createElement("div");
    tags.className = "card__tags";
    tags.textContent = (item.tags || []).join(" · ");

    left.appendChild(t);
    left.appendChild(tags);

    const badge = document.createElement("div");
    badge.className = "badge";
    badge.textContent = g.title;

    meta.appendChild(left);
    meta.appendChild(badge);

    card.appendChild(img);
    card.appendChild(meta);

    const open = () => openLightbox(idx);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") open();
    });

    grid.appendChild(card);
  });
}

function render() {
  buildTabs();
  const g = getActiveGallery();
  buildChips(g.items || []);
  renderGrid();
}

// Search
searchInput.addEventListener("input", () => {
  searchText = searchInput.value;
  renderGrid();
});

// ------- Lightbox -------
const lightbox = $("#lightbox");
const lbImg = $("#lightboxImg");
const lbTitle = $("#lightboxTitle");
const lbTags = $("#lightboxTags");
const lbClose = $("#lightboxClose");
const lbBackdrop = $("#lightboxBackdrop");
const prevBtn = $("#prevBtn");
const nextBtn = $("#nextBtn");

function openLightbox(index) {
  lightboxIndex = index;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  updateLightbox();
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
}

function updateLightbox() {
  const item = visibleItems[lightboxIndex];
  if (!item) return;

  lbImg.src = item.src;
  lbImg.alt = item.title || "Gallery image";
  lbTitle.textContent = item.title || "Untitled";
  lbTags.textContent = (item.tags || []).join(" · ");
}

function step(delta) {
  if (!visibleItems.length) return;
  lightboxIndex = (lightboxIndex + delta + visibleItems.length) % visibleItems.length;
  updateLightbox();
}

lbClose.addEventListener("click", closeLightbox);
lbBackdrop.addEventListener("click", closeLightbox);
prevBtn.addEventListener("click", () => step(-1));
nextBtn.addEventListener("click", () => step(1));

document.addEventListener("keydown", (e) => {
  if (lightbox.getAttribute("aria-hidden") === "false") {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  }
});

// Init
render();