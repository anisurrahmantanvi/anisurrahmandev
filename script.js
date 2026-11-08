const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Typing effect ----------
const phrases = ["Founder of iConnecto", "Product Thinker", "Building with AI"];
const typedEl = document.getElementById("typed");
if (typedEl) {
  if (reduceMotion) {
    typedEl.textContent = phrases[0];
  } else {
    let p = 0, c = 0, deleting = false;
    const type = () => {
      const word = phrases[p];
      typedEl.textContent = word.slice(0, c);
      if (!deleting && c < word.length) { c++; setTimeout(type, 80); }
      else if (!deleting) { deleting = true; setTimeout(type, 1600); }
      else if (c > 0) { c--; setTimeout(type, 40); }
      else { deleting = false; p = (p + 1) % phrases.length; setTimeout(type, 300); }
    };
    type();
  }
}

// ---------- Dark / Light theme ----------
const root = document.documentElement;
const toggle = document.getElementById("themeToggle");
function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  toggle.textContent = theme === "dark" ? "🌙" : "☀️";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#07090c" : "#f6f7f9");
}
let saved = null;
try { saved = localStorage.getItem("theme"); } catch (e) {}
applyTheme(saved === "light" ? "light" : "dark");
toggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// ---------- Split statement into words ----------
const statement = document.getElementById("statement");
if (statement) {
  const words = statement.textContent.trim().split(/\s+/);
  statement.setAttribute("aria-label", statement.textContent.trim());
  statement.innerHTML = words.map((w, i) => `<span class="w" style="--i:${i}" aria-hidden="true">${w}</span>`).join(" ");
}

// ---------- Reveal on scroll ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
document.querySelectorAll(".reveal, .statement").forEach((el) => io.observe(el));

// ---------- Scroll effects (progress bar, hero parallax, timeline) ----------
const progress = document.getElementById("progress");
const showcase = document.querySelector(".showcase");
const timeline = document.getElementById("timeline");
let ticking = false;

function onScroll() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  progress.style.transform = "scaleX(" + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ")";

  if (showcase && !reduceMotion) {
    const p = Math.min(1, Math.max(0, window.scrollY / (showcase.offsetHeight * 0.8)));
    showcase.style.setProperty("--p", p.toFixed(3));
  }

  if (timeline) {
    const r = timeline.getBoundingClientRect();
    const t = (window.innerHeight * 0.65 - r.top) / r.height;
    timeline.style.setProperty("--tl", Math.min(1, Math.max(0, t)).toFixed(3));
  }
  ticking = false;
}
window.addEventListener("scroll", () => {
  if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
}, { passive: true });
window.addEventListener("resize", onScroll);
onScroll();

// ---------- Cursor glow + card tilt (mouse devices only) ----------
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion) {
  const glow = document.getElementById("glow");
  document.body.classList.add("has-pointer");
  window.addEventListener("pointermove", (e) => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  }, { passive: true });

  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-3px)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
}

// ---------- Contact form (opens the visitor's email app) ----------
const MY_EMAIL = "tanvibro@outlook.com";
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const subject = encodeURIComponent("Message from " + name + " (portfolio)");
  const body = encodeURIComponent(message + "\n\n— " + name + " (" + email + ")");
  window.location.href = "mailto:" + MY_EMAIL + "?subject=" + subject + "&body=" + body;
});

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();
