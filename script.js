// Minimal multi-gallery template (no tags, no search)

const GALLERIES = [
  {
    id: "nature",
    tabLabel: "Nature",
    title: "TITLE",
    subtitle: "SUBTITLE",
    text: "MAIN TEXT",
    images: [
      { src: "./assets/nature-1.jpg", alt: "Nature image 1" },
      { src: "./assets/nature-2.jpg", alt: "Nature image 2" },
      { src: "./assets/nature-3.jpg", alt: "Nature image 3" },
    ],
  },
  {
    id: "architecture",
    tabLabel: "Architecture",
    title: "TITLE",
    subtitle: "SUBTITLE",
    text: "MAIN TEXT",
    images: [
      { src: "./assets/architecture-1.jpg", alt: "Architecture image 1" },
      { src: "./assets/architecture-2.jpg", alt: "Architecture image 2" },
      { src: "./assets/architecture-3.jpg", alt: "Architecture image 3" },
    ],
  },
  {
    id: "portraits",
    tabLabel: "Portraits",
    title: "TITLE",
    subtitle: "SUBTITLE",
    text: "MAIN TEXT",
    images: [
      { src: "./assets/portraits-1.jpg", alt: "Portrait image 1" },
      { src: "./assets/portraits-2.jpg", alt: "Portrait image 2" },
      { src: "./assets/portraits-3.jpg", alt: "Portrait image 3" },
    ],
  },
];

const $ = (sel, root = document) => root.querySelector(sel);

$("#year").textContent = new Date().getFullYear();

const tabs = $("#galleryTabs");
const titleEl = $("#pageTitle");
const subtitleEl = $("#pageSubtitle");
const textEl = $("#pageText");
const imageRow = $("#imageRow");

let activeId = GALLERIES[0]?.id ?? null;

function getActive() {
  return GALLERIES.find(g => g.id === activeId) || GALLERIES[0];
}

function buildTabs() {
  tabs.innerHTML = "";
  GALLERIES.forEach(g => {
    const btn = document.createElement("button");
    btn.className = "tab";
    btn.type = "button";
    btn.textContent = g.tabLabel;
    btn.setAttribute("aria-selected", g.id === activeId ? "true" : "false");
    btn.addEventListener("click", () => {
      activeId = g.id;
      render();
    });
    tabs.appendChild(btn);
  });
}

function renderImages(images) {
  imageRow.innerHTML = "";
  images.forEach(imgData => {
    const img = document.createElement("img");
    img.className = "photo";
    img.src = imgData.src;
    img.alt = imgData.alt || "";
    img.loading = "lazy";
    imageRow.appendChild(img);
  });
}

function render() {
  buildTabs();

  const g = getActive();
  titleEl.textContent = g.title || "";
  subtitleEl.textContent = g.subtitle || "";
  textEl.textContent = g.text || "";
  renderImages(g.images || []);
}

render();