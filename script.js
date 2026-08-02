(function () {
  "use strict";

  const slides = Array.from(document.querySelectorAll(".slide"));
  const total = slides.length;
  let idx = 0;
  let animating = false;

  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  const progressFill = document.getElementById("progress-fill");
  const progressLabel = document.getElementById("progress-label");

  function render(withLock) {
    slides.forEach((s, i) => {
      s.classList.remove("active", "prev");
      if (i === idx) {
        s.classList.add("active");
      } else if (i < idx) {
        s.classList.add("prev");
      }
    });

    const pct = total > 1 ? (idx / (total - 1)) * 100 : 0;
    progressFill.style.width = pct + "%";
    progressLabel.textContent = (idx + 1) + " / " + total;

    btnPrev.disabled = idx === 0;
    btnNext.disabled = idx === total - 1;

    if (withLock) {
      animating = true;
      window.setTimeout(function () { animating = false; }, 620);
    }
  }

  function goTo(i) {
    if (animating) return;
    if (i < 0 || i > total - 1 || i === idx) return;
    idx = i;
    render(true);
  }

  function next() { goTo(idx + 1); }
  function prev() { goTo(idx - 1); }

  btnNext.addEventListener("click", next);
  btnPrev.addEventListener("click", prev);

  window.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      prev();
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(total - 1);
    }
  });

  // basic touch swipe support
  let touchStartX = null;
  window.addEventListener("touchstart", function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  window.addEventListener("touchend", function (e) {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 60) {
      if (dx < 0) next(); else prev();
    }
    touchStartX = null;
  }, { passive: true });

  render(false);
})();
