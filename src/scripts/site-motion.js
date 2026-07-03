const root = document.documentElement;
const header = document.querySelector(".site-header");
const themeButton = document.querySelector(".theme-button");
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".site-nav");
const savedTheme = window.localStorage.getItem("theme");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lastScrollY = window.scrollY;

if (savedTheme === "dark") {
  root.dataset.theme = "dark";
}

const syncHeaderState = () => {
  const currentScrollY = window.scrollY;
  const isScrollingDown = currentScrollY > lastScrollY;

  header?.toggleAttribute("data-scrolled", currentScrollY > 12);
  header?.toggleAttribute("data-hidden", isScrollingDown && currentScrollY > 96);

  lastScrollY = currentScrollY;
};

syncHeaderState();
window.addEventListener("scroll", syncHeaderState, { passive: true });

themeButton?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  window.localStorage.setItem("theme", nextTheme);
});

menuButton?.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!expanded));
  nav?.toggleAttribute("data-open", !expanded);
});

if (!prefersReducedMotion) {
  const revealItems = document.querySelectorAll("[data-reveal]");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-visible", "");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  document.querySelectorAll("[data-reveal]").forEach((item) => item.setAttribute("data-visible", ""));
}

const tocLinks = Array.from(document.querySelectorAll(".article-toc a"));
const headings = tocLinks
  .map((link) => document.getElementById(link.hash.slice(1)))
  .filter(Boolean);

if (tocLinks.length > 0 && headings.length > 0) {
  const setActiveTocLink = (id) => {
    tocLinks.forEach((link) => {
      link.toggleAttribute("aria-current", link.hash === `#${id}`);
    });
  };

  const headingObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible[0]?.target.id) {
        setActiveTocLink(visible[0].target.id);
      }
    },
    { rootMargin: "-12% 0px -72% 0px" }
  );

  headings.forEach((heading) => headingObserver.observe(heading));
  setActiveTocLink(headings[0].id);
}
