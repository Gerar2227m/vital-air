const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const body = document.body;
body.classList.add("js");

const FLOW_COMPONENTS = [
  ["📱", "Aplicación móvil", "Envía las instrucciones de funcionamiento al prototipo."],
  ["📡", "Bluetooth HC-05", "Recibe las órdenes de forma inalámbrica y las pasa al control."],
  ["🧠", "Arduino UNO", "Procesa las instrucciones y genera las señales del sistema."],
  ["⚡", "Driver L298N", "Controla dirección y velocidad del motor."],
  ["⚙️", "Motor DC (Trico, 12 V)", "Convierte energía eléctrica en movimiento rotatorio."],
  ["🔩", "Mecanismo", "Engranajes y bielas convierten la rotación en vaivén que mueve la palanca."],
  ["🫁", "Ambú", "La palanca presiona la bolsa y demuestra la compresión automatizada."]
];

const COMPONENTS = {
  "Electrónicos": [
    ["Arduino UNO", "Cerebro del sistema: control y procesamiento."],
    ["Bluetooth HC-05", "Comunicación inalámbrica con la app."],
    ["Módulo L298N", "Controla dirección y velocidad del motor DC."],
    ["Motor Trico 12 V", "Genera el movimiento mecánico."],
    ["Fuente de 12 V", "Convierte la corriente alterna en continua para el sistema."],
    ["Buzzer", "Señales sonoras ante ciertas condiciones."],
    ["LED", "Indicador visual de movimiento y pausa."],
    ["Cooler", "Evita el sobrecalentamiento de la electrónica."]
  ],
  "Médicos": [
    ["Ambú", "Bolsa autoinflable que envía aire u oxígeno a los pulmones."],
    ["Mascarilla", "Se ajusta a nariz y boca para ventilar y oxigenar."],
    ["Manguera", "Conduce el aire desde la bolsa hasta el paciente."]
  ],
  "Transmisión": [
    ["Engranajes", "Ruedas dentadas que transmiten movimiento y fuerza."],
    ["Bielas", "Barras que transforman rotación en vaivén."]
  ]
};

function setupFlow() {
  const container = $("#fl");
  const detail = $("#fd");
  if (!container || !detail) return;

  FLOW_COMPONENTS.forEach((component, index) => {
    const [icon, title, description] = component;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${icon} 0${index + 1} ${title.split(" ")[0]}`;
    button.setAttribute("aria-controls", "fd");

    button.addEventListener("click", () => {
      $$("button", container).forEach((item) => {
        item.classList.remove("on");
        item.setAttribute("aria-selected", "false");
      });
      button.classList.add("on");
      button.setAttribute("aria-selected", "true");

      detail.innerHTML = `<h3>${icon} ${title}</h3><p>${description}</p>`;
    });

    container.append(button);
    if (index === 0) button.click();
  });
}

function setupRespirationDemo() {
  const lung = $("#lg");
  const status = $("#st");
  if (!lung || !status) return;

  $$(`[data-r]`).forEach((button) => {
    button.addEventListener("click", () => {
      const rate = Number(button.dataset.r);
      lung.style.animation = rate
        ? `b ${60 / rate}s var(--ease-in-out) infinite`
        : "none";
      status.textContent = `Simulación visual · ${rate ? `${rate} respiraciones por minuto` : "detenido"}`;
    });
  });
}

function setupComponents() {
  const tabs = $("#tb");
  const grid = $("#cg");
  if (!tabs || !grid) return;

  Object.entries(COMPONENTS).forEach(([category, items], index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = category;
    button.setAttribute("role", "tab");

    button.addEventListener("click", () => {
      $$("button", tabs).forEach((item) => {
        item.classList.remove("on");
        item.setAttribute("aria-selected", "false");
      });
      button.classList.add("on");
      button.setAttribute("aria-selected", "true");

      grid.innerHTML = items
        .map(([title, description]) => `<div class="c"><h3>${title}</h3><p>${description}</p></div>`)
        .join("");

      $$(".c", grid).forEach((card, cardIndex) => {
        card.dataset.reveal = "";
        card.classList.add("is-visible");
        card.style.transitionDelay = `${Math.min(cardIndex * 25, 150)}ms`;
      });
    });

    tabs.append(button);
    if (index === 0) button.click();
  });
}

function setupTimeline() {
  const dates = ["8-12 jun", "15-19", "22-26", "29-3 jul", "6-10", "13-17", "20-22", "23-26"];
  const tasks = [
    ["Investigación y diseño", 1, 2],
    ["Adquisición de componentes", 2, 3],
    ["Prueba de componentes", 3, 3],
    ["Armado de circuito", 3, 5],
    ["Programación", 3, 6],
    ["Ensamble", 4, 6],
    ["Pruebas y ajustes", 6, 7],
    ["Preparación del montaje", 6, 7],
    ["Exposición", 8, 8]
  ];

  const grid = $("#gt");
  if (!grid) return;

  let html = `<span></span>${dates.map((date) => `<small>${date}</small>`).join("")}`;

  tasks.forEach(([task, start, end]) => {
    html += `<b>${task}</b>`;
    for (let week = 1; week <= 8; week += 1) {
      const active = week >= start && week <= end;
      html += `<i class="${active ? "x" : ""}" style="opacity:${active ? 1 : 0.18}" aria-hidden="true"></i>`;
    }
  });

  grid.innerHTML = html;
}

function setupScrollReveal() {
  const revealItems = $$(`section > *, .g .c, .status-grid .c, .gal > *, #fd, pre, .gantt`);
  revealItems.forEach((element) => {
    if (!element.closest(".hero")) element.dataset.reveal = "";
  });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px" }
  );

  revealItems.forEach((element) => observer.observe(element));
}

function setupNavigation() {
  const nav = $("nav");
  const links = $$('nav a[href^="#"]');
  const sections = links
    .map((link) => $(link.getAttribute("href")))
    .filter(Boolean);

  if (!nav || !links.length) return;

  links.forEach((link) => {
    link.addEventListener("click", () => {
      links.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
    });
  });

  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    nav.style.setProperty("--scroll-progress", `${progress}%`);
  };

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const active = links.find((link) => link.getAttribute("href") === `#${entry.target.id}`);
          if (!active) return;
          links.forEach((link) => link.classList.remove("active"));
          active.classList.add("active");
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }
}

function setupTheme() {
  const nav = $("nav");
  if (!nav) return;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "theme-toggle";
  button.setAttribute("aria-label", "Cambiar tema");
  button.setAttribute("title", "Cambiar tema");
  nav.append(button);

  const saved = localStorage.getItem("vital-air-theme");
  if (saved === "light" || saved === "dark") document.documentElement.dataset.theme = saved;

  const updateIcon = () => {
    const dark = document.documentElement.dataset.theme === "dark" ||
      (!document.documentElement.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    button.textContent = dark ? "☀️" : "🌙";
    button.setAttribute("aria-label", dark ? "Usar tema claro" : "Usar tema oscuro");
  };

  button.addEventListener("click", () => {
    const isDark = document.documentElement.dataset.theme === "dark" ||
      (!document.documentElement.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    const next = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("vital-air-theme", next);
    updateIcon();
  });

  updateIcon();
}

function setupBackToTop() {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "back-top";
  button.textContent = "↑";
  button.setAttribute("aria-label", "Volver arriba");
  document.body.append(button);

  const update = () => button.classList.toggle("visible", window.scrollY > 650);
  window.addEventListener("scroll", update, { passive: true });
  update();

  button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function setupActiveCardFeedback() {
  document.addEventListener("click", (event) => {
    const target = event.target.closest(".c");
    if (!target) return;
    target.animate(
      [
        { transform: "translateY(0)" },
        { transform: "translateY(-2px)" },
        { transform: "translateY(0)" }
      ],
      { duration: 180, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }
    );
  });
}

setupFlow();
setupRespirationDemo();
setupComponents();
setupTimeline();
setupScrollReveal();
setupNavigation();
setupTheme();
setupBackToTop();
setupActiveCardFeedback();
