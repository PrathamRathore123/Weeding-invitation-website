// ========================================
// EDIT YOUR WEDDING DETAILS HERE
// ========================================

const WEDDING = {
  date: "2027-02-14T19:00:00+05:30",
  whatsappNumber: "919876543210",
  couple: "Yash & Kavita"
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

  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  };

  setText("days", String(days).padStart(3, "0"));
  setText("hours", String(hours).padStart(2, "0"));
  setText("minutes", String(minutes).padStart(2, "0"));
  setText("seconds", String(seconds).padStart(2, "0"));
}

updateCountdown();
setInterval(updateCountdown, 1000);


// ========================================
// LOADER
// ========================================

window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader")?.classList.add("hide");
  }, 650);
});


// ========================================
// MOBILE NAVIGATION
// ========================================

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle?.addEventListener("click", () => {
  nav?.classList.toggle("open");
});

nav?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});


// ========================================
// SCROLL REVEAL
// ========================================

if ("IntersectionObserver" in window) {
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
}


// ========================================
// FALLING PETALS
// ========================================

const petalLayer = document.getElementById("petals");

if (petalLayer) {
  for (let i = 0; i < 18; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = Math.random() * 100 + "%";
    petal.style.animationDuration = (10 + Math.random() * 13) + "s";
    petal.style.animationDelay = (-Math.random() * 20) + "s";
    petal.style.opacity = (0.18 + Math.random() * 0.35).toFixed(2);
    petal.style.transform = `scale(${0.55 + Math.random() * 0.8})`;
    petalLayer.appendChild(petal);
  }
}


// ========================================
// WEDDING SONG PLAYER
// ========================================

const audio = document.getElementById("weddingAudio");
const musicButton = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");
const musicShell = musicButton?.closest(".music-player");
const musicPlayer = musicShell?.parentElement?.classList.contains("music-player")
  ? musicShell.parentElement
  : musicShell;

if (musicButton && musicShell && musicPlayer && musicShell !== musicPlayer) {
  musicPlayer.insertBefore(musicButton, musicShell);
  musicShell.remove();
}

if (musicPlayer) {
  musicPlayer.style.display = "none";
  musicPlayer.style.background = "transparent";
  musicPlayer.style.padding = "0";
  musicPlayer.style.border = "0";
  musicPlayer.style.boxShadow = "none";
  musicPlayer.style.borderRadius = "0";
}

if (musicButton) {
  musicButton.type = "button";
  musicButton.style.width = "52px";
  musicButton.style.height = "52px";
  musicButton.style.padding = "0";
  musicButton.style.border = "0";
  musicButton.style.borderRadius = "50%";
  musicButton.style.display = "grid";
  musicButton.style.placeItems = "center";
  musicButton.style.cursor = "pointer";
  musicButton.style.position = "relative";
  musicButton.style.zIndex = "10000";
  musicButton.style.pointerEvents = "auto";
}

function updateMusicButton(playing) {
  if (!musicButton) return;

  musicButton.textContent = playing ? "♫" : "♪";
  musicButton.setAttribute("aria-label", playing ? "Pause wedding song" : "Play wedding song");
  musicButton.setAttribute("aria-pressed", String(playing));
  if (musicLabel) musicLabel.textContent = playing ? "NOW PLAYING" : "PLAY OUR SONG";
}

async function playWeddingMusic() {
  if (!audio) {
    if (musicLabel) musicLabel.textContent = "SONG NOT FOUND";
    return;
  }

  try {
    await audio.play();
    updateMusicButton(true);
  } catch (error) {
    console.warn("Unable to play wedding music:", error);
    if (musicLabel) musicLabel.textContent = "TAP TO TRY AGAIN";
  }
}

function pauseWeddingMusic() {
  if (!audio) return;
  audio.pause();
  updateMusicButton(false);
}

musicButton?.addEventListener("click", () => {
  if (!audio) {
    if (musicLabel) musicLabel.textContent = "SONG NOT FOUND";
  } else if (audio.paused) {
    playWeddingMusic();
  } else {
    pauseWeddingMusic();
  }
});

audio?.addEventListener("play", () => updateMusicButton(true));
audio?.addEventListener("pause", () => updateMusicButton(false));
audio?.addEventListener("error", () => {
  if (musicLabel) musicLabel.textContent = "SONG UNAVAILABLE";
});


// ========================================
// SCRATCH CARD REVEAL + ENTER INVITATION
// ========================================

(() => {
  const gate = document.getElementById("scratchGate");
  const canvas = document.getElementById("scratchCanvas");
  const enterButton = document.getElementById("enterInvite");
  const progress = document.getElementById("scratchProgress");

  if (!gate || !canvas || !enterButton) return;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;

  document.body.classList.add("scratch-locked");

  let drawing = false;
  let revealed = false;
  let lastCheck = 0;
  let invitationEntered = false;

  enterButton.disabled = false;

  function paintCover() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#d9b56d");
    gradient.addColorStop(0.5, "#f1d99e");
    gradient.addColorStop(1, "#bd914b");

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = "rgba(255,255,255,.4)";
    ctx.textAlign = "center";
    ctx.font = "600 15px sans-serif";
    ctx.fillText("✦ SCRATCH HERE ✦", rect.width / 2, rect.height / 2);
    ctx.font = "12px sans-serif";
    ctx.fillText("Use your finger or mouse", rect.width / 2, rect.height / 2 + 24);
  }

  function getPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function checkProgress() {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0;
    let total = 0;

    for (let i = 3; i < pixels.length; i += 32) {
      total++;
      if (pixels[i] < 80) clear++;
    }

    const percentage = total ? Math.round((clear / total) * 100) : 0;
    if (percentage >= 45) {
      revealed = true;
      canvas.style.transition = "opacity .5s";
      canvas.style.opacity = "0";
      if (progress) progress.textContent = "The surprise is revealed! 💛";
    } else if (progress) {
      progress.textContent = "Keep scratching to reveal the surprise ✨";
    }
  }

  function scratch(event) {
    if (!drawing || revealed) return;
    const point = getPoint(event);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 22, 0, Math.PI * 2);
    ctx.fill();

    if (Date.now() - lastCheck > 350) {
      lastCheck = Date.now();
      checkProgress();
    }
  }

  function openInvitation() {
    if (invitationEntered) return;
    invitationEntered = true;

    playWeddingMusic();

    gate.classList.add("is-hidden");
    document.body.classList.remove("scratch-locked");
    if (musicPlayer) musicPlayer.style.display = "flex";
    setTimeout(() => gate.remove(), 700);
  }

  canvas.addEventListener("pointerdown", event => {
    if (revealed) return;
    drawing = true;
    canvas.setPointerCapture(event.pointerId);
    scratch(event);
  });
  canvas.addEventListener("pointermove", scratch);

  ["pointerup", "pointercancel", "lostpointercapture"].forEach(type => {
    canvas.addEventListener(type, () => { drawing = false; });
  });

  enterButton.addEventListener("click", openInvitation);

  paintCover();
  window.addEventListener("resize", () => {
    if (!revealed) paintCover();
  });
})();


// ========================================
// BRIDE AND GROOM IMAGE SLIDER
// ========================================

(() => {
  const track = document.getElementById("slides");
  const dotsContainer = document.getElementById("sliderDots");
  const previousButton = document.getElementById("prevSlide");
  const nextButton = document.getElementById("nextSlide");

  if (!track || !dotsContainer) return;

  const slides = Array.from(document.querySelectorAll(".slide"));
  const dots = Array.from(dotsContainer.querySelectorAll(".dot"));
  if (!slides.length) return;

  let currentSlide = 0;
  let autoSlide;

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle("active", i === currentSlide));
  }

  function changeSlide(direction) {
    showSlide(currentSlide + direction);
  }

  function startAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(() => changeSlide(1), 4000);
  }

  previousButton?.addEventListener("click", () => {
    changeSlide(-1);
    startAutoSlide();
  });
  nextButton?.addEventListener("click", () => {
    changeSlide(1);
    startAutoSlide();
  });
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      startAutoSlide();
    });
  });

  let touchStartX = 0;
  track.addEventListener("touchstart", event => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  track.addEventListener("touchend", event => {
    const difference = touchStartX - event.changedTouches[0].clientX;
    if (Math.abs(difference) > 45) {
      changeSlide(difference > 0 ? 1 : -1);
      startAutoSlide();
    }
  }, { passive: true });

  showSlide(0);
  startAutoSlide();
})();


// ========================================
// RSVP THROUGH WHATSAPP
// ========================================

const rsvpForm = document.getElementById("rsvpForm");

rsvpForm?.addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("guestName")?.value.trim();
  const count = document.getElementById("guestCount")?.value;
  const attendance = document.getElementById("attendance")?.value;

  const message =
    `Wedding RSVP for ${WEDDING.couple}\n` +
    `Name: ${name}\n` +
    `Guests: ${count}\n` +
    `Response: ${attendance}`;
  const number = WEDDING.whatsappNumber;

  if (!number || number === "919876543210") {
    const note = document.getElementById("rsvpNote");
    if (note) note.textContent = "Demo mode: update whatsappNumber in script.js to receive RSVPs.";
    return;
  }

  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
});
