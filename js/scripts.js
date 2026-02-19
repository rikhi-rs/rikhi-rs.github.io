/* ============================================
   MODERN PORTFOLIO — Scripts
   Elegant & Refined Edition
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initGameOfLife();
  initScrollAnimations();
  initCounters();
  initSkillBars();
  initScrollTop();
  initSmoothScroll();
});

document.addEventListener('components-loaded', () => {
  initNavbar();
  initMobileMenu();
  initThemeToggle();
});

/* ---------- GAME OF LIFE BACKGROUND ---------- */
function initGameOfLife() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Configuration
  const cellSize = 8; // Size of each cell in pixels
  let cols, rows;
  let grid;

  // Colors
  const COLOR_DEFAULT = 'rgba(16, 185, 129, 0.15)'; // Greenish low opacity
  const COLOR_BW = 'rgba(255, 255, 255, 0.1)';      // White low opacity

  // Initialize
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.ceil(canvas.width / cellSize);
    rows = Math.ceil(canvas.height / cellSize);
    grid = createGrid();
  }

  function createGrid() {
    const newGrid = new Array(cols).fill(null).map(() => new Array(rows).fill(0));
    // Randomize
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        newGrid[i][j] = Math.random() > 0.85 ? 1 : 0; // 15% chance of being alive
      }
    }
    return newGrid;
  }

  // Game Logic
  function updateGrid() {
    const nextGrid = new Array(cols).fill(null).map(() => new Array(rows).fill(0));

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const state = grid[i][j];

        // Count live neighbors
        let neighbors = 0;
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            if (x === 0 && y === 0) continue;
            const col = (i + x + cols) % cols;
            const row = (j + y + rows) % rows;
            neighbors += grid[col][row];
          }
        }

        // Apply Rules
        if (state === 0 && neighbors === 3) {
          nextGrid[i][j] = 1; // Birth
        } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
          nextGrid[i][j] = 0; // Death
        } else {
          nextGrid[i][j] = state; // Survival
        }
      }
    }
    grid = nextGrid;
  }

  function draw() {
    // Clear with transparent rect to avoid trails, or allow slight trails?
    // Standard Game of Life clears the screen.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isBW = document.documentElement.getAttribute('data-theme') === 'bw';
    ctx.fillStyle = isBW ? COLOR_BW : COLOR_DEFAULT;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (grid[i][j] === 1) {
          ctx.fillRect(i * cellSize, j * cellSize, cellSize - 1, cellSize - 1);
        }
      }
    }
  }

  // Animation Loop
  let lastTime = 0;
  const fps = 15; // Slow down simulation speed for better visual
  const interval = 1000 / fps;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;

    if (deltaTime > interval) {
      lastTime = timeStamp - (deltaTime % interval);
      updateGrid();
      draw();
    }

    requestAnimationFrame(animate);
  }

  // Event Listeners
  window.addEventListener('resize', resize);

  // Start
  resize();
  requestAnimationFrame(animate);
}

/* ---------- NAVBAR ---------- */
function initNavbar() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- MOBILE MENU ---------- */
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
  });

  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
    });
  });
}

/* ---------- SCROLL ANIMATIONS ---------- */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
  );

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  const staggerSets = [
    '.about-stats .stat-card',
    '.skills-grid .skill-card',
    '.services-grid .service-card',
    '.blogs-grid .blog-card',
    '.contact-cards .contact-card',
  ];

  staggerSets.forEach(selector => {
    document.querySelectorAll(selector).forEach((card, i) => {
      card.dataset.delay = i * 100;
      observer.observe(card);
    });
  });
}

/* ---------- COUNTER ANIMATION ---------- */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => observer.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
}

/* ---------- SKILL BARS ---------- */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const width = fill.style.width;
          fill.style.width = '0%';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              fill.style.width = width;
            });
          });
          observer.unobserve(fill);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach(b => observer.observe(b));
}

/* ---------- SCROLL TO TOP ---------- */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
}

/* ---------- SMOOTH SCROLL ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#!') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navH = document.getElementById('mainNav')?.offsetHeight || 0;
        const y = target.getBoundingClientRect().top + window.pageYOffset - navH;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
}

/* ---------- THEME TOGGLE ---------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;
  const icon = toggleBtn.querySelector('i');

  // Check persisted theme
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'bw') {
    document.documentElement.setAttribute('data-theme', 'bw');
    if (icon) icon.className = 'fas fa-sun'; // Show sun to toggle back to light/green
  } else {
    if (icon) icon.className = 'fas fa-moon'; // Show moon to toggle to dark/bw (conceptually)
    // Actually, the original theme is Green/Dark. 
    // Maybe 'bw' is "Monochrome Mode" and default is "Color Mode".
    // Icon: Color Mode -> Palette icon? Or Moon for dark?
    // Let's use:
    // Default (Green): Moon icon (current state)
    // BW: Sun icon (or something else)
  }

  toggleBtn.addEventListener('click', () => {
    const isBW = document.documentElement.getAttribute('data-theme') === 'bw';

    if (isBW) {
      // Switch back to Default
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'default');
      if (icon) icon.className = 'fas fa-moon';
    } else {
      // Switch to BW
      document.documentElement.setAttribute('data-theme', 'bw');
      localStorage.setItem('theme', 'bw');
      if (icon) icon.className = 'fas fa-sun';
    }
  });
}