// =======================
// ICONOS PARA NOTIFICACIONES
// =======================
const notifIcons = {
  water: '💧',
  vitamins: '🌱',
  fertilizer: '🧪',
  success: '✅',
  warning: '⚠️',
  error: '❌',
  info: '🪴'
};

// =======================
// js.js - Liftogarden
// =======================

// -----------------------
// Helpers / short aliases
// -----------------------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// =======================
// ELEMENTS / GLOBALS
// =======================
/* Header / Navegación */
const notifBtn = document.getElementById('notif-btn');
const notifBtnMobile = document.getElementById('notif-btn-mobile');
const notifPanel = document.getElementById('notif-messages'); // panel que se muestra/oculta al tocar el botón
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const mobileNav = document.querySelector('.mobile-nav');
const navTutorial = document.getElementById('nav-tutorial');
const navTutorialMobile = document.getElementById('nav-tutorial-mobile');
const heroGetStartedBtn = document.getElementById('hero-get-started-btn');
const AboutSection = document.getElementById("about-section");


/* Nav links */
const navHome = document.getElementById('nav-home');
const navDashboard = document.getElementById('nav-dashboard');
const navHomeMobile = document.getElementById('nav-home-mobile');
const navDashboardMobile = document.getElementById('nav-dashboard-mobile');
const navShop = document.getElementById('nav-shop');
const navShopMobile = document.getElementById('nav-shop-mobile');
const navAbout = document.getElementById('nav-about');
const navAboutMobile = document.getElementById('nav-about-mobile');
const aboutSection = document.getElementById('about-section');


/* Perfil */
const profileBtn = document.getElementById('profile-btn');
const profileDropdown = document.getElementById('profile-dropdown');
const profileBtnMobile = document.querySelector('.profile-button-mobile');
const profileDropdownMobile = document.getElementById('profile-dropdown-mobile');
const profilePhoto = document.querySelector('.profile-photo');
const profilePhotoMobile = profileBtnMobile ? profileBtnMobile.querySelector('.profile-photo') : null;
const profileText = document.getElementById('profile-text');
const profileTextMobile = document.getElementById('profile-text-mobile');

/* Secciones */
const landingPageSection = document.getElementById('landing-page');
const dashboardSection = document.getElementById('dashboard');
const authSection = document.getElementById('auth-section');
const tutorialSection = document.getElementById('tutorial-section');
const shopSection = document.getElementById('shop-section');

/* Auth forms */
const authTitle = document.getElementById('auth-title');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');

/* Plantas / UI */
const plantListEl = document.getElementById('plant-list');

/* Notif counters in header */
const notifCountEl = document.getElementById('notif-count');
const notifCountMobileEl = document.getElementById('notif-count-mobile');

/* Carrito / tienda */
const cartPanel = document.getElementById('cart-panel');
const cartList = document.getElementById('cart-list');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutModal = document.getElementById('checkout-modal');
const checkoutProduct = document.getElementById('checkout-product');
const confirmPurchase = document.getElementById('confirm-purchase');
const closeCheckout = document.getElementById('close-checkout');

/* Modal nueva planta */
const newPlantBtn = document.getElementById('new-plant-btn');
const newPlantModal = document.getElementById('new-plant-modal');
const modalCancelBtn = document.getElementById('modal-cancel-btn');
const newPlantForm = document.getElementById('new-plant-form');

/* Misc */
let isLoggedIn = false;
let profileDropdownOpen = false;
let profileDropdownMobileOpen = false;
let editingPlantId = null;
updateNavVisibility();
function updateNavVisibility() {
  const authLinks = $$('.nav-auth');
  if (isLoggedIn) {
    authLinks.forEach(el => el.style.display = 'inline-flex');
  } else {
    authLinks.forEach(el => el.style.display = 'none');
  }
}


// =======================
// NOTIFICATIONS - unified system
// =======================

/*
Behavior:
- notificationMessages stores notifications persistently (in-memory).
- When new alerts happen, push to notificationMessages and update header counter.
- Touching notifBtn or notifBtnMobile toggles the notifPanel visibility and renders the list.
- Each notification in panel can be removed (x) and counter updates.
- showToast(message,type) used for ephemeral confirmations (not added to list).
*/

let notificationMessages = []; // { id, message, type, timestamp }
let notifCounter = 0;

// Utility to generate unique id
function uid(prefix = '') {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2,6);
}

function updateHeaderCounter() {
  const n = notificationMessages.length;
  if (notifCountEl) notifCountEl.textContent = n > 0 ? `(${n})` : '';
  if (notifCountMobileEl) notifCountMobileEl.textContent = n > 0 ? `(${n})` : '';
}

function addPersistentNotification(message, type = 'warning') {
  // Evita duplicados exactos (opcional)
  const exists = notificationMessages.some(n => n.message === message && n.type === type);
  if (exists) return; // si querés permitir duplicados, sacá esta línea
  const obj = { id: uid('n_'), message, type, ts: Date.now() };
  notificationMessages.push(obj);
  updateHeaderCounter();
  // Si el panel está abierto, re-renderizalo para que aparezca inmediatamente:
  if (isNotifPanelOpen()) renderNotifPanel();
}

function removePersistentNotificationById(id) {
  notificationMessages = notificationMessages.filter(n => n.id !== id);
  updateHeaderCounter();
  renderNotifPanel();
}

function clearAllPersistentNotifications() {
  notificationMessages = [];
  updateHeaderCounter();
  renderNotifPanel();
}

// Build a notification item DOM for the panel
function buildNotifItemDOM(n) {
  const item = document.createElement('div');
  item.className = `notif-item ${n.type}`;
  item.dataset.notifId = n.id;

  const icon = document.createElement('span');
  icon.className = 'notif-item-icon';
  icon.textContent = notifIcons[n.type] || '🔔';

  const body = document.createElement('div');
  body.className = 'notif-item-body';

  const text = document.createElement('div');
  text.className = 'notif-item-text';
  text.textContent = n.message;

  const time = document.createElement('div');
  time.className = 'notif-item-time';
  time.textContent = new Date(n.ts).toLocaleString();

  body.appendChild(text);
  body.appendChild(time);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'notif-item-close';
  closeBtn.textContent = '×';
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    removePersistentNotificationById(n.id);
  });

  item.appendChild(icon);
  item.appendChild(body);
  item.appendChild(closeBtn);

  return item;
}


// Render the notifications inside the panel
function renderNotifPanel() {
  if (!notifPanel) return;
  notifPanel.innerHTML = ''; // limpio
  // Header of panel
  const header = document.createElement('div');
  header.className = 'notif-panel-header';
  header.innerHTML = `<strong>Notificaciones</strong> <button class="notif-clear-all" title="Limpiar todas">Limpiar</button>`;
  header.querySelector('.notif-clear-all').addEventListener('click', (e) => {
    e.stopPropagation();
    clearAllPersistentNotifications();
  });
  notifPanel.appendChild(header);

  if (notificationMessages.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'notif-panel-empty';
    empty.textContent = 'No hay notificaciones';
    notifPanel.appendChild(empty);
    return;
  }

  const list = document.createElement('div');
  list.className = 'notif-list';
  // mostrar las más recientes arriba
  [...notificationMessages].reverse().forEach(n => list.appendChild(buildNotifItemDOM(n)));
  notifPanel.appendChild(list);
}

// Panel toggle state helpers
function isNotifPanelOpen() {
  if (!notifPanel) return false;
  return notifPanel.style.display === 'block' || notifPanel.classList.contains('open');
}
function openNotifPanel() {
  if (!notifPanel) return;
  renderNotifPanel();
  notifPanel.style.display = 'block';
  notifPanel.classList.add('open');
}
function closeNotifPanel() {
  if (!notifPanel) return;
  notifPanel.style.display = 'none';
  notifPanel.classList.remove('open');
}
function toggleNotifPanel() {
  if (!notifPanel) return;
  if (isNotifPanelOpen()) closeNotifPanel();
  else openNotifPanel();
}

// Ephemeral toasts (visual feedback for actions)
function showToast(message, type = 'info', options = {}) {
  const container = document.getElementById('notifications');
  if (!container) return;

  const notif = document.createElement('div');
  notif.className = `notification ${type}`;
  notif.innerHTML = `
    <span class="icon">${notifIcons[type] || '🔔'}</span>
    <span class="message">${message}</span>
    <button class="close-btn" aria-label="Cerrar">×</button>
  `;

  notif.querySelector('.close-btn').addEventListener('click', () => notif.remove());
  container.appendChild(notif);

  setTimeout(() => notif.classList.add('show'), 80);

  const duration = options.duration ?? 3000;
  setTimeout(() => {
    notif.classList.remove('show');
    setTimeout(() => notif.remove(), 400);
  }, duration);
}


// -----------------------------
// Wiring for notif button toggles
// -----------------------------
notifBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleNotifPanel();
});
notifBtnMobile?.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleNotifPanel();
});
// close panel when clicking outside
document.addEventListener('click', (e) => {
  if (!notifPanel) return;
  const withinPanel = notifPanel.contains(e.target);
  const withinBtn = notifBtn?.contains(e.target) || notifBtnMobile?.contains(e.target);
  if (!withinPanel && !withinBtn) closeNotifPanel();
});

// Prevent clicks inside panel from bubbling (so it doesn't close)
notifPanel?.addEventListener('click', (e) => { e.stopPropagation(); });

// =======================
// NAVIGATION / PROFILE UI
// =======================
if (heroGetStartedBtn) {
  heroGetStartedBtn.addEventListener('click', () => {
    showAuthSection('register'); // Muestra directamente el formulario de registro
  });
}

if (mobileMenuButton) {
  mobileMenuButton.addEventListener('click', () => {
    const expanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
    mobileMenuButton.setAttribute('aria-expanded', !expanded);
    mobileNav?.classList.toggle('show');
  });
}

function updateProfileUI() {
  if (isLoggedIn) {
    if (profilePhoto) profilePhoto.src = "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d15c8f25-2094-48d2-b053-498da47c686c.png";
    if (profilePhotoMobile) profilePhotoMobile.src = "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c903d650-fcae-47c8-83ad-0306e86c1f4b.png";
    if (profileText) profileText.textContent = "Usuario";
    if (profileTextMobile) profileTextMobile.textContent = "Usuario";

    if (profileDropdown) {
      profileDropdown.innerHTML = `
        <button type="button" role="menuitem" id="change-account-btn">Cambiar Cuenta</button>
        <button type="button" role="menuitem" id="logout-btn">Cerrar Sesión</button>
      `;
      document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
    }
    if (profileDropdownMobile) {
      profileDropdownMobile.innerHTML = `
        <button type="button" role="menuitem" id="change-account-btn-mobile">Cambiar Cuenta</button>
        <button type="button" role="menuitem" id="logout-btn-mobile">Cerrar Sesión</button>
      `;
      document.getElementById('logout-btn-mobile')?.addEventListener('click', handleLogout);
    }
  } else {
    if (profilePhoto) profilePhoto.src = "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b7569374-357e-43e5-87fc-b71ba1174aab.png";
    if (profilePhotoMobile) profilePhotoMobile.src = "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f80ce0e7-3cb1-4739-83e5-21581efa928e.png";
    if (profileText) profileText.textContent = "Perfil";
    if (profileTextMobile) profileTextMobile.textContent = "Perfil";

    if (profileDropdown) {
      profileDropdown.innerHTML = `
        <button type="button" role="menuitem" id="register-btn">Registrarse</button>
        <button type="button" role="menuitem" id="login-btn">Iniciar Sesión</button>
      `;
      document.getElementById('register-btn')?.addEventListener('click', () => showAuthSection('register'));
      document.getElementById('login-btn')?.addEventListener('click', () => showAuthSection('login'));
    }
    if (profileDropdownMobile) {
      profileDropdownMobile.innerHTML = `
        <button type="button" role="menuitem" id="register-btn-mobile">Registrarse</button>
        <button type="button" role="menuitem" id="login-btn-mobile">Iniciar Sesión</button>
      `;
      document.getElementById('register-btn-mobile')?.addEventListener('click', () => { showAuthSection('register'); mobileNav?.classList.remove('show'); mobileMenuButton?.setAttribute('aria-expanded', 'false'); });
      document.getElementById('login-btn-mobile')?.addEventListener('click', () => { showAuthSection('login'); mobileNav?.classList.remove('show'); mobileMenuButton?.setAttribute('aria-expanded', 'false'); });
    }
  }
}

function updateProfileDropdown() {
  if (!profileDropdown || !profileBtn) return;
  if (profileDropdownOpen) {
    profileDropdown.classList.add('show');
    profileBtn.setAttribute('aria-expanded', 'true');
  } else {
    profileDropdown.classList.remove('show');
    profileBtn.setAttribute('aria-expanded', 'false');
  }
}
function closeProfileDropdown() {
  profileDropdownOpen = false;
  profileDropdown?.classList.remove('show');
  profileBtn?.setAttribute('aria-expanded', 'false');
}
function updateProfileDropdownMobile() {
  if (!profileDropdownMobile || !profileBtnMobile) return;
  if (profileDropdownMobileOpen) {
    profileDropdownMobile.classList.add('show');
    profileBtnMobile.setAttribute('aria-expanded', 'true');
  } else {
    profileDropdownMobile.classList.remove('show');
    profileBtnMobile.setAttribute('aria-expanded', 'false');
  }
}
function closeProfileDropdownMobile() {
  profileDropdownMobileOpen = false;
  profileDropdownMobile?.classList.remove('show');
  profileBtnMobile?.setAttribute('aria-expanded', 'false');
}

profileBtn?.addEventListener('click', e => {
  e.stopPropagation();
  profileDropdownOpen = !profileDropdownOpen;
  updateProfileDropdown();
});
profileBtn?.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); profileDropdownOpen = !profileDropdownOpen; updateProfileDropdown(); }
});

profileBtnMobile?.addEventListener('click', e => {
  e.stopPropagation();
  profileDropdownMobileOpen = !profileDropdownMobileOpen;
  updateProfileDropdownMobile();
});
profileBtnMobile?.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); profileDropdownMobileOpen = !profileDropdownMobileOpen; updateProfileDropdownMobile(); }
});

document.addEventListener('click', () => {
  closeProfileDropdown();
  closeProfileDropdownMobile();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProfileDropdown();
    closeProfileDropdownMobile();
    profileBtn?.focus();
    profileBtnMobile?.focus();
  }
});

// =======================
// SECCIONES (mostrar/ocultar)
// =======================
const showLandingPage = () => {
  hideAllSections();
  if (landingPageSection) landingPageSection.classList.replace('hidden', 'active');
  // reset nav states
  navHome?.classList.add('active');
  navHome?.setAttribute('aria-current', 'page');
  navDashboard?.classList.remove('active');
  navShop?.classList.remove('active');
  navTutorial?.classList.remove('active');
  [navHomeMobile, navDashboardMobile, navShopMobile, navTutorialMobile].forEach(el => el?.classList.remove('active'));
  navHomeMobile?.classList.add('active');
  closeProfileDropdown();
  closeProfileDropdownMobile();
};
const showDashboard = () => {
  hideAllSections();
  if (dashboardSection) dashboardSection.classList.replace('hidden', 'active');
  navDashboard?.classList.add('active');
  navDashboard?.setAttribute('aria-current', 'page');
  navHome?.classList.remove('active');
  navShop?.classList.remove('active');
  navTutorial?.classList.remove('active');
  [navHomeMobile, navDashboardMobile, navShopMobile, navTutorialMobile].forEach(el => el?.classList.remove('active'));
  navDashboardMobile?.classList.add('active');
  closeProfileDropdown();
  closeProfileDropdownMobile();
};
const showTutorial = () => {
  hideAllSections();
  if (tutorialSection) tutorialSection.classList.replace('hidden', 'active');
  navTutorial?.classList.add('active');
  navHome?.classList.remove('active');
  navDashboard?.classList.remove('active');
  navShop?.classList.remove('active');
  [navHomeMobile, navDashboardMobile, navShopMobile, navTutorialMobile].forEach(el => el?.classList.remove('active'));
  navTutorialMobile?.classList.add('active');
  closeProfileDropdown();
  closeProfileDropdownMobile();
};
const showShop = () => {
  hideAllSections();
  if (shopSection) shopSection.classList.replace('hidden', 'active');
  navShop?.classList.add('active');
  navHome?.classList.remove('active');
  navDashboard?.classList.remove('active');
  navTutorial?.classList.remove('active');
  [navHomeMobile, navDashboardMobile, navShopMobile, navTutorialMobile].forEach(el => el?.classList.remove('active'));
  navShopMobile?.classList.add('active');
  closeProfileDropdown();
  closeProfileDropdownMobile();
};

const showAbout = () => {
  hideAllSections();
  if (aboutSection) aboutSection.classList.replace('hidden', 'active');
  navAbout?.classList.add('active');
  navAbout?.setAttribute('aria-current', 'page');
  navHome?.classList.remove('active');
  navDashboard?.classList.remove('active');
  navShop?.classList.remove('active');
  navTutorial?.classList.remove('active');

  [navHomeMobile, navDashboardMobile, navShopMobile, navTutorialMobile].forEach(el => el?.classList.remove('active'));
  navAboutMobile?.classList.add('active');

  closeProfileDropdown();
  closeProfileDropdownMobile();
};


function hideAllSections() {
  [landingPageSection, dashboardSection, authSection, tutorialSection, shopSection, aboutSection].forEach(sec => {
    if (sec) {
      sec.classList.add('hidden');
      sec.classList.remove('active');
    }
  });
}

document.getElementById("nav-about").addEventListener("click", () => {
  hideAllSections();
  aboutSection.classList.add("active");
});


function showAuthSection(type = 'register') {
  hideAllSections();
  authSection.classList.add('active');
  authSection.classList.remove('hidden');

  if (type === 'login') {
    authTitle.textContent = 'Iniciar Sesión';
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  } else {
    authTitle.textContent = 'Registrarse';
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
  }
  closeProfileDropdown();
  closeProfileDropdownMobile();
}

// nav listeners
navHome?.addEventListener('click', showLandingPage);
navDashboard?.addEventListener('click', showDashboard);
navShop?.addEventListener('click', showShop);
navTutorial?.addEventListener('click', () => { showTutorial(); mobileNav?.classList.remove('show'); mobileMenuButton?.setAttribute('aria-expanded', 'false'); });
navAbout?.addEventListener('click', showAbout);
navAbout?.addEventListener('keydown', e => { 
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showAbout(); } 
});

navHome?.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showLandingPage(); } });
navDashboard?.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showDashboard(); } });
navTutorial?.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showTutorial(); } });
navShop?.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showShop(); } });

navHomeMobile?.addEventListener('click', () => { showLandingPage(); mobileNav?.classList.remove('show'); mobileMenuButton?.setAttribute('aria-expanded', 'false'); });
navDashboardMobile?.addEventListener('click', () => { showDashboard(); mobileNav?.classList.remove('show'); mobileMenuButton?.setAttribute('aria-expanded', 'false'); });
navShopMobile?.addEventListener('click', () => { showShop(); mobileNav?.classList.remove('show'); mobileMenuButton?.setAttribute('aria-expanded', 'false'); });
navTutorialMobile?.addEventListener('click', () => { showTutorial(); mobileNav?.classList.remove('show'); mobileMenuButton?.setAttribute('aria-expanded', 'false'); });
navAboutMobile?.addEventListener('click', () => { 
  showAbout(); 
  mobileNav?.classList.remove('show'); 
  mobileMenuButton?.setAttribute('aria-expanded', 'false'); 
});
// =======================
// PLANTS / CRUD
// =======================
let plants = [
  { id: 1, name: 'Monstera Deliciosa', consumption: 'medium', water: 65, vitamins: 80, fertilizer: 50 },
  { id: 2, name: 'Ficus Lyrata', consumption: 'high', water: 30, vitamins: 20, fertilizer: 10 },
  { id: 3, name: 'Succulent Mix', consumption: 'low', water: 85, vitamins: 90, fertilizer: 75 },
];

let tankLevels = { water: 100, vitamins: 100, fertilizer: 15 };

function guardarPlantasEnLocalStorage() { localStorage.setItem('plants', JSON.stringify(plants)); }
function cargarPlantasDesdeLocalStorage() {
  const data = localStorage.getItem('plants');
  if (data) {
    try { plants = JSON.parse(data); } catch (e) { console.error('Error parseando plants de localStorage', e); }
  }
}

function clamp(num, min, max) { return Math.min(Math.max(num, min), max); }

function createStatusRow(iconText, labelText, levelPercent, barClass) {
  const row = document.createElement('div'); row.className = 'status-row';
  const icon = document.createElement('span'); icon.className = 'status-icon'; icon.textContent = iconText; icon.setAttribute('aria-hidden', 'true'); row.appendChild(icon);
  const label = document.createElement('span'); label.className = 'status-label'; label.textContent = labelText; row.appendChild(label);
  const barContainer = document.createElement('div'); barContainer.className = 'status-bar-container';
  const bar = document.createElement('div'); bar.className = `status-bar ${barClass}`;
  const mlValue = clamp(levelPercent, 0, 250);
  bar.style.width = `${(mlValue / 250) * 100}%`;
  bar.setAttribute('aria-valuemin', 0); bar.setAttribute('aria-valuemax', 250); bar.setAttribute('aria-valuenow', mlValue);
  bar.setAttribute('role', 'progressbar'); bar.setAttribute('aria-label', `El nivel de ${labelText} es de ${mlValue} ml`);
  barContainer.appendChild(bar); row.appendChild(barContainer);
  const valueText = document.createElement('span'); valueText.textContent = `${mlValue} ml`; valueText.style.fontWeight = '600'; valueText.style.color = '#4a7e60'; valueText.style.minWidth = '60px'; valueText.style.textAlign = 'right';
  if (barClass.includes('water')) valueText.classList.add('agua-ml'); else if (barClass.includes('vitamins')) valueText.classList.add('vitaminas-ml'); else if (barClass.includes('fertilizer')) valueText.classList.add('fertilizante-ml');
  row.appendChild(valueText);
  return row;
}

function checkAlerts(plant) {
  const threshold = 100;

  if (plant.water <= threshold) {
    addPersistentNotification(
      `La planta "${plant.name}" tiene BAJO nivel de AGUA (${plant.water}ml).`,
      'water'   // 👈 tipo personalizado
    );
  }
  if (plant.vitamins <= threshold) {
    addPersistentNotification(
      `La planta "${plant.name}" tiene BAJO nivel de VITAMINAS (${plant.vitamins}ml).`,
      'vitamins'
    );
  }
  if (plant.fertilizer <= threshold) {
    addPersistentNotification(
      `La planta "${plant.name}" tiene BAJO nivel de FERTILIZANTE (${plant.fertilizer}ml).`,
      'fertilizer'
    );
  }
}


function createPlantCard(plant) {
  // checkAlerts agrega a la lista de notificaciones, no muestra toasts automáticamente
  checkAlerts(plant);

  const card = document.createElement('article'); card.className = 'plant-card'; card.setAttribute('tabindex', '0'); card.setAttribute('aria-labelledby', `plant-name-${plant.id}`); card.setAttribute('role', 'region');

  // alert icon if any low
  const alertNeeded = (plant.water <= 100 || plant.vitamins <= 100 || plant.fertilizer <= 100);
  if (alertNeeded) {
    const alertIcon = document.createElement('div'); alertIcon.className = 'alert-icon'; alertIcon.title = 'Atención requerida para esta planta'; alertIcon.setAttribute('aria-label', 'Alerta: atención necesaria'); alertIcon.textContent = 'error'; card.appendChild(alertIcon);
  }

  const plantName = document.createElement('h3'); plantName.className = 'plant-name'; plantName.id = `plant-name-${plant.id}`; plantName.textContent = plant.name; card.appendChild(plantName);
  const consumption = document.createElement('p'); consumption.className = 'consumption-type'; consumption.textContent = `Consumo: ${plant.consumption}`; card.appendChild(consumption);
  card.appendChild(createStatusRow('water_drop', 'Agua', plant.water, 'status-water'));
  card.appendChild(createStatusRow('local_florist', 'Vitaminas', plant.vitamins, 'status-vitamins'));
  card.appendChild(createStatusRow('spa', 'Fertilizante', plant.fertilizer, 'status-fertilizer'));

  const actions = document.createElement('div'); actions.style.display = 'flex'; actions.style.justifyContent = 'flex-end'; actions.style.gap = '12px'; actions.style.marginTop = '12px';
  const editBtn = document.createElement('button'); editBtn.innerHTML = '✏️'; editBtn.title = 'Editar'; editBtn.style.background = 'none'; editBtn.style.border = 'none'; editBtn.style.cursor = 'pointer'; editBtn.style.fontSize = '18px'; editBtn.addEventListener('click', () => editPlant(plant.id));
  const deleteBtn = document.createElement('button'); deleteBtn.innerHTML = '🗑️'; deleteBtn.title = 'Eliminar'; deleteBtn.style.background = 'none'; deleteBtn.style.border = 'none'; deleteBtn.style.cursor = 'pointer'; deleteBtn.style.fontSize = '18px'; deleteBtn.addEventListener('click', () => deletePlant(plant.id));
  actions.appendChild(editBtn); actions.appendChild(deleteBtn); card.appendChild(actions);

  return card;
}

function renderPlants() {
  if (!plantListEl) return;
  plantListEl.innerHTML = '';
  plants.forEach(plant => plantListEl.appendChild(createPlantCard(plant)));
}

function deletePlant(id) {
  if (!confirm('¿Estás seguro que querés eliminar esta planta?')) return;
  plants = plants.filter(p => p.id !== id);
  guardarPlantasEnLocalStorage();
  renderPlants();
  showToast("🌱 Planta eliminada correctamente.", "success", { duration: 2500 });
  // Removing related notifications for that plant (optional)
  notificationMessages = notificationMessages.filter(n => !n.message.includes(`"${getPlantNameById(id)}"`));
  updateHeaderCounter();
  renderNotifPanel();
}

function getPlantNameById(id) {
  const p = plants.find(x => x.id === id);
  return p ? p.name : '';
}

function editPlant(id) {
  const plant = plants.find(p => p.id === id);
  if (!plant) return;
  editingPlantId = id;
  // Fill modal fields if exist
  if (document.getElementById('plant-name-input')) document.getElementById('plant-name-input').value = plant.name;
  if (document.getElementById('consumption-select')) document.getElementById('consumption-select').value = plant.consumption;
  if (document.getElementById('water-level')) document.getElementById('water-level').value = plant.water;
  if (document.getElementById('vitamins-level')) document.getElementById('vitamins-level').value = plant.vitamins;
  if (document.getElementById('fertilizer-level')) document.getElementById('fertilizer-level').value = plant.fertilizer;
  document.getElementById('new-plant-modal')?.classList.add('active');
}

// New plant modal wiring
if (newPlantBtn && newPlantModal) {
  newPlantBtn.addEventListener('click', () => newPlantModal.classList.add('active'));
}
modalCancelBtn?.addEventListener('click', () => newPlantModal?.classList.remove('active'));

if (newPlantForm) {
  newPlantForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('plant-name-input')?.value.trim();
    const consumption = document.getElementById('consumption-select')?.value;
    const water = parseInt(document.getElementById('water-level')?.value || '0', 10);
    const vitamins = parseInt(document.getElementById('vitamins-level')?.value || '0', 10);
    const fertilizer = parseInt(document.getElementById('fertilizer-level')?.value || '0', 10);
    if (!name || !consumption) { showToast('Por favor, completá todos los campos obligatorios.', 'error'); return; }
    if (editingPlantId) {
      const plant = plants.find(p => p.id === editingPlantId);
      if (plant) { plant.name = name; plant.consumption = consumption; plant.water = water; plant.vitamins = vitamins; plant.fertilizer = fertilizer; }
      editingPlantId = null;
      showToast('✏️ Planta actualizada.', 'success');
    } else {
      plants.push({ id: Date.now(), name, consumption, water, vitamins, fertilizer });
      showToast('➕ Nueva planta añadida.', 'success');
    }
    guardarPlantasEnLocalStorage();
    renderPlants();
    newPlantModal?.classList.remove('active');
    newPlantForm.reset();
    // update notification list because levels might have changed
    // Recompute notifications entirely (simple approach)
    rebuildNotificationsFromPlants();
  });
}

// Rebuild notifications array based on current plants (useful after edits)
function rebuildNotificationsFromPlants() {
  notificationMessages = []; // clear
  plants.forEach(p => checkAlerts(p));
  updateHeaderCounter();
  renderNotifPanel();
}

// Verificar plantas y notificaciones por DOM (si tenés elementos renderizados manualmente)
function verificarPlantas() {
  const plantas = document.querySelectorAll('.plant-card');
  plantas.forEach(planta => {
    const nombre = planta.querySelector('.plant-name')?.textContent.trim() || 'Planta';
    const agua = parseInt(planta.querySelector('.agua-ml')?.textContent || '0', 10);
    const vitaminas = parseInt(planta.querySelector('.vitaminas-ml')?.textContent || '0', 10);
    const fertilizante = parseInt(planta.querySelector('.fertilizante-ml')?.textContent || '0', 10);
    if (agua <= 100) addPersistentNotification(`El agua de ${nombre} tiene ${agua} ml. Recargala.`, 'warning');
    if (vitaminas <= 100) addPersistentNotification(`Las vitaminas de ${nombre} tienen ${vitaminas} ml. Recargalas.`, 'warning');
    if (fertilizante <= 100) addPersistentNotification(`El fertilizante de ${nombre} tiene ${fertilizante} ml. Recargalo.`, 'warning');
  });
}

// =======================
// AUTH (simulado) wiring
// =======================
showRegisterLink?.addEventListener('click', (e) => { e.preventDefault(); showAuthSection('register'); });
showLoginLink?.addEventListener('click', (e) => { e.preventDefault(); showAuthSection('login'); });

loginForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  isLoggedIn = true;
  updateProfileUI();
  updateNavVisibility();
  showDashboard();
  showToast('✅ ¡Sesión iniciada correctamente!', 'success');
});

registerForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const password = document.getElementById('register-password')?.value || '';
  const confirmPassword = document.getElementById('register-confirm-password')?.value || '';
  if (password !== confirmPassword) { showToast('⚠️ ¡Las contraseñas no coinciden!', 'error'); return; }
  isLoggedIn = true;
  updateProfileUI();
  showDashboard();
  showToast('✅ ¡Registrado correctamente!', 'success');
});

function handleLogout() {
  isLoggedIn = false;
  updateProfileUI();
  updateNavVisibility();
  showLandingPage();
  showToast('👋 ¡Sesión cerrada correctamente!', 'info');
}

// =======================
// TIENDA / CARRITO
// =======================
let cart = [];
function updateCart() {
  if (!cartList || !cartTotal) return;
  cartList.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${item.price}`;
    cartList.appendChild(li);
    total += item.price;
  });
  cartTotal.textContent = `Total: $${total}`;
  cartPanel?.classList.remove("hidden");
}

document.querySelectorAll('.btn-add-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.product;
    const price = parseInt(btn.dataset.price || '0', 10);
    cart.push({ name, price });
    updateCart();
    showToast(`🛒 ${name} añadido al carrito`, 'success');
  });
});

document.querySelectorAll('.btn-buy').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.product;
    const price = btn.dataset.price;
    if (checkoutProduct) checkoutProduct.textContent = `Producto: ${name} - $${price}`;
    checkoutModal?.classList.remove("hidden");
  });
});

confirmPurchase?.addEventListener('click', () => {
  showToast("✅ ¡Compra realizada con éxito!", "success");
  checkoutModal?.classList.add("hidden");
  cart = [];
  updateCart();
  cartPanel?.classList.add("hidden");
});
closeCheckout?.addEventListener('click', () => checkoutModal?.classList.add("hidden"));

// Efectos visuales botones tienda (sin cambiar CSS)
document.addEventListener('mouseover', e => {
  if (e.target.classList?.contains('shop-btn')) {
    e.target.style.background = 'linear-gradient(135deg, #7bc6a9, #a8d5ba)';
    e.target.style.boxShadow = '0 8px 18px rgba(123,198,169,0.6)';
  }
});
document.addEventListener('mouseout', e => {
  if (e.target.classList?.contains('shop-btn')) {
    e.target.style.background = 'linear-gradient(135deg, #a8d5ba, #7bc6a9)';
    e.target.style.boxShadow = '0 6px 14px rgba(123,198,169,0.4)';
  }
});

// =======================
// UTIL / INIT
// =======================
function init() {
  // Load stored plants
  cargarPlantasDesdeLocalStorage();
  // Render UI
  updateProfileUI();
  showLandingPage();
  renderPlants();
  // Recompute notifications based on initial plants
  rebuildNotificationsFromPlants();
  // Ensure notif panel hidden initially
  closeNotifPanel();
}

init();

// Expose some useful functions globally (for debugging in console)
window.Liftogarden = {
  plants,
  addPersistentNotification,
  removePersistentNotificationById,
  clearAllPersistentNotifications,
  renderNotifPanel,
  showToast,
  rebuildNotificationsFromPlants
};
updateNavVisibility();

