
// ========================================
// EDIT YOUR WEDDING DETAILS HERE
// ========================================

const WEDDING = {
  date: "2027-02-14T19:00:00+05:30",
  whatsappNumber: "919876543210",
  couple: "Aarav & Aanya"
};


// ========================================
// COUNTDOWN
// ========================================

function updateCountdown() {

  const target = new Date(WEDDING.date).getTime();
  const now = Date.now();

  let diff = Math.max(0, target - now);

  const days = Math.floor(diff / 86400000);
  diff %= 86400000;

  const hours = Math.floor(diff / 3600000);
  diff %= 3600000;

  const minutes = Math.floor(diff / 60000);
  diff %= 60000;

  const seconds = Math.floor(diff / 1000);

  document.getElementById("days").textContent =
    String(days).padStart(3, "0");

  document.getElementById("hours").textContent =
    String(hours).padStart(2, "0");

  document.getElementById("minutes").textContent =
    String(minutes).padStart(2, "0");

  document.getElementById("seconds").textContent =
    String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);


// ========================================
// LOADER
// ========================================

window.addEventListener("load", () => {

  setTimeout(() => {
    document.getElementById("loader").classList.add("hide");
  }, 650);

});


// ========================================
// MOBILE NAVIGATION
// ========================================

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
});

nav.querySelectorAll("a").forEach(link => {

  link.addEventListener("click", () => {
    nav.classList.remove("open");
  });

});


// ========================================
// SCROLL REVEAL
// ========================================

const observer = new IntersectionObserver(entries => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {

      entry.target.classList.add("visible");
      observer.unobserve(entry.target);

    }

  });

}, { threshold: 0.12 });

document.querySelectorAll(".reveal, .event-card").forEach(element => {

  element.classList.add("reveal");
  observer.observe(element);

});


// ========================================
// FALLING PETALS
// ========================================

const petalLayer = document.getElementById("petals");

for (let i = 0; i < 18; i++) {

  const petal = document.createElement("span");

  petal.className = "petal";

  petal.style.left = Math.random() * 100 + "%";

  petal.style.animationDuration =
    (10 + Math.random() * 13) + "s";

  petal.style.animationDelay =
    (-Math.random() * 20) + "s";

  petal.style.opacity =
    (0.18 + Math.random() * 0.35).toFixed(2);

  petal.style.transform =
    `scale(${0.55 + Math.random() * 0.8})`;

  petalLayer.appendChild(petal);

}


// ========================================
// SCRATCH CARD REVEAL
// ========================================

(() => {

  const gate = document.getElementById("scratchGate");
  const canvas = document.getElementById("scratchCanvas");
  const enterButton = document.getElementById("enterInvite");
  const progress = document.getElementById("scratchProgress");

  const ctx = canvas.getContext("2d", {
    willReadFrequently: true
  });

  document.body.classList.add("scratch-locked");

  let drawing = false;
  let revealed = false;
  let lastCheck = 0;


  function paintCover() {

    const rect = canvas.getBoundingClientRect();

    const dpr = Math.max(1, window.devicePixelRatio || 1);

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const gradient = ctx.createLinearGradient(
      0, 0, rect.width, rect.height
    );

    gradient.addColorStop(0, "#d9b56d");
    gradient.addColorStop(0.5, "#f1d99e");
    gradient.addColorStop(1, "#bd914b");

    ctx.globalCompositeOperation = "source-over";

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.fillStyle = "rgba(255,255,255,.4)";
    ctx.textAlign = "center";
    ctx.font = "600 15px sans-serif";

    ctx.fillText(
      "✦ SCRATCH HERE ✦",
      rect.width / 2,
      rect.height / 2
    );

    ctx.font = "12px sans-serif";

    ctx.fillText(
      "Use your finger or mouse",
      rect.width / 2,
      rect.height / 2 + 24
    );

  }


  function getPoint(event) {

    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

  }


  function scratch(event) {

    if (!drawing || revealed) return;

    const point = getPoint(event);

    ctx.globalCompositeOperation = "destination-out";

    ctx.beginPath();

    ctx.arc(
      point.x,
      point.y,
      22,
      0,
      Math.PI * 2
    );

    ctx.fill();

    if (Date.now() - lastCheck > 350) {

      lastCheck = Date.now();
      checkProgress();

    }

  }


  function checkProgress() {

    const pixels = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    ).data;

    let clear = 0;
    let total = 0;

    for (let i = 3; i < pixels.length; i += 32) {

      total++;

      if (pixels[i] < 80) {
        clear++;
      }

    }

    const percentage = Math.round(
      (clear / total) * 100
    );

    if (percentage >= 45) {

      revealed = true;

      canvas.style.transition = "opacity .5s";
      canvas.style.opacity = "0";

      enterButton.disabled = false;

      progress.textContent =
        "The surprise is revealed! 💛";

    } else {

      progress.textContent =
        "Keep scratching to reveal the surprise ✨";

    }

  }


  canvas.addEventListener("pointerdown", event => {

    if (revealed) return;

    drawing = true;

    canvas.setPointerCapture(event.pointerId);

    scratch(event);

  });


  canvas.addEventListener("pointermove", scratch);


  ["pointerup", "pointercancel", "lostpointercapture"].forEach(type => {

    canvas.addEventListener(type, () => {
      drawing = false;
    });

  });


  enterButton.addEventListener("click", () => {

    if (!revealed) return;

    gate.classList.add("is-hidden");

    document.body.classList.remove("scratch-locked");

    setTimeout(() => gate.remove(), 700);

  });


  paintCover();


  window.addEventListener("resize", () => {

    if (!revealed) {
      paintCover();
    }

  });

})();


// ========================================
// BRIDE AND GROOM IMAGE SLIDER
// ========================================

(() => {

  const track = document.getElementById("slides");

  const dotsContainer =
    document.getElementById("sliderDots");

  const previousButton =
    document.getElementById("prevSlide");

  const nextButton =
    document.getElementById("nextSlide");

  const slides = Array.from(
    document.querySelectorAll(".slide")
  );

  const dots = Array.from(
    dotsContainer.querySelectorAll(".dot")
  );

  let currentSlide = 0;

  let autoSlide;


  function showSlide(index) {

    currentSlide =
      (index + slides.length) % slides.length;

    track.style.transform =
      `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, i) => {

      dot.classList.toggle(
        "active",
        i === currentSlide
      );

    });

  }


  function changeSlide(direction) {

    showSlide(currentSlide + direction);

  }


  function startAutoSlide() {

    clearInterval(autoSlide);

    autoSlide = setInterval(() => {

      changeSlide(1);

    }, 4000);

  }


  previousButton.addEventListener("click", () => {

    changeSlide(-1);
    startAutoSlide();

  });


  nextButton.addEventListener("click", () => {

    changeSlide(1);
    startAutoSlide();

  });


  dots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

      showSlide(index);
      startAutoSlide();

    });

  });


  // MOBILE SWIPE SUPPORT

  let touchStartX = 0;

  track.addEventListener("touchstart", event => {

    touchStartX = event.changedTouches[0].clientX;

  }, { passive: true });


  track.addEventListener("touchend", event => {

    const touchEndX =
      event.changedTouches[0].clientX;

    const difference = touchStartX - touchEndX;

    if (Math.abs(difference) > 45) {

      changeSlide(difference > 0 ? 1 : -1);
      startAutoSlide();

    }

  }, { passive: true });


  startAutoSlide();

})();


// ========================================
// WEDDING SONG PLAYER
// Add assets/dholna-ve.mp3
// ========================================

const audio = document.getElementById("weddingAudio");

const musicButton =
  document.getElementById("musicToggle");

const musicLabel =
  document.getElementById("musicLabel");


musicButton.addEventListener("click", async () => {

  if (audio.paused) {

    try {

      await audio.play();

      musicButton.parentElement.classList.add("playing");

      musicLabel.textContent = "NOW PLAYING";

    } catch (error) {

      musicLabel.textContent = "ADD SONG FILE";

    }

  } else {

    audio.pause();

    musicButton.parentElement.classList.remove("playing");

    musicLabel.textContent = "PLAY OUR SONG";

  }

});


// ========================================
// RSVP THROUGH WHATSAPP
// ========================================

document.getElementById("rsvpForm").addEventListener("submit", event => {

  event.preventDefault();

  const name =
    document.getElementById("guestName").value.trim();

  const count =
    document.getElementById("guestCount").value;

  const attendance =
    document.getElementById("attendance").value;

  const message =
    `Wedding RSVP for ${WEDDING.couple}\n` +
    `Name: ${name}\n` +
    `Guests: ${count}\n` +
    `Response: ${attendance}`;

  const number = WEDDING.whatsappNumber;

  if (number === "919876543210") {

    document.getElementById("rsvpNote").textContent =
      "Demo mode: update whatsappNumber in script.js to receive RSVPs.";

    return;

  }

  const url =
    `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener");

});
