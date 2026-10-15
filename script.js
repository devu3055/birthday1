const opening = document.getElementById("opening");
const main = document.getElementById("main");
const openStory = document.getElementById("openStory");
const hearts = document.getElementById("hearts");

openStory.addEventListener("click", () => {
  opening.style.transition = "opacity .8s ease, transform .8s ease";
  opening.style.opacity = "0";
  opening.style.transform = "scale(1.04)";
  setTimeout(() => {
    opening.classList.add("hidden");
    main.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "instant" });
    startHearts();
  }, 800);
});

// Soft floating hearts.
function createHeart() {
  const heart = document.createElement("span");
  heart.className = "heart-particle";
  heart.textContent = Math.random() > .35 ? "♡" : "✦";
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${10 + Math.random() * 18}px`;
  heart.style.animationDuration = `${6 + Math.random() * 8}s`;
  heart.style.animationDelay = `${Math.random() * 1.5}s`;
  hearts.appendChild(heart);
  setTimeout(() => heart.remove(), 15000);
}
function startHearts() {
  setInterval(createHeart, 900);
  for (let i = 0; i < 8; i++) setTimeout(createHeart, i * 250);
}

// Reveal sections on scroll.
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Birthday countdown: next October 16.
function updateCountdown() {
  const now = new Date();
  let year = now.getFullYear();
  let target = new Date(year, 9, 16, 0, 0, 0);
  if (now >= target) target = new Date(year + 1, 9, 16, 0, 0, 0);

  const diff = target - now;
  const day = 86400000;
  const hour = 3600000;
  const minute = 60000;

  const days = Math.floor(diff / day);
  const hours = Math.floor((diff % day) / hour);
  const minutes = Math.floor((diff % hour) / minute);
  const seconds = Math.floor((diff % minute) / 1000);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");

  const message = document.getElementById("birthdayMessage");
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const birthday = new Date(target.getFullYear(), 9, 16);
  if (today.getTime() === birthday.getTime()) {
    message.textContent = "IT'S YOUR DAY, HEET. HAPPY BIRTHDAY, MY LOVE! 🎂❤️";
  }
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Reasons reveal.
const messages = {
  "01": "Because somehow your smile can fix a bad day without even trying.",
  "02": "Because having you around makes ordinary moments feel like memories.",
  "03": "Because before romance, there was friendship — and that's one of my favourite things about us.",
  "04": "Because your silly, annoying, impossible side is somehow also one of the reasons I love you.",
  "05": "Because I don't need a perfect version of you. I just want the real you.",
  "06": "Because out of all the people in this huge world, I somehow got an “us”. ♡"
};

document.querySelectorAll(".reason").forEach(card => {
  card.addEventListener("click", () => {
    const key = card.dataset.reason;
    const output = document.getElementById("reasonReveal");
    output.textContent = messages[key];
    output.animate([
      { opacity: 0, transform: "translateY(8px)" },
      { opacity: 1, transform: "translateY(0)" }
    ], { duration: 450, easing: "ease-out" });
    burstHearts(5);
  });
});

// Final button.
document.getElementById("yesBtn").addEventListener("click", () => {
  document.getElementById("finalReveal").classList.add("show");
  burstHearts(30);
});

// Small celebration burst.
function burstHearts(count) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    heart.className = "heart-particle";
    heart.textContent = Math.random() > .2 ? "♥" : "✦";
    heart.style.left = `${45 + Math.random() * 10}%`;
    heart.style.bottom = `${30 + Math.random() * 20}%`;
    heart.style.fontSize = `${12 + Math.random() * 22}px`;
    heart.style.animationDuration = `${2 + Math.random() * 2}s`;
    hearts.appendChild(heart);
    setTimeout(() => heart.remove(), 5000);
  }
}

// Optional gentle ambient melody made with Web Audio.
// Browsers require a user interaction before audio can start.
let audioCtx = null;
let melodyTimer = null;
let playing = false;
const musicBtn = document.getElementById("musicBtn");

function playTone(freq, start, duration, type = "sine", volume = 0.035) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(start);
  osc.stop(start + duration);
}

function startMelody() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const notes = [261.63, 329.63, 392.00, 329.63, 293.66, 349.23, 440.00, 392.00];
  let index = 0;
  const tick = () => {
    if (!playing) return;
    const now = audioCtx.currentTime;
    playTone(notes[index % notes.length], now, 0.55, "sine", 0.025);
    playTone(notes[(index + 2) % notes.length] / 2, now, 0.8, "triangle", 0.012);
    index++;
  };
  tick();
  melodyTimer = setInterval(tick, 650);
}

musicBtn.addEventListener("click", () => {
  if (!playing) {
    playing = true;
    musicBtn.textContent = "❚❚";
    startMelody();
  } else {
    playing = false;
    musicBtn.textContent = "♫";
    clearInterval(melodyTimer);
    if (audioCtx) audioCtx.close();
    audioCtx = null;
  }
});
