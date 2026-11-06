"use strict";

const mockEvents = [
  {
    id: "rebuild-26",
    category: "hackathons",
    title: "ReBuild '26",
    bannerType: "rebuild",
    emblem: "RE",
    status: "LIVE",
    description: "ReBuild '26 is an individual dashboard-recreation hackathon by CampusCode. You participate alone, but you must create a team name for tracking and use it on your Unstop registration, the CampusCode portal, and every submission.",
    extra: "Round 1 (Friday, 6 Nov, morning to 1 PM): Recreate the CampusCode user flow faithfully — Dashboard, Login, Register, and Student dashboard — and submit your demo any time till 10 PM. Round 2 (Saturday, 7 Nov, top performers from Round 1 only): Build a complete new UI in CampusCode's vibe. Frontend only; mock data is fine. No presentation round. Winner receives a certificate and a CampusCode internship with ₹15,000 stipend; runner-up and all participants receive certificates. Sunday, 8 Nov (Diwali) is free. This is a paid event (₹50 on Unstop); paid students receive an invite code to join on the portal.",
    classification: "HACKATHON · SOLO · 2 ROUNDS",
    details: [["MODE", "—"], ["TEAM SIZE", "Individual"], ["START", "Nov 06, 2026"]],
    primaryAction: "✓ JOINED",
    joined: true,
    reference: "b270e9a1-n1b5-4b96-a074-4d01e52d2f1",
    eventId: "2f6d6d-bba1-4f4f-8d6e-8c88836b3b61"
  },
  {
    id: "firstcommit-reattempt",
    category: "quizzes",
    title: "FirstCommit '26 Quiz Competition 2.0",
    bannerType: "quiz",
    emblem: "FQ",
    status: "COMPLETED",
    description: "This is the reattempt quiz those who missed.",
    extra: "A second chance to take part in the FirstCommit '26 technology quiz. Check the event details for the latest participation information.",
    classification: "QUIZ · SOLO · TIMED",
    details: [["MODE", "—"], ["FORMAT", "Solo"], ["START", "—"]],
    primaryAction: "REGISTER FOR QUIZ",
    joined: false,
    reference: "23048c76-4792-4b40-b2f0-18f7847b2d8e"
  },
  {
    id: "firstcommit-quiz",
    category: "quizzes",
    title: "FirstCommit '26 Quiz Competition",
    bannerType: "quiz",
    emblem: "FQ",
    status: "COMPLETED",
    description: "The quiz features 50 questions across technology, AI, and engineering — 42 multiple-choice questions and 8 true/false questions — to be completed in 30 minutes on Sunday, 1 November 2026.",
    extra: "The quiz is conducted online on the CampusCode platform, and every participant gets a single attempt.",
    classification: "QUIZ · SOLO · TIMED",
    details: [["MODE", "—"], ["FORMAT", "Solo"], ["START", "—"]],
    primaryAction: "REGISTER FOR QUIZ",
    joined: false,
    reference: "920901c1-3a00-4801-8f46-fc4c577e84be"
  }
];

const eventGrid = document.querySelector("#event-grid");
const myEventGrid = document.querySelector("#my-event-grid");
const eventsView = document.querySelector("#events-view");
const myEventsView = document.querySelector("#my-events-view");
const pageTitle = document.querySelector("#header-page-title");
const toast = document.querySelector("#dashboard-toast");
const dialog = document.querySelector("#dashboard-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogBody = document.querySelector("#dialog-body");
let activeFilter = "all";
let toastTimer;

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function makeEventBanner(event, registered = false) {
  const banner = createElement("div", `event-banner${event.bannerType === "quiz" ? " quiz-banner" : ""}${registered ? " my-event-banner" : ""}`);
  banner.setAttribute("aria-label", `${event.title} event banner`);

  const logoBox = createElement("span", "event-banner-logo");
  const logo = document.createElement("img");
  logo.src = "assets/campuscode-logo.png";
  logo.alt = "";
  logoBox.append(logo);

  const copy = createElement("span", "event-banner-copy");
  copy.append(createElement("small", "", event.bannerType === "quiz" ? "CAMPUSCODE QUIZ" : "CAMPUSCODE PRESENTS"));
  const bannerTitle = createElement("strong");
  if (event.bannerType === "rebuild") {
    bannerTitle.append(document.createTextNode("ReBuild "));
    bannerTitle.append(createElement("span", "", "'26"));
    copy.append(bannerTitle);
    copy.append(createElement("em", "", "THE DASHBOARD RECREATION HACKATHON"));
  } else {
    bannerTitle.textContent = "FIRSTCOMMIT '26";
    copy.append(bannerTitle);
    copy.append(createElement("em", "", "QUIZ COMPETITION"));
  }

  banner.append(logoBox, copy);
  if (event.bannerType === "quiz") banner.append(createElement("span", "quiz-watermark", "50"));
  if (event.bannerType === "rebuild") banner.append(createElement("span", "event-banner-rail mono", "BUILD · COMPETE · SHIP"));
  return banner;
}

function createEventCard(event) {
  const card = createElement("article", "event-card");
  card.dataset.category = event.category;
  card.append(makeEventBanner(event));

  const reference = createElement("div", "event-reference");
  reference.append(
    createElement("span", "", event.reference),
    createElement("span", `event-status${event.status === "COMPLETED" ? " is-completed" : ""}`, event.status)
  );
  card.append(reference);

  const titleRow = createElement("div", "event-title-row");
  titleRow.append(
    createElement("span", `event-roundel${event.category === "quizzes" ? " quiz-roundel" : ""}`, event.emblem),
    createElement("h2", "event-title", event.title)
  );
  card.append(titleRow);

  card.append(createElement("p", "event-description", event.description));
  if (event.extra) card.append(createElement("p", "event-description event-extra", event.extra));
  card.append(createElement("p", "event-classification", event.classification));

  const details = createElement("dl", "event-details");
  event.details.forEach(([label, value]) => {
    const item = createElement("div", "event-detail");
    item.append(createElement("dt", "", label), createElement("dd", "", value));
    details.append(item);
  });
  card.append(details);

  const actions = createElement("div", "event-actions");
  const detailsButton = createElement("button", "event-action", "VIEW DETAILS");
  detailsButton.type = "button";
  detailsButton.addEventListener("click", () => {
    showDialog(event.title, `${event.description}\n\n${event.extra || event.classification}`);
  });
  detailsButton.append(createElement("span", "action-arrow", "↗"));
  actions.append(detailsButton);

  const primaryButton = createElement(
    "button",
    `event-action${event.joined ? " is-joined" : " is-dark"}`,
    event.primaryAction
  );
  primaryButton.type = "button";
  if (event.joined) {
    primaryButton.setAttribute("aria-label", `${event.title}, joined`);
  } else {
    primaryButton.append(createElement("span", "action-arrow", "↗"));
    primaryButton.addEventListener("click", () => {
      showDialog("QUIZ REGISTRATION", `${event.title}\n\nThis frontend demo doesn't submit a registration. Visit the event organizer's page for participation details.`);
    });
  }
  actions.append(primaryButton);
  card.append(actions);
  return card;
}

function renderEvents() {
  const filteredEvents = activeFilter === "all"
    ? mockEvents
    : mockEvents.filter((event) => event.category === activeFilter);
  eventGrid.replaceChildren(...filteredEvents.map(createEventCard));
  document.querySelector("#events-count").textContent = String(filteredEvents.length).padStart(2, "0");
  document.querySelector("#filter-result").textContent = `${String(filteredEvents.length).padStart(2, "0")} ${filteredEvents.length === 1 ? "EVENT" : "EVENTS"}`;
  if (!filteredEvents.length) eventGrid.append(createElement("p", "empty-events", "No events match this filter."));
}

function renderMyEvents() {
  const event = mockEvents.find((item) => item.id === "rebuild-26");
  const card = createElement("article", "my-event-card");
  card.append(makeEventBanner(event, true));

  const registration = createElement("div", "my-event-registration");
  registration.append(
    createElement("span", "", "REGISTRATION"),
    createElement("span", "", event.eventId)
  );
  card.append(registration);

  const titleRow = createElement("div", "my-event-title-row");
  titleRow.append(
    createElement("span", "event-roundel", event.emblem),
    createElement("h2", "event-title", event.title)
  );
  card.append(titleRow);

  const metadata = createElement("div", "my-event-meta");
  metadata.append(
    createElement("span", "", "STATUS: REGISTERED"),
    createElement("span", "", "TEAM: Quantum coder")
  );
  card.append(metadata);

  const journeyButton = createElement("button", "journey-button", "OPEN JOURNEY ↗");
  journeyButton.type = "button";
  journeyButton.addEventListener("click", () => {
    showDialog("REBUILD '26 / YOUR JOURNEY", "STATUS: REGISTERED\nTEAM: Quantum coder\n\nYour event journey, rounds, results and certificates will appear here in the full CampusCode experience.");
  });
  card.append(journeyButton);
  myEventGrid.replaceChildren(card);
}

function showDialog(title, body) {
  dialogTitle.textContent = title;
  dialogBody.textContent = body;
  dialog.showModal();
}

function setActiveView(view) {
  const showMyEvents = view === "my-events";
  eventsView.hidden = showMyEvents;
  myEventsView.hidden = !showMyEvents;
  pageTitle.textContent = showMyEvents ? "MY EVENTS" : "EVENTS";

  document.querySelectorAll(".workspace-link[data-view]").forEach((button) => {
    const active = button.dataset.view === (showMyEvents ? "my-events" : view === "overview" ? "overview" : "events");
    button.classList.toggle("is-active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });

  if (view === "overview") showToast("Overview is part of this dashboard demo. Explore your events below.");
  closeSidebar();
}

function closeSidebar() {
  const sidebar = document.querySelector("#dashboard-sidebar");
  const toggle = document.querySelector(".sidebar-toggle");
  sidebar.classList.remove("is-open");
  document.querySelector(".dashboard-sidebar-backdrop")?.remove();
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Open workspace menu");
}

function openSidebar() {
  const sidebar = document.querySelector("#dashboard-sidebar");
  const toggle = document.querySelector(".sidebar-toggle");
  sidebar.classList.add("is-open");
  toggle.setAttribute("aria-expanded", "true");
  toggle.setAttribute("aria-label", "Close workspace menu");
  const backdrop = createElement("button", "dashboard-sidebar-backdrop");
  backdrop.type = "button";
  backdrop.setAttribute("aria-label", "Close workspace menu");
  backdrop.addEventListener("click", closeSidebar);
  document.body.append(backdrop);
}

renderEvents();
renderMyEvents();

document.querySelectorAll(".workspace-link[data-view]").forEach((button) => {
  button.addEventListener("click", () => setActiveView(button.dataset.view));
});

document.querySelectorAll(".workspace-link[data-tool]").forEach((button) => {
  button.addEventListener("click", () => {
    closeSidebar();
    showToast(`${button.dataset.tool} is a preview-only workspace item.`);
  });
});

document.querySelectorAll(".event-filter").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".event-filter").forEach((filterButton) => {
      const selected = filterButton === button;
      filterButton.classList.toggle("is-selected", selected);
      filterButton.setAttribute("aria-pressed", String(selected));
    });
    renderEvents();
  });
});

document.querySelector('[data-action="refresh"]').addEventListener("click", (event) => {
  const button = event.currentTarget;
  button.classList.add("is-refreshing");
  if (eventsView.hidden === false) renderEvents();
  if (myEventsView.hidden === false) renderMyEvents();
  window.setTimeout(() => button.classList.remove("is-refreshing"), 450);
  showToast("Dashboard refreshed. Showing the latest demo data.");
});

document.querySelector('[data-action="notifications"]').addEventListener("click", () => {
  showDialog("NOTIFICATIONS / 02 UNREAD", "Your CampusCode notifications will appear here.\n\nThis dashboard uses sample data only.");
});

document.querySelector('[data-action="logout"]').addEventListener("click", () => {
  window.location.href = "login.html";
});

document.querySelector(".sidebar-toggle").addEventListener("click", (event) => {
  const isOpen = event.currentTarget.getAttribute("aria-expanded") === "true";
  if (isOpen) closeSidebar();
  else openSidebar();
});

document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
document.querySelector(".dialog-confirm").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeSidebar();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) closeSidebar();
});
