// Theme: persistent via localStorage
(() => {
  const toggle = document.getElementById("theme-toggle");
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  if (saved === "dark" || (saved === null && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    root.setAttribute("data-theme", "dark");
  }
  if (toggle) {
    toggle.addEventListener("click", () => {
      const isDark = root.getAttribute("data-theme") === "dark";
      if (isDark) {
        root.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
      } else {
        root.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      }
    });
  }
})();

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// FAQ accordion — close others when opening one
document.querySelectorAll(".faq-item").forEach(item => {
  item.addEventListener("toggle", () => {
    if (item.open) {
      document.querySelectorAll(".faq-item").forEach(other => {
        if (other !== item) other.open = false;
      });
    }
  });
});
