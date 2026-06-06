// ==========================================
// Happy Birthday Web Application Core Logic
// ==========================================

// Global state variables
let audioContext = null;
let musicBoxPlayer = null;
let micStream = null;
let micAnalyser = null;
let isCandlesLit = true;
let activeDragPolaroid = null;
let dragStartX = 0;
let dragStartY = 0;
let dragOffsetX = 0;
let dragOffsetY = 0;
let maxZIndex = 10;
let floatingBubbles = [];
let isWishesScreenActive = false;
let arenaWidth = 0;
let arenaHeight = 0;
let starsEngine = null;

// Polaroid Initial Content Data (Personalized for lyn lin)
const polaroidData = [
  { img: 'assets/party.png', caption: '為 lyn lin 準備的溫馨派對 ✨' },
  { img: 'assets/kitten.png', caption: '送 lyn lin 一隻戴帽子的小橘貓 🐱' },
  { img: 'assets/scenery.png', caption: '願 lyn lin 的未來璀璨如星空 🌌' }
];

// Pre-populated Blessings from Friends (Personalized for lyn lin's 7/10 Birthday)
const initialWishes = [
  { text: '祝 lyn lin 7/10 生日快樂！天天都開心，美麗自信！🎉', avatar: '🌸' },
  { text: '願 lyn lin 新的一歲，所有的夢想都順利開花結果！🎂', avatar: '🎂' },
  { text: 'Happy Birthday to the most amazing lyn lin! 🌟', avatar: '✨' },
  { text: '祝親愛的 lyn lin，心想事成，事事順心！🌸', avatar: '💖' },
  { text: '生日快樂！祝永遠健康快樂，天天開心！🥰', avatar: '🧸' },
  { text: '祝 lyn lin 每天都有吃不完的甜點、喝不完的珍奶，一直幸福！🥤', avatar: '🍓' },
  { text: '7/10 壽星生日快樂！祝你每天都有好心情，工作順利！🎈', avatar: '🎈' },
  { text: '願 lyn lin 所有的溫柔都被這世界溫暖對待，天天開心！💫', avatar: '💫' },
  { text: '生日快樂！祝你今年能踏上所有想去的旅程！✈️', avatar: '🎀' },
  { text: '祝 lyn lin 生日快樂！每天都像星星一樣閃閃發光！🌈', avatar: '🍭' },
  { text: 'Happy 7/10 Birthday! May your day be filled with sweet moments! 🍫', avatar: '🎵' },
  { text: '祝我們最棒的女主角 lyn lin 永遠年輕，笑口常開！🎁', avatar: '🎁' },
  { text: '生日快樂！願你笑口常開，熱開生活的每一天！☀️', avatar: '🌻' },
  { text: '7/10 快樂！願你活成自己最喜歡的樣子，閃耀前行！⭐', avatar: '⭐' },
  { text: '祝 lyn lin 新的一年裡，所有好運都與你撞個滿懷！💎', avatar: '💎' },
  { text: '願你新的一歲裡，所有的願望都如期而至！🍀', avatar: '🍀' },
  { text: '祝最可愛的壽星 lyn lin 生日快樂，天天無憂無慮！🦄', avatar: '🦄' },
  { text: '生日快樂！願你未來的生活像漫天飛舞的櫻花一樣浪漫！🌸', avatar: '🌸' },
  { text: '祝 lyn lin 新的一歲，身心健康，平安喜樂！🌈', avatar: '🌈' },
  { text: 'Happy Birthday! 願你每一天都像彩帶般絢麗奪目！🎉', avatar: '🎉' },
  { text: '祝 lyn lin 7/10 生日快樂！天天好運連連，好夢連連！🌙', avatar: '🌙' },
  { text: '願你天天開心，笑得比花還燦爛，生日快樂！🌻', avatar: '🌻' },
  { text: '生日快樂！祝 lyn lin 擁有一個溫馨而難忘的 7/10！🍰', avatar: '🍰' },
  { text: 'Happy Birthday! May your path be illuminated with joy! 🎶', avatar: '🎶' },
  { text: '祝 lyn lin 每天都有好心情，天天開心，幸福美滿！🌹', avatar: '🌹' }
];

// ==========================================
// 1. Audio Engine (Synthesizer & Sound FX)
// ==========================================
class AudioEngine {
  constructor() {
    this.context = null;
    this.isPlaying = false;
    this.delayNode = null;
    this.feedbackNode = null;
    this.notes = [
      // Section 1: Happy Birthday to you
      { note: 'G4', freq: 392.00, duration: 0.5 },
      { note: 'G4', freq: 392.00, duration: 0.5 },
      { note: 'A4', freq: 440.00, duration: 1.0, bassFreq: 130.81, chordFreqs: [261.63, 329.63] }, // C chord: C3, C4, E4
      { note: 'G4', freq: 392.00, duration: 1.0 },
      { note: 'C5', freq: 523.25, duration: 1.0, bassFreq: 130.81, chordFreqs: [261.63, 329.63] },
      { note: 'B4', freq: 493.88, duration: 2.0, bassFreq: 196.00, chordFreqs: [293.66, 349.23] }, // G7 chord: G3, D4, F4
      
      // Section 2: Happy Birthday to you
      { note: 'G4', freq: 392.00, duration: 0.5 },
      { note: 'G4', freq: 392.00, duration: 0.5 },
      { note: 'A4', freq: 440.00, duration: 1.0, bassFreq: 196.00, chordFreqs: [293.66, 349.23] },
      { note: 'G4', freq: 392.00, duration: 1.0 },
      { note: 'D5', freq: 587.33, duration: 1.0, bassFreq: 196.00, chordFreqs: [293.66, 392.00] },
      { note: 'C5', freq: 523.25, duration: 2.0, bassFreq: 130.81, chordFreqs: [261.63, 329.63] }, // C chord
      
      // Section 3: Happy Birthday dear lyn lin
      { note: 'G4', freq: 392.00, duration: 0.5 },
      { note: 'G4', freq: 392.00, duration: 0.5 },
      { note: 'G5', freq: 783.99, duration: 1.0, bassFreq: 130.81, chordFreqs: [261.63, 329.63] },
      { note: 'E5', freq: 659.25, duration: 1.0, bassFreq: 164.81, chordFreqs: [261.63, 329.63] }, // C/E
      { note: 'C5', freq: 523.25, duration: 1.0, bassFreq: 130.81, chordFreqs: [261.63, 329.63] },
      { note: 'B4', freq: 493.88, duration: 1.0, bassFreq: 146.83, chordFreqs: [293.66, 349.23] }, // G/D
      { note: 'A4', freq: 440.00, duration: 2.0, bassFreq: 174.61, chordFreqs: [261.63, 349.23] }, // F chord
      
      // Section 4: Happy Birthday to you
      { note: 'F5', freq: 698.46, duration: 0.5 },
      { note: 'F5', freq: 698.46, duration: 0.5 },
      { note: 'E5', freq: 659.25, duration: 1.0, bassFreq: 130.81, chordFreqs: [261.63, 329.63] }, // C chord
      { note: 'C5', freq: 523.25, duration: 1.0, bassFreq: 130.81 },
      { note: 'D5', freq: 587.33, duration: 1.0, bassFreq: 196.00, chordFreqs: [293.66, 349.23] }, // G7
      { note: 'C5', freq: 523.25, duration: 2.5, bassFreq: 130.81, chordFreqs: [261.63, 329.63] }
    ];
    this.currentNoteIndex = 0;
    this.nextNoteTime = 0;
    this.schedulerTimer = null;
  }

  init() {
    if (this.context) return;
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create delay line for warm resonance (Echo box effect)
    this.delayNode = this.context.createDelay(1.0);
    this.delayNode.delayTime.value = 0.35;
    
    this.feedbackNode = this.context.createGain();
    this.feedbackNode.gain.value = 0.4; // Decay resonance feedback
    
    // Connect delay cycle
    this.delayNode.connect(this.feedbackNode);
    this.feedbackNode.connect(this.delayNode);
    
    // Connect to output
    this.delayNode.connect(this.context.destination);
  }

  playMusicBoxNote(freq, time, duration, isBass = false, isChord = false) {
    if (!this.context) return;

    // Create primary sound oscillator
    const osc = this.context.createOscillator();
    const gainNode = this.context.createGain();
    
    // Triangle wave gives a soft, metallic chime similar to a music box
    osc.type = 'triangle';
    osc.frequency.value = freq;
    
    // Gain envelope
    const now = time;
    gainNode.gain.setValueAtTime(0, now);
    
    let maxGain = 0.35;
    let decayTime = 0.2;
    let releaseTime = 1.2;
    
    if (isBass) {
      maxGain = 0.18;
      decayTime = 0.35;
      releaseTime = 2.0;
      // Add low-pass filter to make bass warmer and less punchy
      const filter = this.context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      osc.connect(filter);
      filter.connect(gainNode);
    } else if (isChord) {
      maxGain = 0.12;
      decayTime = 0.25;
      releaseTime = 1.5;
      // Soft bandpass filter for chords to keep mid range sweet
      const filter = this.context.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.value = 600;
      filter.Q.value = 1.0;
      filter.gain.value = -3;
      osc.connect(filter);
      filter.connect(gainNode);
    } else {
      osc.connect(gainNode);
    }
    
    gainNode.gain.linearRampToValueAtTime(maxGain, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(maxGain * 0.2, now + decayTime);
    gainNode.gain.setValueAtTime(maxGain * 0.2, now + duration - 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration + releaseTime);
    
    gainNode.connect(this.context.destination);
    gainNode.connect(this.delayNode);
    
    osc.start(now);
    osc.stop(now + duration + releaseTime + 0.3);
  }

  scheduler() {
    while (this.nextNoteTime < this.context.currentTime + 0.1) {
      const note = this.notes[this.currentNoteIndex];
      
      // Play main note
      this.playMusicBoxNote(note.freq, this.nextNoteTime, note.duration * 0.8, false, false);
      
      // Play bass note if present
      if (note.bassFreq) {
        this.playMusicBoxNote(note.bassFreq, this.nextNoteTime, note.duration * 1.5, true, false);
      }
      
      // Play chord notes if present
      if (note.chordFreqs) {
        note.chordFreqs.forEach(cf => {
          this.playMusicBoxNote(cf, this.nextNoteTime, note.duration * 1.2, false, true);
        });
      }
      
      // Advance play pointer
      const stepDuration = note.duration * 0.75; // Control tempo speed
      this.nextNoteTime += stepDuration;
      
      this.currentNoteIndex = (this.currentNoteIndex + 1) % this.notes.length;
    }
    
    this.schedulerTimer = setTimeout(() => this.scheduler(), 50);
  }

  startMusic() {
    this.init();
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
    
    if (this.isPlaying) return;
    this.isPlaying = true;
    
    this.currentNoteIndex = 0;
    this.nextNoteTime = this.context.currentTime + 0.05;
    this.scheduler();
    
    document.getElementById('music-controller').classList.add('playing');
  }

  stopMusic() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    clearTimeout(this.schedulerTimer);
    document.getElementById('music-controller').classList.remove('playing');
  }

  toggleMusic() {
    if (this.isPlaying) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
  }

  // Synthesize popping sound (short frequency sweep)
  playPopSound() {
    this.init();
    if (!this.context) return;
    
    const osc = this.context.createOscillator();
    const gainNode = this.context.createGain();
    
    osc.type = 'sine';
    // Pitch sweep: fast decline from high to low
    osc.frequency.setValueAtTime(900, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.context.currentTime + 0.08);
    
    // Volume envelope
    gainNode.gain.setValueAtTime(0.15, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.08);
    
    osc.connect(gainNode);
    gainNode.connect(this.context.destination);
    
    osc.start();
    osc.stop(this.context.currentTime + 0.1);
  }

  // Synthesize typewriter noise burst for key tick
  playTypewriterSound() {
    this.init();
    if (!this.context) return;
    
    const now = this.context.currentTime;
    
    // Noise buffer
    const bufferSize = this.context.sampleRate * 0.02; // 20ms burst
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseNode = this.context.createBufferSource();
    noiseNode.buffer = buffer;
    
    const filter = this.context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800; // click resonant frequency
    filter.Q.value = 4.0;
    
    const gainNode = this.context.createGain();
    gainNode.gain.setValueAtTime(0.04, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);
    
    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.context.destination);
    
    noiseNode.start(now);
  }

  // Synthesize magical sparkle chime sound for birthday card reveals
  playSparkleSound() {
    this.init();
    if (!this.context) return;
    
    const now = this.context.currentTime;
    const chimeFreqs = [880, 1046.5, 1318.5, 1568, 1760, 2093]; // Beautiful high C-major pentatonic arpeggio
    
    chimeFreqs.forEach((freq, idx) => {
      const osc = this.context.createOscillator();
      const gainNode = this.context.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const delay = idx * 0.08;
      
      gainNode.gain.setValueAtTime(0, now + delay);
      gainNode.gain.linearRampToValueAtTime(0.1, now + delay + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.6);
      
      osc.connect(gainNode);
      gainNode.connect(this.context.destination);
      gainNode.connect(this.delayNode);
      
      osc.start(now + delay);
      osc.stop(now + delay + 0.8);
    });
  }
}

const audio = new AudioEngine();

// ==========================================
// 2. Confetti & Sakura Petal Engine
// ==========================================
class ConfettiEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationFrame = null;
    this.colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
    this.pinkShowerActive = false;
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  // Create a particle explosion
  burst(x, y, count = 100) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 15 + 5;
      
      this.particles.push({
        x: x,
        y: y,
        size: Math.random() * 8 + 6,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (y > window.innerHeight * 0.8 ? Math.random() * 8 + 4 : 0), // Upwards boost if burst is near screen bottom
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5,
        opacity: 1,
        shape: Math.random() > 0.5 ? 'circle' : 'rect',
        gravity: Math.random() * 0.15 + 0.15,
        drag: 0.97
      });
    }

    if (!this.animationFrame) {
      this.tick();
    }
  }

  // Spawns soap bubble popped splash particles
  popBurst(x, y, count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      
      this.particles.push({
        x: x,
        y: y,
        size: Math.random() * 5 + 4,
        color: 'rgba(255, 255, 255, 0.75)',
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 4 - 2,
        opacity: 1,
        shape: 'bubble-droplet',
        gravity: 0.05,
        drag: 0.95
      });
    }

    if (!this.animationFrame) {
      this.tick();
    }
  }

  // Activate continuous background drifting of pink sakura petals and hearts ("滿屏粉飛")
  startPinkShower() {
    this.pinkShowerActive = true;
    if (!this.animationFrame) {
      this.tick();
    }
  }

  tick() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Spawns floating pink elements continuously if active
    if (this.pinkShowerActive && Math.random() < 0.22) {
      const isHeart = Math.random() > 0.65;
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: -30,
        size: Math.random() * 8 + 12, // larger size for floaters
        color: ['#ffb7c5', '#ffc0cb', '#fa7298', '#ff69b4', '#ff8da1'][Math.floor(Math.random() * 5)],
        vx: Math.random() * 1.5 - 1.25, // slight drift to the left (wind)
        vy: Math.random() * 1.0 + 1.2,  // slow, floating fall speed
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 2 - 1,
        opacity: Math.random() * 0.4 + 0.6,
        shape: isHeart ? 'heart' : 'petal',
        gravity: 0.012, // low gravity for floating effect
        drag: 0.99,
        swayTime: Math.random() * 100,
        swaySpeed: Math.random() * 0.02 + 0.015,
        swayWidth: Math.random() * 1.0 + 0.5
      });
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      // Update physics
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      
      // Handle drifting sway for sakura/hearts
      if (p.swayTime !== undefined) {
        p.swayTime += p.swaySpeed;
        p.x += Math.sin(p.swayTime) * p.swayWidth;
      }
      
      // Slow fadeout when particle is falling down past mid-screen
      if (p.vy > 0 && p.y > this.canvas.height * 0.6) {
        p.opacity -= 0.012;
      }
      
      // Remove dead particles
      if (p.opacity <= 0 || p.x < -50 || p.x > this.canvas.width + 50 || p.y > this.canvas.height) {
        this.particles.splice(i, 1);
        continue;
      }
      
      // Render
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fillStyle = p.color;
      
      if (p.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else if (p.shape === 'petal') {
        // Draw a realistic sakura cherry blossom petal shape
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.bezierCurveTo(-p.size/2, -p.size/2, -p.size/2, p.size/2, 0, p.size);
        this.ctx.bezierCurveTo(p.size/2, p.size/2, p.size/2, -p.size/2, 0, 0);
        this.ctx.fill();
      } else if (p.shape === 'heart') {
        // Draw a vector heart on canvas
        this.ctx.beginPath();
        const s = p.size * 0.55;
        this.ctx.moveTo(0, s * 0.3);
        this.ctx.bezierCurveTo(-s * 0.3, -s * 0.3, -s * 0.85, -s * 0.3, -s * 0.85, s * 0.25);
        this.ctx.bezierCurveTo(-s * 0.85, s * 0.7, -s * 0.2, s * 1.1, 0, s * 1.35);
        this.ctx.bezierCurveTo(s * 0.2, s * 1.1, s * 0.85, s * 0.7, s * 0.85, s * 0.25);
        this.ctx.bezierCurveTo(s * 0.85, -s * 0.3, s * 0.3, -s * 0.3, 0, s * 0.3);
        this.ctx.fill();
      } else if (p.shape === 'bubble-droplet') {
        // Draw a beautiful soap bubble droplet
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(255, 230, 240, 0.8)';
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.lineWidth = 1;
        this.ctx.fill();
        this.ctx.stroke();
      }
      
      this.ctx.restore();
    }
    
    if (this.particles.length > 0) {
      this.animationFrame = requestAnimationFrame(() => this.tick());
    } else {
      this.animationFrame = null;
    }
  }
}

// ==========================================
// 2B. Stars Parallax Canvas Engine
// ==========================================
class StarsEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    
    this.resize();
    this.initStars();
    
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX - window.innerWidth / 2) * 0.05;
      this.targetMouseY = (e.clientY - window.innerHeight / 2) * 0.05;
    });
    
    this.animate();
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  initStars() {
    const starCount = Math.floor((window.innerWidth * window.innerHeight) / 12000);
    this.stars = [];
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 1.5 + 0.5,
        depth: Math.random() * 0.8 + 0.2, // Parallax depth
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1
      });
    }
  }
  
  animate() {
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.08;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.08;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.stars.forEach(star => {
      // Twinkle logic
      star.alpha += star.twinkleSpeed * star.twinkleDir;
      if (star.alpha >= 1) {
        star.alpha = 1;
        star.twinkleDir = -1;
      } else if (star.alpha <= 0.1) {
        star.alpha = 0.1;
        star.twinkleDir = 1;
      }
      
      // Calculate parallax translation
      let drawX = star.x - this.mouseX * star.depth;
      let drawY = star.y - this.mouseY * star.depth;
      
      // Wrap around bounds
      if (drawX < 0) drawX += this.canvas.width;
      if (drawX > this.canvas.width) drawX -= this.canvas.width;
      if (drawY < 0) drawY += this.canvas.height;
      if (drawY > this.canvas.height) drawY -= this.canvas.height;
      
      this.ctx.save();
      this.ctx.globalAlpha = star.alpha;
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

let confetti = null;

// ==========================================
// 3. Microphone Blowing Detector
// ==========================================
async function initMicBlowDetection() {
  const micDot = document.getElementById('mic-indicator-dot');
  const micText = document.getElementById('mic-indicator-text');
  
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // Initialize Web Audio nodes for Mic Analyzer
    audio.init();
    micAnalyser = audio.context.createAnalyser();
    micAnalyser.fftSize = 512;
    
    const source = audio.context.createMediaStreamSource(micStream);
    source.connect(micAnalyser);
    
    micDot.classList.add('active');
    micText.textContent = '吹氣感應中...朝著麥克風大力吹氣！ 🌬️';
    
    detectBlow();
  } catch (err) {
    console.warn('Microphone access denied or unavailable: ', err);
    micDot.classList.remove('active');
    micText.textContent = '麥克風不可用，請直接點擊蛋糕吹熄 🕯️';
  }
}

let blowStreak = 0;
function detectBlow() {
  if (!isCandlesLit || !micAnalyser) return;
  
  const bufferLength = micAnalyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  micAnalyser.getByteFrequencyData(dataArray);
  
  // Calculate average intensity in high frequencies (blow wind sound is mostly high freq noise)
  let highFreqSum = 0;
  const startIndex = Math.floor(bufferLength * 0.35); // Filter out lower base frequencies (like ambient voices/humming)
  for (let i = startIndex; i < bufferLength; i++) {
    highFreqSum += dataArray[i];
  }
  const averageHigh = highFreqSum / (bufferLength - startIndex);
  
  // Threshold value of volume/wind pressure
  if (averageHigh > 65) {
    blowStreak++;
    document.getElementById('mic-indicator-dot').classList.add('blow-detected');
    
    // Requires blowing consistently for a brief moment to avoid false-positives
    if (blowStreak >= 8) {
      blowOutCandles();
    }
  } else {
    blowStreak = Math.max(0, blowStreak - 2);
    document.getElementById('mic-indicator-dot').classList.remove('blow-detected');
  }
  
  requestAnimationFrame(detectBlow);
}

function stopMicStream() {
  if (micStream) {
    micStream.getTracks().forEach(track => track.stop());
    micStream = null;
  }
}

// ==========================================
// 4. Polaroid Drag & Drop System
// ==========================================
function initPolaroids() {
  const container = document.getElementById('polaroids-container');
  container.innerHTML = ''; // Clear container
  
  const isMobile = window.innerWidth <= 600;
  const cardWidth = isMobile ? 150 : 200;
  const cardHeight = isMobile ? 210 : 280;
  
  polaroidData.forEach((data, index) => {
    const card = document.createElement('div');
    card.className = 'polaroid';
    card.id = `polaroid-${index}`;
    
    // Spread polaroids around in random locations and rotation
    const rotation = Math.random() * 20 - 10; // -10deg to 10deg
    
    // Layout logic: distribute horizontally across container
    const width = container.clientWidth || 700;
    const height = container.clientHeight || 450;
    
    const segmentWidth = width / polaroidData.length;
    const baseLeft = segmentWidth * index + (segmentWidth - cardWidth) / 2;
    const left = Math.max(10, Math.min(baseLeft + (Math.random() * 40 - 20), width - cardWidth - 10));
    const top = Math.max(10, Math.min((height - cardHeight) / 2 + (Math.random() * 80 - 40), height - cardHeight - 10));
    
    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
    card.style.transform = `rotate(${rotation}deg)`;
    card.style.zIndex = index + 1;
    card.setAttribute('data-rotation', rotation);
    
    card.innerHTML = `
      <div class="polaroid-img-container">
        <img src="${data.img}" alt="${data.caption}">
      </div>
      <div class="polaroid-caption">${data.caption}</div>
    `;
    
    card.addEventListener('pointerdown', onDragStart);
    card.addEventListener('dblclick', () => showPolaroidDetail(data));
    container.appendChild(card);
  });
}

function onDragStart(e) {
  if (e.button !== 0 && e.pointerType === 'mouse') return;
  
  activeDragPolaroid = e.currentTarget;
  activeDragPolaroid.style.cursor = 'grabbing';
  activeDragPolaroid.style.scale = '1.05';
  
  maxZIndex++;
  activeDragPolaroid.style.zIndex = maxZIndex;
  
  const rect = activeDragPolaroid.getBoundingClientRect();
  
  dragOffsetX = e.clientX - rect.left;
  dragOffsetY = e.clientY - rect.top;
  
  // Track velocity
  activeDragPolaroid.dragLastX = e.clientX;
  activeDragPolaroid.dragLastTime = Date.now();
  activeDragPolaroid.dragVelocityX = 0;
  
  activeDragPolaroid.setPointerCapture(e.pointerId);
  activeDragPolaroid.addEventListener('pointermove', onDragMove);
  activeDragPolaroid.addEventListener('pointerup', onDragEnd);
  activeDragPolaroid.addEventListener('pointercancel', onDragEnd);
}

function onDragMove(e) {
  if (!activeDragPolaroid) return;
  
  const parent = activeDragPolaroid.parentElement;
  const parentRect = parent.getBoundingClientRect();
  
  let newLeft = e.clientX - parentRect.left - dragOffsetX;
  let newTop = e.clientY - parentRect.top - dragOffsetY;
  
  const maxX = parentRect.width - 150;
  const maxY = parentRect.height - 150;
  
  newLeft = Math.max(-50, Math.min(newLeft, maxX));
  newTop = Math.max(-50, Math.min(newTop, maxY));
  
  // Calculate speed / velocity
  const now = Date.now();
  const dt = now - activeDragPolaroid.dragLastTime || 1;
  const dx = e.clientX - activeDragPolaroid.dragLastX;
  activeDragPolaroid.dragVelocityX = dx / dt;
  
  // Dynamic rotate inertia mapping
  const baseRot = parseFloat(activeDragPolaroid.getAttribute('data-rotation')) || 0;
  const targetRot = baseRot + activeDragPolaroid.dragVelocityX * 35; 
  const clampedRot = Math.max(-35, Math.min(targetRot, 35));
  
  activeDragPolaroid.style.left = `${newLeft}px`;
  activeDragPolaroid.style.top = `${newTop}px`;
  activeDragPolaroid.style.transform = `rotate(${clampedRot}deg)`;
  
  activeDragPolaroid.dragLastX = e.clientX;
  activeDragPolaroid.dragLastTime = now;
}

function onDragEnd(e) {
  if (!activeDragPolaroid) return;
  
  activeDragPolaroid.style.cursor = 'grab';
  activeDragPolaroid.style.scale = '';
  
  const rot = activeDragPolaroid.getAttribute('data-rotation');
  activeDragPolaroid.style.transform = `rotate(${rot}deg)`;
  activeDragPolaroid.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  
  const currentEl = activeDragPolaroid;
  setTimeout(() => {
    if (currentEl) currentEl.style.transition = '';
  }, 400);
  
  activeDragPolaroid.releasePointerCapture(e.pointerId);
  activeDragPolaroid.removeEventListener('pointermove', onDragMove);
  activeDragPolaroid.removeEventListener('pointerup', onDragEnd);
  activeDragPolaroid.removeEventListener('pointercancel', onDragEnd);
  
  activeDragPolaroid = null;
}

function showPolaroidDetail(data) {
  const modal = document.getElementById('polaroid-detail-modal');
  modal.querySelector('img').src = data.img;
  modal.querySelector('.modal-polaroid-caption').textContent = data.caption;
  modal.showModal();
  audio.playSparkleSound();
}

// ==========================================
// 5. Balloon System
// ==========================================
const BALLOON_COLORS = [
  'radial-gradient(circle at 30% 30%, #ff8a80, #e53935)', // Red
  'radial-gradient(circle at 30% 30%, #ff80ab, #d81b60)', // Pink
  'radial-gradient(circle at 30% 30%, #ea80fc, #8e24aa)', // Purple
  'radial-gradient(circle at 30% 30%, #82b1ff, #1e88e5)', // Blue
  'radial-gradient(circle at 30% 30%, #84ffff, #00acc1)', // Cyan
  'radial-gradient(circle at 30% 30%, #b9f6ca, #43a047)', // Green
  'radial-gradient(circle at 30% 30%, #ffe57f, #ffb300)'  // Gold
];

function spawnBalloon() {
  const activeScreen = document.querySelector('.screen-container.active');
  if (!activeScreen) return;
  
  // Don't spawn floating balloons in wishes stage because we have dedicated wish bubbles there!
  if (activeScreen.id === 'screen-wishes') return;
  
  const balloon = document.createElement('div');
  balloon.className = 'balloon';
  
  const left = Math.random() * 85 + 5;
  const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
  const duration = Math.random() * 6 + 9;
  const size = Math.random() * 25 + 65;
  
  balloon.style.left = `${left}vw`;
  balloon.style.width = `${size}px`;
  balloon.style.height = `${size * 1.25}px`;
  balloon.style.animationDuration = `${duration}s`;
  
  const ts = Date.now();
  balloon.innerHTML = `
    <svg viewBox="0 0 100 150" width="100%" height="100%">
      <defs>
        <radialGradient id="grad-${left.toFixed(0)}-${ts}" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#fff" stop-opacity="0.5"/>
          <stop offset="20%" stop-color="${color.match(/#[0-9a-fA-F]{6}/g)?.[0] || '#f00'}"/>
          <stop offset="100%" stop-color="${color.match(/#[0-9a-fA-F]{6}/g)?.[1] || '#900'}"/>
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="55" rx="40" ry="50" fill="url(#grad-${left.toFixed(0)}-${ts})" />
      <polygon points="50,105 44,115 56,115" fill="#aaa" opacity="0.6"/>
      <path d="M50,115 Q45,130 50,145 T55,160" fill="none" stroke="#ccc" stroke-width="2"/>
    </svg>
  `;
  
  balloon.addEventListener('click', (e) => {
    e.stopPropagation();
    popBalloon(balloon);
  });
  
  document.body.appendChild(balloon);
  
  setTimeout(() => {
    if (balloon.parentElement) {
      balloon.remove();
    }
  }, duration * 1000);
}

function popBalloon(balloonEl) {
  const rect = balloonEl.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  audio.playPopSound();
  confetti.burst(centerX, centerY, 15);
  balloonEl.remove();
}

function startBalloonsLifecycle() {
  setInterval(spawnBalloon, 2500);
}

// ==========================================
// 6. Interactive Floating Wish Bubbles Physics Simulation
// ==========================================
function initFloatingWishes() {
  const container = document.getElementById('wishes-bubbles-container');
  if (!container) return;
  container.innerHTML = ''; // Clear arena
  floatingBubbles = [];
  
  const rect = container.getBoundingClientRect();
  arenaWidth = rect.width;
  arenaHeight = rect.height;
  if (arenaWidth < 200) arenaWidth = window.innerWidth - 64;
  if (arenaHeight < 200) arenaHeight = window.innerHeight - 220;
  
  initialWishes.forEach((wish, index) => {
    const el = document.createElement('div');
    el.className = 'wish-bubble';
    
    const diameter = Math.random() * 30 + 135;
    const radius = diameter / 2;
    el.style.width = `${diameter}px`;
    el.style.height = `${diameter}px`;
    
    const x = Math.random() * (arenaWidth - diameter - 20) + radius + 10;
    const y = Math.random() * (arenaHeight - diameter - 20) + radius + 10;
    
    const speed = Math.random() * 0.15 + 0.15;
    const angle = Math.random() * Math.PI * 2;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    
    el.innerHTML = `
       <div class="wish-bubble-content">
         <div class="wish-bubble-avatar">${wish.avatar}</div>
         <div class="wish-bubble-text">${wish.text}</div>
       </div>
    `;
    
    el.addEventListener('click', () => {
      showBlessingDetail(wish, el);
    });
    
    container.appendChild(el);
    
    floatingBubbles.push({
      el,
      x,
      y,
      vx,
      vy,
      radius
    });
  });
  
  updateBubblesPhysics();
}

function updateBubblesPhysics() {
  if (!isWishesScreenActive) return;
  
  for (let i = 0; i < floatingBubbles.length; i++) {
    for (let j = i + 1; j < floatingBubbles.length; j++) {
      const b1 = floatingBubbles[i];
      const b2 = floatingBubbles[j];
      
      const dx = b2.x - b1.x;
      const dy = b2.y - b1.y;
      const dist = Math.hypot(dx, dy);
      const minDist = b1.radius + b2.radius;
      
      if (dist < minDist) {
        const overlap = minDist - dist;
        const pushX = (dx / (dist || 1)) * overlap * 0.04;
        const pushY = (dy / (dist || 1)) * overlap * 0.04;
        
        b1.vx -= pushX;
        b1.vy -= pushY;
        b2.vx += pushX;
        b2.vy += pushY;
        
        const limit = 0.8;
        b1.vx = Math.max(-limit, Math.min(b1.vx, limit));
        b1.vy = Math.max(-limit, Math.min(b1.vy, limit));
        b2.vx = Math.max(-limit, Math.min(b2.vx, limit));
        b2.vy = Math.max(-limit, Math.min(b2.vy, limit));
      }
    }
  }
  
  floatingBubbles.forEach(b => {
    b.x += b.vx;
    b.y += b.vy;
    
    const minX = b.radius;
    const maxX = arenaWidth - b.radius;
    const minY = b.radius;
    const maxY = arenaHeight - b.radius;
    
    if (b.x < minX) {
      b.x = minX;
      b.vx = Math.abs(b.vx);
    } else if (b.x > maxX) {
      b.x = maxX;
      b.vx = -Math.abs(b.vx);
    }
    
    if (b.y < minY) {
      b.y = minY;
      b.vy = Math.abs(b.vy);
    } else if (b.y > maxY) {
      b.y = maxY;
      b.vy = -Math.abs(b.vy);
    }
    
    b.el.style.transform = `translate3d(${b.x - b.radius}px, ${b.y - b.radius}px, 0)`;
  });
  
  requestAnimationFrame(updateBubblesPhysics);
}

function showBlessingDetail(wish, bubbleEl) {
  const rect = bubbleEl.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  // Trigger popping effect and pop audio
  audio.playPopSound();
  confetti.popBurst(centerX, centerY, 15);
  
  setTimeout(() => {
    const modal = document.getElementById('bubble-blessing-modal');
    document.getElementById('modal-blessing-avatar').textContent = wish.avatar;
    document.getElementById('modal-blessing-text').textContent = wish.text;
    
    modal.showModal();
    audio.playSparkleSound();
    
    confetti.burst(window.innerWidth / 2, window.innerHeight * 0.3, 15);
  }, 150);
}

window.addEventListener('resize', () => {
  if (isWishesScreenActive) {
    // Ignore resizing bounds calculations while modal dialogs are open.
    // Opening dialogs triggers scrollbar toggling which fires resize events, causing container reflow shifts.
    const letterDialog = document.getElementById('birthday-letter');
    const blessingDialog = document.getElementById('bubble-blessing-modal');
    const polaroidDialog = document.getElementById('polaroid-detail-modal');
    if (
      (letterDialog && letterDialog.open) ||
      (blessingDialog && blessingDialog.open) ||
      (polaroidDialog && polaroidDialog.open)
    ) {
      return;
    }

    const container = document.getElementById('wishes-bubbles-container');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    arenaWidth = rect.width;
    arenaHeight = rect.height;
    if (arenaWidth < 200) arenaWidth = window.innerWidth - 64;
    if (arenaHeight < 200) arenaHeight = window.innerHeight - 220;
    
    floatingBubbles.forEach(b => {
      b.x = Math.max(b.radius, Math.min(b.x, arenaWidth - b.radius));
      b.y = Math.max(b.radius, Math.min(b.y, arenaHeight - b.radius));
    });
  }
});

// ==========================================
// 7. Page Event Controllers & Stage Transitions
// ==========================================

// Stage 1 -> Stage 2 (Invitation Box Opened -> Memory Lane)
function openInvitation() {
  const screen1 = document.getElementById('screen-invitation');
  const screen2 = document.getElementById('screen-memories');
  
  screen1.classList.remove('active');
  screen1.classList.add('fade-out');
  screen2.classList.add('active');
  
  audio.startMusic();
  
  const centerWidth = window.innerWidth / 2;
  const centerHeight = window.innerHeight * 0.45;
  confetti.burst(centerWidth, centerHeight, 60);
  
  setTimeout(() => {
    initPolaroids();
  }, 100);
}

// Stage 2 -> Stage 3 (Memory Lane -> Cake & Blow)
function goToCakeScreen() {
  const screen2 = document.getElementById('screen-memories');
  const screen3 = document.getElementById('screen-cake');
  
  screen2.classList.remove('active');
  screen3.classList.add('active');
  
  setTimeout(() => {
    initMicBlowDetection();
  }, 500);
  
  audio.playSparkleSound();
}

// Stage 3 Blow Trigger -> Show Custom Letter Modal
function blowOutCandles() {
  if (!isCandlesLit) return;
  isCandlesLit = false;
  
  stopMicStream();
  
  const micDot = document.getElementById('mic-indicator-dot');
  const micText = document.getElementById('mic-indicator-text');
  if (micDot) micDot.className = 'mic-dot';
  if (micText) micText.textContent = '許願達成！蠟燭吹熄囉 ✨';
  
  const flames = document.querySelectorAll('.candle-flame');
  flames.forEach(flame => flame.classList.add('extinguished'));
  
  confetti.burst(0, window.innerHeight * 0.9, 80);
  confetti.burst(window.innerWidth, window.innerHeight * 0.9, 80);
  
  let celebrationShower = setInterval(() => {
    confetti.burst(Math.random() * window.innerWidth, window.innerHeight * 0.1, 10);
  }, 150);
  
  setTimeout(() => clearInterval(celebrationShower), 4000);
  
  audio.playSparkleSound();
  
  setTimeout(() => {
    openBirthdayLetter();
  }, 1800);
}

// Typewriter effect to display letter
function openBirthdayLetter() {
  const letterDialog = document.getElementById('birthday-letter');
  letterDialog.showModal();
  
  const letterBody = document.getElementById('letter-content');
  const letterMsg = `親愛的 lyn lin：

在這個非常特別的日子——7月10日，祝你生日快樂！🎂🌸

希望這份為你精心設計的互動小旅程，能帶給你滿滿的驚喜與笑容。願你在新的一歲裡，所有的願望都能如期而至，生活被溫暖、快樂與無數美好的瞬間填滿。

不論未來的道路如何，都請記得保持你那份善良、溫柔且充滿元氣的靈魂。期待你的下一歲，如同吹熄蠟燭時綻放的彩色碎片一般，無比絢麗與奪目！

祝 lyn lin 永遠開心，幸福美滿，7/10 生日快樂！✨`;
  
  letterBody.textContent = '';
  let charIdx = 0;
  
  function typeWriter() {
    if (charIdx < letterMsg.length) {
      letterBody.textContent += letterMsg.charAt(charIdx);
      
      const char = letterMsg.charAt(charIdx);
      if (char !== ' ' && char !== '\n') {
        audio.playTypewriterSound();
      }
      
      charIdx++;
      letterBody.scrollTop = letterBody.scrollHeight;
      setTimeout(typeWriter, 40);
    }
  }
  
  typeWriter();
}

// Stage 3 -> Stage 4 (Letter Closed -> Wishes Bubble Stage + Pink Shower)
function transitionToWishesScreen() {
  const screen3 = document.getElementById('screen-cake');
  const screen4 = document.getElementById('screen-wishes');
  
  if (!screen4.classList.contains('active')) {
    screen3.classList.remove('active');
    screen4.classList.add('active');
    
    // Activate floating bubble logic
    isWishesScreenActive = true;
    
    // Start continuous sakura / hearts pink shower! ("滿屏粉飛")
    confetti.startPinkShower();
    
    // Initialize & animate bubble arena
    setTimeout(() => {
      initFloatingWishes();
    }, 100);
    
    // Confetti burst on the final screen!
    confetti.burst(window.innerWidth / 2, window.innerHeight * 0.5, 45);
    audio.playSparkleSound();
  }
}

// ==========================================
// 8. Initialization On Window Load
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  // 1. Preload Polaroid Images
  const imagesToPreload = [
    'assets/party.png',
    'assets/kitten.png',
    'assets/scenery.png'
  ];
  let loadedCount = 0;
  
  function hideLoader() {
    const loader = document.getElementById('loading-overlay');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => loader.remove(), 600);
    }
  }
  
  if (imagesToPreload.length === 0) {
    hideLoader();
  } else {
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loadedCount++;
        if (loadedCount === imagesToPreload.length) {
          hideLoader();
        }
      };
      img.src = src;
    });
  }

  // 2. Initialize Confetti Canvas Engine
  confetti = new ConfettiEngine('confetti-canvas');

  // 3. Initialize Twinkling Starry Sky Canvas Engine
  starsEngine = new StarsEngine('stars-canvas');
  
  // 4. Start background balloon generator
  startBalloonsLifecycle();
  
  // 5. iOS Web Audio API unlock listener
  const unlockAudio = () => {
    if (audio.context && audio.context.state === 'suspended') {
      audio.context.resume();
    }
  };
  document.body.addEventListener('click', unlockAudio, { once: false });
  document.body.addEventListener('touchstart', unlockAudio, { once: false });

  // 6. Attach DOM Event Listeners for stage control
  document.getElementById('open-gift-btn').addEventListener('click', openInvitation);
  document.getElementById('gift-container').addEventListener('click', openInvitation);
  document.getElementById('go-to-cake-btn').addEventListener('click', goToCakeScreen);
  
  // Click candles or cake itself to blow out manually as fallback
  document.getElementById('birthday-cake-svg').addEventListener('click', () => {
    if (isCandlesLit) {
      blowOutCandles();
    }
  });
  
  // Letter close transition
  const letterDialog = document.getElementById('birthday-letter');
  document.getElementById('close-letter-btn').addEventListener('click', () => {
    letterDialog.close();
  });
  
  // Blessing card close compatibility (ensures compatibility with Safari/Firefox)
  const blessingDialog = document.getElementById('bubble-blessing-modal');
  blessingDialog.querySelector('.modal-close-btn').addEventListener('click', () => {
    blessingDialog.close();
  });

  // Polaroid detail zoom close compatibility
  const polaroidDialog = document.getElementById('polaroid-detail-modal');
  polaroidDialog.querySelector('.modal-close-btn').addEventListener('click', () => {
    polaroidDialog.close();
  });
  
  // Listen for the native dialog close event (handles clicking ESC or button)
  letterDialog.addEventListener('close', transitionToWishesScreen);
  
  // Floating Music Player disc toggle
  document.getElementById('music-controller').addEventListener('click', () => {
    audio.toggleMusic();
  });

  // 7. Add Custom Wish Modal Listeners
  const addWishBtn = document.getElementById('add-wish-btn');
  const customWishModal = document.getElementById('custom-wish-modal');
  const cancelWishBtn = document.getElementById('cancel-wish-btn');
  const submitWishBtn = document.getElementById('submit-wish-btn');
  const customWishInput = document.getElementById('custom-wish-input');
  
  addWishBtn.addEventListener('click', () => {
    customWishInput.value = '';
    customWishModal.showModal();
  });
  
  cancelWishBtn.addEventListener('click', () => {
    customWishModal.close();
  });
  
  submitWishBtn.addEventListener('click', () => {
    const text = customWishInput.value.trim();
    if (!text) {
      alert('願望內容不能為空喔！🌸');
      return;
    }
    
    spawnCustomWish(text);
    customWishModal.close();
  });
});

// Helper function to spawn a custom created wish bubble in the arena
function spawnCustomWish(text) {
  const container = document.getElementById('wishes-bubbles-container');
  if (!container) return;
  
  const wish = { text: text, avatar: '✨' };
  
  const el = document.createElement('div');
  el.className = 'wish-bubble custom-wish';
  
  const diameter = 150;
  const radius = diameter / 2;
  el.style.width = `${diameter}px`;
  el.style.height = `${diameter}px`;
  
  const x = arenaWidth / 2;
  const y = arenaHeight / 2;
  
  const speed = Math.random() * 0.15 + 0.15;
  const angle = Math.random() * Math.PI * 2;
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;
  
  el.innerHTML = `
     <div class="wish-bubble-content">
       <div class="wish-bubble-avatar">${wish.avatar}</div>
       <div class="wish-bubble-text">${wish.text}</div>
     </div>
  `;
  
  el.addEventListener('click', () => {
    showBlessingDetail(wish, el);
  });
  
  container.appendChild(el);
  
  const bubbleObj = {
    el,
    x,
    y,
    vx,
    vy,
    radius
  };
  
  floatingBubbles.push(bubbleObj);
  
  audio.playSparkleSound();
  confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 25);
}
