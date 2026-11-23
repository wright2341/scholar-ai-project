const screenConfig = {
  dashboard: { title: "Dashboard", section: "Workspace" },
  courses: { title: "My courses", section: "Workspace" },
  resources: { title: "Learning resources", section: "Workspace" },
  assistant: { title: "AI study partner", section: "Workspace" },
  performance: { title: "My progress", section: "Insights" },
  attendance: { title: "Attendance", section: "Insights" },
  profile: { title: "My profile", section: "Account" },
  experiences: { title: "Student stories", section: "Community" },
  admin: { title: "Overview", section: "Administration" }
};

const navigation = [
  { section: "LEARN", links: [["dashboard", "⌂", "Dashboard"], ["courses", "▤", "My courses"], ["resources", "▧", "Resources"], ["assistant", "✳", "AI study partner"]] },
  { section: "YOUR JOURNEY", links: [["performance", "↗", "My progress"], ["attendance", "◷", "Attendance"], ["experiences", "♡", "Student stories"]] },
  { section: "MANAGE", links: [["admin", "▦", "Admin overview"]] },
  { section: "ACCOUNT", links: [["profile", "◉", "My profile"]] }
];

const mobilePrimaryPages = ["dashboard", "courses", "assistant"];
const mobilePrimaryLabels = {
  dashboard: "Dashboard",
  courses: "Courses",
  assistant: "Study partner"
};
const mobileIcons = Object.fromEntries(navigation.flatMap(group => group.links.map(([key, glyph]) => [key, glyph])));

function getProfile() {
  const role = localStorage.getItem("scholarAiRole") === "admin" ? "admin" : "student";
  const prefix = role === "admin" ? "scholarAiAdmin" : "scholarAi";
  return {
    role,
    name: localStorage.getItem(`${prefix}Name`) || (role === "admin" ? "Administrator" : "Jordan Davis"),
    email: localStorage.getItem(`${prefix}Email`) || (role === "admin" ? "admin@school.edu" : "jordan.davis@school.edu"),
    program: localStorage.getItem(`${prefix}Program`) || (role === "admin" ? "Academic Administration" : "Psychology"),
    year: localStorage.getItem(`${prefix}Year`) || (role === "admin" ? "Administrator" : "First year")
  };
}

function getInitials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase() || "JD";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
}

function renderLayout() {
  const shell = document.querySelector(".app-shell");
  if (!shell) return;
  const page = shell.dataset.page;
  const role = localStorage.getItem("scholarAiRole") === "admin" ? "admin" : "student";
  if (page === "admin" && role !== "admin") {
    window.location.replace("admin-login.html");
    return;
  }
  const config = screenConfig[page];
  if (!config) return;
  const profile = getProfile();
  const initials = getInitials(profile.name);
  const isMenuPage = !mobilePrimaryPages.includes(page);
  const visibleNavigation = navigation
    .map(group => ({ ...group, links: group.links.filter(([key]) => key !== "admin" || role === "admin") }))
    .filter(group => group.links.length > 0);
  const nav = visibleNavigation.map(group => `
    <p class="nav-section-label">${group.section}</p>
    <nav class="sidebar-nav" aria-label="${group.section.toLowerCase()} navigation">
      ${group.links.map(([key, glyph, label]) => `<a href="${key}.html" class="${key === page ? "active" : ""}"${key === page ? ' aria-current="page"' : ""}><span class="nav-glyph" aria-hidden="true">${glyph}</span>${label}</a>`).join("")}
    </nav>`).join("");
  const mobilePrimary = mobilePrimaryPages.map(key => `
    <a class="mobile-nav-link${key === page ? " active" : ""}" href="${key}.html"${key === page ? ' aria-current="page"' : ""}>
      <span class="mobile-nav-icon" aria-hidden="true">${mobileIcons[key]}</span>
      <span class="mobile-nav-label">${mobilePrimaryLabels[key]}</span>
    </a>`).join("");
  const mobileSecondary = visibleNavigation.flatMap(group => group.links)
    .filter(([key]) => !mobilePrimaryPages.includes(key))
    .map(([key, glyph, label]) => `
      <a class="mobile-menu-link${key === page ? " active" : ""}" href="${key}.html"${key === page ? ' aria-current="page"' : ""}>
        <span class="mobile-nav-icon" aria-hidden="true">${glyph}</span><span>${label}</span>
      </a>`).join("");
  document.querySelector("#sidebar").innerHTML = `
    <a class="brand" href="../index.html"><img class="brand-logo" src="../assets/images/scholarai-logo.png" alt="Scholar AI"></a>
    ${nav}
    <div class="mobile-nav">
      <nav class="mobile-nav-bar" aria-label="Main navigation">
        ${mobilePrimary}
        <button class="mobile-menu-toggle${isMenuPage ? " active" : ""}" type="button" aria-expanded="false" aria-controls="mobile-nav-menu">
          <span class="mobile-nav-icon" aria-hidden="true">☰</span><span class="mobile-nav-label">Menu</span>
        </button>
      </nav>
      <section class="mobile-nav-menu" id="mobile-nav-menu" aria-label="More navigation" hidden>
        <p>MORE</p>
        <nav class="mobile-menu-links" aria-label="More pages">${mobileSecondary}</nav>
        <a class="mobile-menu-link mobile-menu-logout" href="../index.html" data-logout><span class="mobile-nav-icon" aria-hidden="true">↪</span><span>Log out</span></a>
      </section>
    </div>
    <div class="sidebar-bottom">
      <div class="help-card"><strong>Need a hand?</strong><p>A little guidance can make all the difference.</p><a href="assistant.html">Talk to your study partner →</a></div>
      <a class="profile-row" href="profile.html"><span class="profile-avatar">${escapeHtml(initials)}</span><span class="profile-copy"><strong>${escapeHtml(profile.name)}</strong><small>${role === "admin" ? "Admin account · demo" : "Student account"}</small></span><span class="profile-menu" aria-hidden="true">↗</span></a>
      <a class="logout-link" href="../index.html" data-logout>↪ &nbsp; Log out</a>
    </div>`;
  document.querySelector("#topbar").innerHTML = `
    <div class="breadcrumb">ScholarAI <span aria-hidden="true">/</span> <strong>${config.title}</strong></div>
    <div class="topbar-actions"><label class="search-box"><span aria-hidden="true">⌕</span><input type="search" aria-label="Search this page" placeholder="Search anything..."></label><button class="top-icon" type="button" aria-label="Notifications">♧</button><a class="top-profile" href="profile.html" aria-label="View ${escapeHtml(profile.name)}'s profile">${escapeHtml(initials)}</a></div>`;
  const search = document.querySelector(".search-box input");
  search?.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    document.querySelectorAll("[data-searchable]").forEach(item => {
      item.classList.toggle("hidden", query.length > 0 && !item.textContent.toLowerCase().includes(query));
    });
  });
  document.querySelector(".top-icon")?.addEventListener("click", event => {
    const button = event.currentTarget;
    button.textContent = button.textContent === "♧" ? "✓" : "♧";
    button.setAttribute("aria-label", button.textContent === "✓" ? "All caught up" : "Notifications");
  });
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const mobileMenu = document.querySelector("#mobile-nav-menu");
  mobileMenuToggle?.addEventListener("click", () => {
    const isOpen = mobileMenuToggle.getAttribute("aria-expanded") !== "true";
    mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.hidden = !isOpen;
    mobileMenuToggle.querySelector(".mobile-nav-icon").textContent = isOpen ? "×" : "☰";
  });
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape" || mobileMenu?.hidden) return;
    mobileMenu.hidden = true;
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    mobileMenuToggle.querySelector(".mobile-nav-icon").textContent = "☰";
    mobileMenuToggle.focus();
  });
  document.querySelectorAll("[data-logout]").forEach(link => link.addEventListener("click", event => {
    event.preventDefault();
    localStorage.removeItem("scholarAiSession");
    localStorage.removeItem("scholarAiRole");
    window.location.href = event.currentTarget.href;
  }));
}

function setupPasswordToggle(form) {
  const password = form.querySelector("#password");
  const toggle = form.querySelector(".password-toggle");
  toggle?.addEventListener("click", () => {
    const isHidden = password.type === "password";
    password.type = isHidden ? "text" : "password";
    toggle.textContent = isHidden ? "Hide" : "Show";
    toggle.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
  });
}

function setupLogin() {
  const form = document.querySelector("#login-form");
  if (!form) return;
  setupPasswordToggle(form);
  form.addEventListener("submit", event => {
    event.preventDefault();
    const message = form.querySelector(".form-message");
    if (!form.reportValidity()) return;
    localStorage.removeItem("scholarAiAdminName");
    localStorage.removeItem("scholarAiAdminEmail");
    localStorage.removeItem("scholarAiAdminProgram");
    localStorage.removeItem("scholarAiAdminYear");
    localStorage.setItem("scholarAiEmail", form.elements.email.value.trim());
    localStorage.setItem("scholarAiSession", "demo");
    localStorage.setItem("scholarAiRole", "student");
    message.textContent = "You're all set! Taking you to your dashboard…";
    message.classList.add("success");
    window.setTimeout(() => { window.location.href = "dashboard.html"; }, 600);
  });
  form.querySelector(".google-button")?.addEventListener("click", () => {
    const message = form.querySelector(".form-message");
    message.textContent = "Google sign-in isn't connected in this demo. You can continue with your email.";
    message.classList.remove("success");
  });
}

function setupAdminLogin() {
  const form = document.querySelector("#admin-login-form");
  if (!form) return;
  setupPasswordToggle(form);
  form.addEventListener("submit", event => {
    event.preventDefault();
    const message = form.querySelector(".form-message");
    if (!form.reportValidity()) return;
    localStorage.setItem("scholarAiAdminEmail", form.elements.email.value.trim());
    localStorage.setItem("scholarAiSession", "demo");
    localStorage.setItem("scholarAiRole", "admin");
    message.textContent = "Opening the admin demo. No credentials were verified.";
    message.classList.add("success");
    window.setTimeout(() => { window.location.href = "admin.html"; }, 600);
  });
}

function setupProfile() {
  const form = document.querySelector("#profile-form");
  if (!form) return;
  const profile = getProfile();
  const profilePrefix = profile.role === "admin" ? "scholarAiAdmin" : "scholarAi";
  form.elements.name.value = profile.name;
  form.elements.email.value = profile.email;
  form.elements.program.value = profile.program;
  form.elements.year.value = profile.year;
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    localStorage.setItem(`${profilePrefix}Name`, form.elements.name.value.trim());
    localStorage.setItem(`${profilePrefix}Email`, form.elements.email.value.trim());
    localStorage.setItem(`${profilePrefix}Program`, form.elements.program.value.trim());
    localStorage.setItem(`${profilePrefix}Year`, form.elements.year.value);
    const message = form.querySelector(".form-message");
    message.textContent = "Your profile has been saved on this device.";
    message.classList.add("success");
    const avatar = document.querySelector("[data-profile-avatar]");
    if (avatar) avatar.textContent = getInitials(form.elements.name.value);
    const sidebarName = document.querySelector(".profile-row .profile-copy strong");
    if (sidebarName) sidebarName.textContent = form.elements.name.value.trim();
    const sidebarAvatar = document.querySelector(".profile-row .profile-avatar");
    if (sidebarAvatar) sidebarAvatar.textContent = getInitials(form.elements.name.value);
    const topProfile = document.querySelector(".top-profile");
    if (topProfile) {
      topProfile.textContent = getInitials(form.elements.name.value);
      topProfile.setAttribute("aria-label", `View ${form.elements.name.value.trim()}'s profile`);
    }
  });
  form.querySelector("[data-profile-logout]")?.addEventListener("click", () => {
    localStorage.removeItem("scholarAiSession");
    localStorage.removeItem("scholarAiRole");
  });
}

function setupAttendanceDemo() {
  const button = document.querySelector("[data-face-id-demo]");
  const message = document.querySelector("#face-id-message");
  if (!button || !message) return;
  button.addEventListener("click", () => {
    const started = button.getAttribute("aria-pressed") !== "true";
    button.setAttribute("aria-pressed", String(started));
    button.textContent = started ? "Reset demo" : "Try check-in demo";
    message.textContent = started
      ? "Demo only: Face ID was not used and attendance was not recorded. A secure school attendance service is needed to enable real check-ins."
      : "This prototype does not scan your face or record attendance.";
    message.classList.toggle("success", false);
  });
}

function setupTabs() {
  document.querySelectorAll("[data-tab-group]").forEach(group => {
    const buttons = [...group.querySelectorAll(".tab-button")];
    buttons.forEach(button => button.addEventListener("click", () => {
      buttons.forEach(tab => {
        const selected = tab === button;
        tab.classList.toggle("active", selected);
        tab.setAttribute("aria-selected", String(selected));
      });
      const filter = button.dataset.filter;
      const container = document.querySelector(group.dataset.tabGroup);
      container?.querySelectorAll("[data-category]").forEach(card => {
        card.classList.toggle("hidden", filter !== "all" && card.dataset.category !== filter);
      });
    }));
  });
}

function setupAssistant() {
  const form = document.querySelector("#chat-form");
  if (!form) return;
  const input = form.querySelector("input");
  const messages = document.querySelector(".chat-messages");
  const send = text => {
    const value = text.trim();
    if (!value) return;
    const userMessage = document.createElement("div");
    userMessage.className = "chat-message user";
    userMessage.textContent = value;
    messages.append(userMessage);
    const reply = document.createElement("div");
    reply.className = "chat-message";
    reply.textContent = "That's a good question. Try breaking it into smaller steps: what do you already know, and which part feels unclear? Start there, and we can work through it together.";
    messages.append(reply);
    messages.scrollTop = messages.scrollHeight;
    input.value = "";
    input.focus();
  };
  form.addEventListener("submit", event => { event.preventDefault(); send(input.value); });
  document.querySelectorAll("[data-prompt]").forEach(button => button.addEventListener("click", () => send(button.dataset.prompt)));
  document.querySelectorAll(".suggestion-chip").forEach(button => button.addEventListener("click", () => send(button.textContent)));
}

function setupAdminActions() {
  document.querySelectorAll("[data-student-action]").forEach(button => button.addEventListener("click", () => {
    const row = button.closest("tr");
    row.querySelector(".status-pill").textContent = "Reviewed";
    row.querySelector(".status-pill").classList.remove("late");
    button.textContent = "Done";
    button.disabled = true;
  }));
}

renderLayout();
setupLogin();
setupAdminLogin();
setupProfile();
setupAttendanceDemo();
setupTabs();
setupAssistant();
setupAdminActions();
