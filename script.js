// ---------- Typing effect ----------
const phrases = ["Web Developer", "JavaScript Developer", "Creator of iConnecto"];
const typedEl = document.getElementById("typed");
let p = 0, c = 0, deleting = false;

function type() {
  const word = phrases[p];
  typedEl.textContent = word.slice(0, c);
  if (!deleting && c < word.length) {
    c++;
    setTimeout(type, 90);
  } else if (!deleting && c === word.length) {
    deleting = true;
    setTimeout(type, 1500);
  } else if (deleting && c > 0) {
    c--;
    setTimeout(type, 45);
  } else {
    deleting = false;
    p = (p + 1) % phrases.length;
    setTimeout(type, 300);
  }
}
type();

// ---------- Dark / Light theme ----------
const root = document.documentElement;
const toggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  toggle.textContent = theme === "dark" ? "🌙" : "☀️";
}

let saved = null;
try { saved = localStorage.getItem("theme"); } catch (e) {}
applyTheme(saved || "dark");

toggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// ---------- Scroll reveal ----------
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ---------- Contact form (opens the visitor's email app) ----------
// নিচের ইমেইল ঠিকানাটা নিজের দিয়ে বদলান
const MY_EMAIL = "tanvibro@outlook.com";

document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const subject = encodeURIComponent("Portfolio message from " + name);
  const body = encodeURIComponent(message + "\n\n— " + name + " (" + email + ")");
  window.location.href = "mailto:" + MY_EMAIL + "?subject=" + subject + "&body=" + body;
});

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();
