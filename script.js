const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const themeToggle = document.querySelector("#theme-toggle");
const root = document.documentElement;
let savedTheme = null;
try {
  savedTheme = localStorage.getItem("portfolio-theme");
} catch {
  // The theme switch still works for this visit if storage is unavailable.
}

function applyTheme(theme, save = false) {
  const isLight = theme === "light";
  root.dataset.theme = isLight ? "light" : "dark";
  if (themeToggle) {
    const nextTheme = isLight ? "dark" : "light";
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
    themeToggle.title = `Switch to ${nextTheme} mode`;
  }
  if (save) {
    try {
      localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
    } catch {
      // Keep the selected theme for this visit.
    }
  }
}

applyTheme(savedTheme === "light" ? "light" : "dark");
themeToggle?.addEventListener("click", () => {
  applyTheme(root.dataset.theme === "light" ? "dark" : "light", true);
});

const terminalResult = document.querySelector("#terminal-result");
const terminalAnnouncement = document.querySelector("#terminal-announcement");
const terminalButtons = document.querySelectorAll("[data-terminal]");
const terminalMessages = {
  whoami: "Aspiring software engineer · CS student",
  stack: "C++ · Java · TypeScript · Git",
  experience: "VR developer · Meta Horizon winning team",
};
let terminalTimer;

terminalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const message = terminalMessages[button.dataset.terminal];
    if (!message || !terminalResult) return;

    terminalButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    window.clearInterval(terminalTimer);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      terminalResult.textContent = message;
      if (terminalAnnouncement) terminalAnnouncement.textContent = message;
      return;
    }

    terminalResult.textContent = "";
    let position = 0;
    terminalTimer = window.setInterval(() => {
      terminalResult.textContent += message[position];
      position += 1;
      if (position >= message.length) {
        window.clearInterval(terminalTimer);
        if (terminalAnnouncement) terminalAnnouncement.textContent = message;
      }
    }, 22);
  });
});

const motionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const heroArt = document.querySelector(".hero-art");
const atomTilt = document.querySelector(".atom-tilt");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (heroArt && atomTilt && finePointer && !motionReduced) {
  heroArt.addEventListener("pointermove", (event) => {
    const bounds = heroArt.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
    atomTilt.style.setProperty("--pointer-x", `${horizontal * 24}deg`);
    atomTilt.style.setProperty("--pointer-y", `${vertical * -24}deg`);
  });

  heroArt.addEventListener("pointerleave", () => {
    atomTilt.style.setProperty("--pointer-x", "0deg");
    atomTilt.style.setProperty("--pointer-y", "0deg");
  });
}

const revealItems = document.querySelectorAll(".experience-card, .interest-cards article, .about-grid");

if (motionReduced || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  revealItems.forEach((item) => item.classList.add("reveal"));
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
}
