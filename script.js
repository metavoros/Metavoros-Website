// Helpers
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Year
const year = new Date().getFullYear();
$("#year").textContent = year;
$("#year2").textContent = year;

// Progress bar
const progress = $("#progress");
const onScroll = () => {
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const height = doc.scrollHeight - doc.clientHeight;
  const pct = height > 0 ? (scrollTop / height) * 100 : 0;
  progress.style.width = `${pct}%`;
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Drawer menu (mobile)
const menuBtn = $("#menuBtn");
const drawer = $("#drawer");
const drawerBackdrop = $("#drawerBackdrop");
const closeDrawer = $("#closeDrawer");

const openDrawer = () => {
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  menuBtn.setAttribute("aria-expanded", "true");
};
const hideDrawer = () => {
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  menuBtn.setAttribute("aria-expanded", "false");
};

menuBtn.addEventListener("click", openDrawer);
drawerBackdrop.addEventListener("click", hideDrawer);
closeDrawer.addEventListener("click", hideDrawer);

// Close drawer on link click
$$(".drawer__link").forEach((a) => a.addEventListener("click", hideDrawer));

// Modal
const modal = $("#modal");
const modalTitle = $("#modalTitle");
const modalDesc = $("#modalDesc");

const openModal = ({ title, desc }) => {
  modalTitle.textContent = title;
  modalDesc.textContent = desc;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
};

const closeModal = () => {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
};

document.addEventListener("click", (e) => {
  const openBtn = e.target.closest("[data-open-modal]");
  if (openBtn) {
    openModal({
      title: openBtn.dataset.modalTitle || "Project",
      desc: openBtn.dataset.modalDesc || "Details",
    });
  }

  if (e.target.closest("[data-close-modal]")) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
    hideDrawer();
  }
});

// Demo contact form (no backend)
const form = $("#contactForm");
const note = $("#formNote");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form).entries());
  // This template is static: show a success message.
  note.textContent = `Thanks, ${data.name}! Your message is ready to send. (Add a form backend to actually email it.)`;
  form.reset();
});

// Optional: offset anchor jump for sticky header
// (This improves where the page lands after clicking nav links)
const headerHeight = 72;
$$('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (!href || href === "#" || href === "#top") return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 10;
    window.scrollTo({ top, behavior: "smooth" });
  });
});