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

// Optional: set artist name here
$("#artistName").textContent = "ARTIST";

// Page elements
const titleEl = $("#pageTitle");
const subtitleEl = $("#pageSubtitle");
const textEl = $("#pageText");
const imageRow = $("#imageRow");

// Gallery nav buttons (beside title)
const prevGalleryBtn = $("#prevGallery");
const nextGalleryBtn = $("#nextGallery");

// Lightbox elements
const lightbox = $("#lightbox");
const lbBackdrop = $("#lightboxBackdrop");
const lbClose = $("#lightboxClose");
const lbImg = $("#lightboxImg");
const prevImgBtn = $("#prevImg");
const nextImgBtn = $("#nextImg");

let activeGalleryIndex = 0;
let activeImageIndex = 0;

function activeGallery() {
  return GALLERIES[activeGalleryIndex] || GALLERIES[0];
}

function renderGallery() {
  const g = activeGallery();
  titleEl.textContent = g.title || "";
  subtitleEl.textContent = g.subtitle || "";
  textEl.textContent = g.text || "";

  imageRow.innerHTML = "";
  (g.images || []).forEach((imgData, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "photoBtn";
    btn.setAttribute("aria-label", `Open image ${idx + 1}`);

    const img = document.createElement("img");
    img.className = "photo";
    img.src = imgData.src;
    img.alt = imgData.alt || "";
    img.loading = "lazy";

    btn.appendChild(img);
    btn.addEventListener("click", () => openLightbox(idx));
    imageRow.appendChild(btn);
  });
}

// Gallery switching
function stepGallery(delta) {
  const n = GALLERIES.length;
  activeGalleryIndex = (activeGalleryIndex + delta + n) % n;
  renderGallery();
}

prevGalleryBtn.addEventListener("click", () => stepGallery(-1));
nextGalleryBtn.addEventListener("click", () => stepGallery(1));

// Lightbox
function openLightbox(index) {
  activeImageIndex = index;
  updateLightbox();

  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function updateLightbox() {
  const g = activeGallery();
  const item = (g.images || [])[activeImageIndex];
  if (!item) return;

  lbImg.src = item.src;
  lbImg.alt = item.alt || "";
}

function stepImage(delta) {
  const g = activeGallery();
  const n = (g.images || []).length;
  if (!n) return;
  activeImageIndex = (activeImageIndex + delta + n) % n;
  updateLightbox();
}

lbClose.addEventListener("click", closeLightbox);
lbBackdrop.addEventListener("click", closeLightbox);
prevImgBtn.addEventListener("click", () => stepImage(-1));
nextImgBtn.addEventListener("click", () => stepImage(1));

document.addEventListener("keydown", (e) => {
  const open = lightbox.getAttribute("aria-hidden") === "false";
  if (open) {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepImage(-1);
    if (e.key === "ArrowRight") stepImage(1);
  } else {
    // Optional keyboard gallery nav even when lightbox isn't open
    if (e.key === "ArrowLeft") stepGallery(-1);
    if (e.key === "ArrowRight") stepGallery(1);
  }
});

// Init
renderGallery();