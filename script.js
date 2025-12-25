const canvas = document.createElement("canvas");
canvas.className = "snow";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
let w, h;
let flakes = [];

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function createFlakes() {
  flakes = Array.from({ length: 120 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 3 + 1,
    speed: Math.random() * 1 + 0.5
  }));
}
createFlakes();

function draw() {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  flakes.forEach(f => {
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fill();
    f.y += f.speed;
    f.x += Math.sin(f.y * 0.01);
    if (f.y > h) {
      f.y = -5;
      f.x = Math.random() * w;
    }
  });
  requestAnimationFrame(draw);
}
draw();

// Background music controls
const bgm = new Audio();
bgm.src = 'assets/bgm.mp3';
bgm.loop = true;
bgm.volume = 0.28;
bgm.preload = 'auto';
let musicPlaying = false;

function updateMusicButton() {
  const btn = document.getElementById('music-toggle');
  if (!btn) return;
  btn.textContent = musicPlaying ? '🔊 Music ON' : '🔈 Music OFF';
  btn.setAttribute('aria-pressed', musicPlaying ? 'true' : 'false');
}

function playMusic() {
  bgm.play().then(() => {
    musicPlaying = true;
    updateMusicButton();
    localStorage.setItem('bgmPlaying', '1');
  }).catch(() => {
    // Autoplay blocked; wait for user interaction
    musicPlaying = false;
    updateMusicButton();
  });
}

function pauseMusic() {
  bgm.pause();
  musicPlaying = false;
  updateMusicButton();
  localStorage.setItem('bgmPlaying', '0');
}

function toggleMusic() {
  if (musicPlaying) pauseMusic(); else playMusic();
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('music-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    toggleMusic();
  });

  // Restore preference if user previously enabled music
  const saved = localStorage.getItem('bgmPlaying');
  if (saved === '1') {
    // Many browsers block autoplay; try to play on first user gesture
    const tryPlay = () => {
      playMusic();
      window.removeEventListener('click', tryPlay);
    };
    window.addEventListener('click', tryPlay);
  } else {
    updateMusicButton();
  }
});
