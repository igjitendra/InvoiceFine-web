"use strict";

/* ==========================================================
   InvoiceFine landing page — Vanilla JS
   ========================================================== */

// Central Google Play URL — replace "#" with the real store URL.
const GOOGLE_PLAY_URL = "#";

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* ---------- Mobile navigation ---------- */
const hamburger = document.getElementById("hamburger");
const mainNav = document.getElementById("main-nav");

function closeMenu() {
  hamburger.classList.remove("open");
  mainNav.classList.remove("open");
  document.body.classList.remove("menu-open");
  hamburger.setAttribute("aria-expanded", "false");
  hamburger.setAttribute("aria-label", "Open menu");
}

function toggleMenu() {
  const isOpen = mainNav.classList.toggle("open");
  hamburger.classList.toggle("open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  hamburger.setAttribute("aria-expanded", String(isOpen));
  hamburger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
}

hamburger.addEventListener("click", toggleMenu);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mainNav.classList.contains("open")) {
    closeMenu();
    hamburger.focus();
  }
});

// Close menu when clicking outside nav (mobile)
document.addEventListener("click", (e) => {
  if (
    mainNav.classList.contains("open") &&
    !mainNav.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    closeMenu();
  }
});

/* ---------- Sticky header state ---------- */
const header = document.getElementById("site-header");

function onScrollHeader() {
  header.classList.toggle("scrolled", window.scrollY > 8);
}
window.addEventListener("scroll", onScrollHeader, { passive: true });
onScrollHeader();

/* ---------- Smooth scrolling ---------- */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href");
    if (id === "#") return;

    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    closeMenu();

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });

    // Move focus for keyboard/screen-reader users
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  });
});

/* ---------- FAQ accordion ---------- */
document.querySelectorAll(".faq-item").forEach((item) => {
  const btn = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  btn.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    // Close all items (single-open behaviour)
    document.querySelectorAll(".faq-item.open").forEach((other) => {
      other.classList.remove("open");
      other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      other.querySelector(".faq-answer").hidden = true;
    });

    if (!isOpen) {
      item.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
      answer.hidden = false;
    }
  });
});

/* ---------- CTA / Download buttons ---------- */
document.querySelectorAll("[data-download]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (GOOGLE_PLAY_URL === "#") {
      // Placeholder mode — prevent dead navigation
      e.preventDefault();
      console.info("Set GOOGLE_PLAY_URL in script.js to enable download links.");
    } else {
      btn.href = GOOGLE_PLAY_URL;
      btn.target = "_blank";
      btn.rel = "noopener";
    }
  });
});

/* ---------- Back to top ---------- */
const backToTop = document.getElementById("back-to-top");

window.addEventListener(
  "scroll",
  () => {
    backToTop.classList.toggle("visible", window.scrollY > 600);
  },
  { passive: true }
);

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
});

/* ---------- Current year ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Scroll reveal animations ---------- */
if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
}
