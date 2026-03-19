// =============================================
// AGV SELENT — ANIMATION ENGINE (Native Scroll)
// =============================================

gsap.registerPlugin(ScrollTrigger);

// =============================================
// 1. PARTICLE CANVAS (Hero Background)
// =============================================
const canvas = document.createElement('canvas');
canvas.id = 'particleCanvas';
canvas.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;`;
const heroSection = document.querySelector('.hero, .emp-hero');
if (heroSection) {
  heroSection.appendChild(canvas);
}

const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', () => {
  resizeCanvas();
  ScrollTrigger.refresh();
});

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = -Math.random() * 0.5 - 0.1;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.life = 1;
    this.decay = Math.random() * 0.003 + 0.001;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= this.decay;
    if (this.life <= 0 || this.y < -5) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201,164,97,${this.opacity * this.life})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// =============================================
// 2. CUSTOM MAGNETIC CURSOR (Desktop only)
// =============================================
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

if (window.innerWidth > 1024 && cursor) {
  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    gsap.to(cursor, { x: mx, y: my, duration: 0.05, ease: 'none' });
  });

  gsap.ticker.add(() => {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    gsap.set(cursorFollower, { x: fx, y: fy });
  });

  document.querySelectorAll('.btn, .project-link, .link-arrow, .nav-link').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: relX * 0.3, y: relY * 0.3, duration: 0.4, ease: 'power2.out' });
      gsap.to(cursor, { scale: 2.5, duration: 0.3 });
      gsap.to(cursorFollower, { scale: 0.5, borderColor: 'rgba(201,164,97,0.8)', duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.3)' });
      gsap.to(cursor, { scale: 1, duration: 0.3 });
      gsap.to(cursorFollower, { scale: 1, borderColor: 'rgba(201,164,97,0.4)', duration: 0.3 });
    });
  });
}

// =============================================
// 3. MOBILE MENU
// =============================================
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');
mobileMenuBtn.addEventListener('click', () => {
  mobileMenuBtn.classList.toggle('active');
  nav.classList.toggle('active');
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenuBtn.classList.remove('active');
    nav.classList.remove('active');
  });
});

// =============================================
// 4. HEADER SCROLL EFFECT
// =============================================
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
}, { passive: true });

document.getElementById('year').textContent = new Date().getFullYear();

// =============================================
// 5. CINEMATIC HERO INTRO
// =============================================
const isMobile = window.innerWidth <= 768;
const tl = gsap.timeline({ delay: 0.2 });

tl.fromTo('.hero-bar-top', { scaleY: 1 }, { scaleY: 0, duration: 1.2, ease: 'expo.inOut' }, 0)
  .fromTo('.hero-bar-bottom', { scaleY: 1 }, { scaleY: 0, duration: 1.2, ease: 'expo.inOut' }, 0)
  .fromTo('.hero-bg',
    { scale: 1.3, filter: 'brightness(0) blur(20px)' },
    { scale: isMobile ? 1 : 1.05, filter: 'brightness(1) blur(0px)', duration: 2, ease: 'power4.out' }, 0.3)
  .fromTo('.header',
    { y: -80, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, 0.6)
  .fromTo('.hero-subtitle',
    { y: 40, opacity: 0, skewY: 5 },
    { y: 0, opacity: 1, skewY: 0, duration: 1, ease: 'power4.out' }, 0.9)
  .fromTo('.title-line',
    { y: '110%', opacity: 0 },
    { y: '0%', opacity: 1, duration: 1.1, stagger: 0.12, ease: 'power4.out' }, 1.1)
  .fromTo('.hero-desc',
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 1.7)
  .fromTo('.hero-actions .btn',
    { y: 30, opacity: 0, scale: 0.9 },
    { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.15, ease: 'back.out(1.5)' }, 1.9)
  .fromTo('.scroll-indicator',
    { opacity: 0, x: -20 },
    { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }, 2.2);

// =============================================
// 6. HERO PARALLAX ON SCROLL (desktop only)
// =============================================
if (!isMobile) {
  gsap.to('.hero-bg', {
    yPercent: 40,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5
    }
  });

  gsap.to('.hero-content', {
    yPercent: 50,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '60% top',
      scrub: 1
    }
  });
}

// =============================================
// 7. STATS COUNTER + CARDS
// =============================================
gsap.set('.stat-card', { opacity: 0, y: 80, rotateX: 30 });

ScrollTrigger.create({
  trigger: '.stats',
  start: 'top 90%',
  once: true,
  onEnter: () => {
    // Animate stat cards in
    gsap.to('.stat-card', {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power4.out',
      clearProps: 'transform'
    });

    // Animate counters
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      gsap.to({ val: 0 }, {
        val: target,
        duration: 2.5,
        ease: 'power3.out',
        onUpdate: function () {
          counter.textContent = Math.ceil(this.targets()[0].val);
        }
      });
    });
  }
});

// =============================================
// 8. 3D TILT CARDS
// =============================================
function init3DTilt(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rY = ((e.clientX - cx) / (rect.width / 2)) * 12;
      const rX = -((e.clientY - cy) / (rect.height / 2)) * 10;
      gsap.to(card, {
        rotateX: rX, rotateY: rY,
        transformPerspective: 800,
        transformOrigin: 'center center',
        duration: 0.4, ease: 'power2.out'
      });
      const sheen = card.querySelector('.card-sheen');
      if (sheen) {
        const px = ((e.clientX - rect.left) / rect.width) * 100;
        const py = ((e.clientY - rect.top) / rect.height) * 100;
        sheen.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.12) 0%, transparent 60%)`;
      }
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 1.2, ease: 'elastic.out(1, 0.4)' });
      const sheen = card.querySelector('.card-sheen');
      if (sheen) sheen.style.background = 'none';
    });
  });
}
init3DTilt('.project-card');
init3DTilt('.stat-card');

// =============================================
// 9. SOBRE SECTION — CINEMATIC REVEAL
// =============================================
gsap.fromTo('.sobre-image-wrapper', {
  clipPath: 'inset(100% 0% 0% 0%)', y: 80
}, {
  clipPath: 'inset(0% 0% 0% 0%)', y: 0,
  duration: 1.4, ease: 'expo.out',
  scrollTrigger: { trigger: '.sobre', start: 'top 70%' }
});

gsap.to('.sobre-img', {
  yPercent: -15, ease: 'none',
  scrollTrigger: {
    trigger: '.sobre',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 2
  }
});

gsap.from('.experience-badge', {
  scale: 0, rotation: -90, opacity: 0,
  duration: 1.2, delay: 0.5, ease: 'elastic.out(1, 0.4)',
  scrollTrigger: { trigger: '.sobre', start: 'top 65%' }
});

gsap.from('.sobre-content > *', {
  x: 60, opacity: 0, duration: 1, stagger: 0.15, ease: 'power4.out',
  scrollTrigger: { trigger: '.sobre', start: 'top 68%' }
});

// =============================================
// 10. EMPREENDIMENTOS — STAGGER 3D REVEAL
// =============================================
gsap.from('.section-header.center > *', {
  y: 60, opacity: 0, duration: 1, ease: 'power3.out',
  scrollTrigger: { trigger: '.empreendimentos', start: 'top 80%' }
});

gsap.from('.project-card', {
  y: 120, opacity: 0, rotateY: 15, rotateX: 10,
  transformPerspective: 1000,
  duration: 1.2, stagger: 0.18, ease: 'power4.out',
  scrollTrigger: { trigger: '.projects-grid', start: 'top 78%' }
});

// =============================================
// 11. OPORTUNIDADES
// =============================================
gsap.to('.oportunidades-bg', {
  yPercent: 25, ease: 'none',
  scrollTrigger: {
    trigger: '.oportunidades',
    start: 'top bottom', end: 'bottom top', scrub: 2
  }
});

gsap.from('.oportunidades-container > *', {
  y: 60, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out',
  scrollTrigger: { trigger: '.oportunidades', start: 'top 70%' }
});

// =============================================
// 12. CONTATO
// =============================================
gsap.from('.contact-info > *', {
  x: -70, opacity: 0, duration: 1, stagger: 0.12, ease: 'power4.out',
  scrollTrigger: { trigger: '.contato', start: 'top 72%' }
});

gsap.fromTo('.contact-form-container', {
  x: 70, opacity: 0, rotateY: 20, transformPerspective: 1200
}, {
  x: 0, opacity: 1, rotateY: 0, duration: 1.4, ease: 'expo.out',
  scrollTrigger: { trigger: '.contato', start: 'top 72%' }
});

// =============================================
// 13. HORIZONTAL PROGRESS BAR
// =============================================
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed; top: 0; left: 0;
  height: 2px; width: 0%;
  background: linear-gradient(to right, #c9a461, #e0b872, #c9a461);
  z-index: 9999; pointer-events: none;
  box-shadow: 0 0 10px rgba(201,164,97,0.6);
  transition: width 0.1s linear;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (window.scrollY / total * 100) + '%';
}, { passive: true });

// =============================================
// 14. LOGO GLITCH ON HOVER
// =============================================
const logo = document.querySelector('.logo');
if (logo) {
  logo.addEventListener('mouseenter', () => {
    gsap.timeline()
      .to(logo, { skewX: 5, x: 3, duration: 0.05 })
      .to(logo, { skewX: -4, x: -2, duration: 0.05 })
      .to(logo, { skewX: 2, x: 1, duration: 0.05 })
      .to(logo, { skewX: 0, x: 0, duration: 0.1 });
  });
}

// =============================================
// 15. FOOTER REVEAL
// =============================================
gsap.from('.footer', {
  opacity: 0, y: 30, duration: 0.8, ease: 'power2.out',
  scrollTrigger: { trigger: '.footer', start: 'top 95%' }
});

// =============================================
// 16. ACTIVE NAV LINKS ON SCROLL
// =============================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${entry.target.id}`)
          link.classList.add('active');
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => observer.observe(s));

// =============================================
// 17. SMOOTH SCROLL FOR ANCHOR LINKS
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }
  });
});

// =============================================
// 18. EMPREENDIMENTO DYNAMICS
// =============================================
if (document.body.classList.contains('empreendimento-page')) {
  const projectsData = {
    esmeralda: {
      title: "Residencial Esmeralda",
      status: "Lançamento",
      location: "Meia Praia, Itapema - SC",
      delivery: "Dezembro 2026",
      desc: "<p>Inspirado na preciosidade da pedra que lhe dá nome, o Residencial Esmeralda oferece uma experiência única de moradia. Arquitetura neoclássica aliada a um design funcional e ambientes integrados.</p><p>Viva momentos inesquecíveis com sua família em uma área de lazer completa e decorada com requinte, entregando conforto e segurança no melhor bairro de Itapema.</p>",
      heroImg: "https://dwvimagesv1.b-cdn.net/1632225100495_b7600f58-27c2-41fe-aa3c-f7d819ebfa43.jpeg?width=1020&quality=100",
      highlights: [
        { value: "3", label: "Suítes" },
        { value: "2", label: "Vagas" },
        { value: "115m²", label: "Privativos" },
        { value: "2026", label: "Entrega" }
      ],
      features: [
        { icon: "🛏️", text: "3 Suítes Plenas" },
        { icon: "🚗", text: "2 Vagas de Garagem" },
        { icon: "🏊", text: "Lazer Completo Decorado" },
        { icon: "🍖", text: "Espaço Gourmet com Churrasqueira" },
        { icon: "🏋️", text: "Academia Climatizada" },
        { icon: "🎥", text: "Cinema e Salão de Jogos" }
      ],
      gallery: [
        "https://dwvimagesv1.b-cdn.net/1632225100495_b7600f58-27c2-41fe-aa3c-f7d819ebfa43.jpeg?quality=100",
        "https://dwvimagesv1.b-cdn.net/1632225319340_44bc5d84-92e4-4974-8f0d-149702b1ee6a.jpeg?quality=100",
        "https://dwvimagesv1.b-cdn.net/1691182312109_5637443e-f229-49c1-ab62-14a52d695f22.jpg?quality=100",
        "https://dwvimagesv1.b-cdn.net/1678449994245_13720d1c-3ac0-4dc0-a63b-55a95d06a4ac.png"
      ]
    },
    diamond: {
      title: "Residencial Diamond",
      status: "Pronto para morar",
      location: "Centro, Itapema - SC",
      delivery: "Pronto",
      desc: "<p>O Residencial Diamond reflete o que há de mais brilhante na construção civil. Uma jóia esculpida no coração de Itapema, com acabamentos impecáveis e localização privilegiada.</p><p>Ideal para quem não abre mão do conforto, conveniência e de um estilo de vida exclusivo, a apenas poucos passos do mar e cercado pela melhor infraestrutura.</p>",
      heroImg: "https://dwvimagesv1.b-cdn.net/1632225319340_44bc5d84-92e4-4974-8f0d-149702b1ee6a.jpeg?width=1020&quality=100",
      highlights: [
        { value: "4", label: "Suítes" },
        { value: "3", label: "Vagas" },
        { value: "145m²", label: "Privativos" },
        { value: "100%", label: "Concluído" }
      ],
      features: [
        { icon: "🛏️", text: "4 Suítes, sendo 1 Master" },
        { icon: "🚗", text: "3 Vagas Lado a Lado" },
        { icon: "🏋️", text: "Academia Premium e Pilates" },
        { icon: "🌊", text: "Vista Panorâmica para o Mar" },
        { icon: "🍷", text: "Adega e Espaço Whisky" },
        { icon: "🔒", text: "Portaria 24h e Biometria" }
      ],
      gallery: [
        "https://dwvimagesv1.b-cdn.net/1632225319340_44bc5d84-92e4-4974-8f0d-149702b1ee6a.jpeg?quality=100",
        "https://dwvimagesv1.b-cdn.net/1632225100495_b7600f58-27c2-41fe-aa3c-f7d819ebfa43.jpeg?quality=100",
        "https://dwvimagesv1.b-cdn.net/1691182312109_5637443e-f229-49c1-ab62-14a52d695f22.jpg?quality=100",
        "https://dwvimagesv1.b-cdn.net/1678449994245_13720d1c-3ac0-4dc0-a63b-55a95d06a4ac.png"
      ]
    },
    oceanview: {
      title: "Ocean View Residence",
      status: "Em obras",
      location: "Meia Praia, Itapema - SC",
      delivery: "Fevereiro 2027",
      desc: "<p>Desperte todos os dias com o som das ondas e uma vista espetacular. O Ocean View Residence é o encontro perfeito entre a natureza exuberante de Itapema e o alto padrão AGV Selent.</p><p>Um projeto pensado para proporcionar o máximo de bem-estar e contato com o mar, oferecendo sacadas generosas e plantas de altíssima adaptabilidade.</p>",
      heroImg: "https://dwvimagesv1.b-cdn.net/1691182312109_5637443e-f229-49c1-ab62-14a52d695f22.jpg?width=1020&quality=100",
      highlights: [
        { value: "3/4", label: "Suítes" },
        { value: "3", label: "Vagas" },
        { value: "160m²", label: "Privativos" },
        { value: "2027", label: "Entrega" }
      ],
      features: [
        { icon: "🛏️", text: "Opções de 3 ou 4 Suítes" },
        { icon: "🚗", text: "Até 3 Vagas de Garagem" },
        { icon: "🌅", text: "Frente Mar e Pe Direito Alto" },
        { icon: "🍷", text: "Adega e Lounge Integrado" },
        { icon: "🧖", text: "Spa Relaxante e Sauna" },
        { icon: "⚽", text: "Quadra Poliesportiva" }
      ],
      gallery: [
        "https://dwvimagesv1.b-cdn.net/1691182312109_5637443e-f229-49c1-ab62-14a52d695f22.jpg?quality=100",
        "https://dwvimagesv1.b-cdn.net/1632225100495_b7600f58-27c2-41fe-aa3c-f7d819ebfa43.jpeg?quality=100",
        "https://dwvimagesv1.b-cdn.net/1632225319340_44bc5d84-92e4-4974-8f0d-149702b1ee6a.jpeg?quality=100",
        "https://dwvimagesv1.b-cdn.net/1678449994245_13720d1c-3ac0-4dc0-a63b-55a95d06a4ac.png"
      ]
    },
    nizuc: {
      title: "Nizuc Residence",
      status: "OBRA CONCLUIDA",
      location: "Itapema - SC",
      delivery: "Pronto",
      desc: "<p>Inspirado na exclusividade dos mais luxuosos resorts de Cancun, o Nizuc Residence traz para Itapema um conceito de moradia que transcende o ordinário.</p><p>Arquitetura contemporânea, áreas de lazer que parecem verdadeiros oásis e um cuidado ímpar com a qualidade construtiva, oferecendo um refúgio de paz em um dos metros quadrados mais desejados do Brasil.</p>",
      heroImg: "https://dwvimagesv1.b-cdn.net/1678449994245_13720d1c-3ac0-4dc0-a63b-55a95d06a4ac.png",
      highlights: [
        { value: "4", label: "Suítes" },
        { value: "3", label: "Vagas" },
        { value: "190m²", label: "Privativos" },
        { value: "Oásis", label: "Design" }
      ],
      features: [
        { icon: "🛏️", text: "4 Suítes Master Premium" },
        { icon: "🚗", text: "3 Vagas Livres" },
        { icon: "💎", text: "Acabamento Alto Padrão" },
        { icon: "🏊‍♂️", text: "Piscina com Borda Infinita" },
        { icon: "🌴", text: "Praça de Fogo e Solarium" },
        { icon: "🍾", text: "Salão de Festas Climatizado" }
      ],
      gallery: [
        "https://dwvimagesv1.b-cdn.net/1678449994245_13720d1c-3ac0-4dc0-a63b-55a95d06a4ac.png",
        "https://dwvimagesv1.b-cdn.net/1632225100495_b7600f58-27c2-41fe-aa3c-f7d819ebfa43.jpeg?quality=100",
        "https://dwvimagesv1.b-cdn.net/1632225319340_44bc5d84-92e4-4974-8f0d-149702b1ee6a.jpeg?quality=100",
        "https://dwvimagesv1.b-cdn.net/1691182312109_5637443e-f229-49c1-ab62-14a52d695f22.jpg?quality=100"
      ]
    }
  };

  const urlParams = new URLSearchParams(window.location.search);
  let projectId = urlParams.get('id');
  if (!projectId || !projectsData[projectId]) {
    projectId = 'nizuc'; // fallback
  }

  const data = projectsData[projectId];

  // Populate Meta & Breadcrumb
  document.getElementById('page-title').textContent = `${data.title} - AGV Selent`;
  document.getElementById('emp-breadcrumb-name').textContent = data.title;
  
  // Populate Hero
  document.getElementById('emp-title').textContent = data.title;
  document.getElementById('emp-status').textContent = data.status;
  document.getElementById('emp-location').textContent = data.location;
  if(data.delivery) {
    document.getElementById('emp-delivery-block').style.display = 'inline-flex';
    document.getElementById('emp-delivery-text').textContent = "Entrega: " + data.delivery;
  }
  document.getElementById('emp-hero-img').src = data.heroImg;
  
  // Populate Details
  document.getElementById('emp-desc').innerHTML = data.desc;

  // Populate Highlights
  const highlightsContainer = document.getElementById('emp-highlights');
  if(highlightsContainer) {
    highlightsContainer.innerHTML = '';
    data.highlights.forEach(h => {
      highlightsContainer.innerHTML += `
        <div class="highlight-stat">
          <span class="highlight-stat-value">${h.value}</span>
          <span class="highlight-stat-label">${h.label}</span>
        </div>
      `;
    });
  }

  // Populate Features
  const featuresContainer = document.getElementById('emp-features');
  if(featuresContainer) {
    featuresContainer.innerHTML = '';
    data.features.forEach(f => {
      featuresContainer.innerHTML += `
        <div class="feature-item">
          <span class="feature-icon">${f.icon}</span>
          <span class="feature-text">${f.text}</span>
        </div>
      `;
    });
  }

  // Populate Gallery
  const galleryContainer = document.getElementById('emp-gallery-track');
  let currentGalleryUrls = []; // store for lightbox
  if(galleryContainer) {
    galleryContainer.innerHTML = '';
    data.gallery.forEach((img, idx) => {
      currentGalleryUrls.push(img);
      galleryContainer.innerHTML += `
        <div class="gallery-item" data-index="${idx}">
          <img src="${img}" alt="Galeria">
        </div>
      `;
    });
  }

  // --- PROGRESS BAR ---
  const pb = document.getElementById('empProgressBar');
  if(pb) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const p = (scrollY / docHeight) * 100;
      pb.style.width = p + '%';
    }, { passive: true });
  }

  // --- LIGHTBOX LOGIC ---
  const lightbox = document.getElementById('empLightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  let currentImgIndex = 0;

  if (lightbox) {
    function openLightbox(idx) {
      currentImgIndex = idx;
      lbImg.src = currentGalleryUrls[idx];
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => { lbImg.src = ''; }, 400); // clear after animation
    }

    function lbGoNext() {
      currentImgIndex = (currentImgIndex + 1) % currentGalleryUrls.length;
      lbImg.src = currentGalleryUrls[currentImgIndex];
    }

    function lbGoPrev() {
      currentImgIndex = (currentImgIndex - 1 + currentGalleryUrls.length) % currentGalleryUrls.length;
      lbImg.src = currentGalleryUrls[currentImgIndex];
    }

    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        openLightbox(parseInt(item.dataset.index));
      });
    });

    lbClose.addEventListener('click', closeLightbox);
    lbNext.addEventListener('click', lbGoNext);
    lbPrev.addEventListener('click', lbGoPrev);
    lightbox.addEventListener('click', (e) => {
      if(e.target === lightbox) closeLightbox();
    });
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if(!lightbox.classList.contains('active')) return;
      if(e.key === 'Escape') closeLightbox();
      if(e.key === 'ArrowRight') lbGoNext();
      if(e.key === 'ArrowLeft') lbGoPrev();
    });
  }

  // --- DRAG TO SCROLL GALLERY ---
  const slider = document.querySelector('.gallery-track-container');
  if(slider) {
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.classList.add('active');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => { isDown = false; slider.classList.remove('active'); });
    slider.addEventListener('mouseup', () => { isDown = false; slider.classList.remove('active'); });
    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; // scroll-fast
      slider.scrollLeft = scrollLeft - walk;
    });
  }

  // --- GSAP ANIMATIONS ---
  const heroTl = gsap.timeline({ delay: 0.2 });
  heroTl.to('.emp-hero-content', { y: 0, opacity: 1, duration: 1.5, ease: 'power4.out' })
    .from('.emp-title', { opacity: 0, y: 30, scale: 0.95, filter: 'blur(8px)', duration: 1.2, ease: 'power3.out' }, "-=1.2")
    .from('.emp-badge', { scale: 0.9, opacity: 0, duration: 0.6, ease: 'back.out(1.5)' }, "-=1")
    .from('.emp-delivery', { opacity: 0, x: -10, duration: 0.6 }, "-=0.8")
    .from('.emp-hero-actions > *', { opacity: 0, y: 20, duration: 0.8, stagger: 0.1, ease: 'power2.out' }, "-=0.6")
    .from('.scroll-indicator', { opacity: 0, y: 20, duration: 1 }, "-=0.5");

  // Cinematic Hero Background reveal
  gsap.from('.emp-hero-bg img', { scale: 1.15, filter: 'blur(10px)', duration: 2, ease: 'power3.out' });

  gsap.to('.emp-hero-bg img', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: '.emp-hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });

  gsap.from('.highlight-stat', {
    y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
    scrollTrigger: { trigger: '.emp-highlights-bar', start: 'top 85%' }
  });

  gsap.from('.emp-info-left > *', {
    y: 50, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out',
    scrollTrigger: { trigger: '.emp-details', start: 'top 75%' }
  });

  gsap.from('.feature-item', {
    y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
    scrollTrigger: { trigger: '.emp-info-right', start: 'top 80%' }
  });

  gsap.from('.emp-gallery-header > *', {
    y: 30, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out',
    scrollTrigger: { trigger: '.emp-gallery', start: 'top 85%' }
  });

  gsap.from('.gallery-item', {
    x: 100, opacity: 0, duration: 1, stagger: 0.15, ease: 'power4.out',
    scrollTrigger: { trigger: '.emp-gallery', start: 'top 70%' }
  });

  gsap.from('.emp-location-header > *', {
    y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
    scrollTrigger: { trigger: '.emp-location-section', start: 'top 85%' }
  });

  gsap.from('.emp-contact-text > *', {
    x: -50, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out',
    scrollTrigger: { trigger: '.emp-contact', start: 'top 80%' }
  });

  gsap.from('.emp-cta-card', {
    scale: 0.9, opacity: 0, duration: 1, ease: 'back.out(1.2)',
    scrollTrigger: { trigger: '.emp-contact', start: 'top 80%' }
  });

  // Floating CTA visibility
  const cta = document.getElementById('floatingCta');
  if (cta) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > window.innerHeight * 0.7) {
        cta.classList.add('visible');
      } else {
        cta.classList.remove('visible');
      }
    }, { passive: true });
  }

  // Initialize heavy 3D Tilt system on new elements
  if (typeof init3DTilt === 'function') {
    // Adding small delay to ensure DOM renderer has attached everything
    setTimeout(() => {
      init3DTilt('.feature-item');
      init3DTilt('.gallery-item');
      init3DTilt('.highlight-stat');
      init3DTilt('.emp-cta-card');
    }, 100);
  }
}

