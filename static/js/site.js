// Theme toggle, hash routing for case studies, email copy. Everything works without this file:
// case studies simply stack below the home sections.
(function () {
  var root = document.documentElement;
  var baseTitle = document.title;

  // ── theme ──
  var toggle = document.getElementById("theme-toggle");
  function current() {
    var t = root.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  function label() {
    if (!toggle) return;
    var next = current() === "dark" ? "light" : "dark";
    toggle.setAttribute("aria-label", "Switch to " + next + " theme");
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      label();
    });
    label();
  }

  // ── routing ──
  var cases = Array.prototype.slice.call(document.querySelectorAll("#cases > .case"));
  var openCase = null;

  function show(c) {
    cases.forEach(function (x) { x.classList.toggle("is-open", x === c); });
    root.classList.toggle("viewing-case", !!c);
    document.title = c ? c.getAttribute("data-title") + " | Rishab Navadgi" : baseTitle;
    openCase = c;
  }

  function route(fromLoad) {
    var id = decodeURIComponent(location.hash.replace(/^#/, ""));
    var el = id ? document.getElementById(id) : null;
    var c = el ? el.closest(".case") : null;
    var wasCase = openCase;
    show(c);
    if (c && el === c) {
      window.scrollTo(0, 0);
      var h = c.querySelector(".case__title");
      if (h && !fromLoad) h.focus({ preventScroll: true });
    } else if (el) {
      // Let layout settle after switching views, then go to the anchor.
      requestAnimationFrame(function () { el.scrollIntoView({ block: "start" }); });
      if (wasCase && !c) {
        var link = el.querySelector("h3 a, h2");
        if (link) link.focus({ preventScroll: true });
      }
    } else if (!id && !fromLoad) {
      window.scrollTo(0, 0);
    }
  }
  window.addEventListener("hashchange", function () { route(false); });
  route(true);

  // Highlight the section in view inside the open case study.
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var a = document.querySelector('.toc a[href="#' + e.target.id + '"]');
        if (!a) return;
        a.closest("ol").querySelectorAll("a").forEach(function (x) { x.removeAttribute("aria-current"); });
        a.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    document.querySelectorAll(".case .cs").forEach(function (s) { io.observe(s); });
  }

  // ── copy email ──
  var copy = document.getElementById("copy-email");
  if (copy) {
    copy.addEventListener("click", function () {
      var text = copy.getAttribute("data-copy");
      function done(msg) { copy.textContent = msg; setTimeout(function () { copy.textContent = "Copy"; }, 1800); }
      function fallback() {
        var a = document.getElementById("email-link");
        var r = document.createRange(); r.selectNodeContents(a);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        done("Selected");
      }
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done("Copied"); }, fallback);
        else fallback();
      } catch (e) { fallback(); }
    });
  }

  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();
