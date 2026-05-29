const OWNER_PHONE = "12089953298";

const answers = {
  pricing:
    "Pricing depends on vehicle size, condition, and service. A maintenance wash is the quickest option, a full detail is the deeper reset, and correction or ceramic work needs a quote after seeing the paint.",
  time:
    "Most mobile details take a few hours. A light wash and interior is shorter, a full detail usually takes longer, and correction or ceramic coating may need a full day or more.",
  mobile:
    "Ascent comes to you in the Treasure Valley. For best results, book a safe place to work with room around the vehicle. Power and water availability can be confirmed by text.",
  ceramic:
    "Ceramic coatings add durable gloss and protection after proper prep. If the paint has swirls or oxidation, correction may be recommended before coating.",
  default:
    "I can help with pricing, timing, mobile setup, ceramic coatings, pet hair, stains, and booking. For an exact quote, send a booking request or text Ascent directly."
};

const chatPanel = document.querySelector("#chat-panel");
const chatToggle = document.querySelector(".chat-toggle");
const chatClose = document.querySelector(".chat-close");
const chatLog = document.querySelector("#chat-log");
const chatForm = document.querySelector("#chat-form");
const chatInput = document.querySelector("#chat-input");
const bookingForm = document.querySelector("#booking-form");
const bookingStatus = document.querySelector("#booking-status");
const serviceSelect = document.querySelector("#service-select");

function addMessage(text, type = "bot") {
  const bubble = document.createElement("div");
  bubble.className = `message ${type}`;
  bubble.textContent = text;
  chatLog.appendChild(bubble);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function answerFor(question) {
  const normalized = question.toLowerCase();

  if (normalized.includes("price") || normalized.includes("cost") || normalized.includes("quote")) {
    return answers.pricing;
  }
  if (normalized.includes("long") || normalized.includes("time") || normalized.includes("hours")) {
    return answers.time;
  }
  if (normalized.includes("mobile") || normalized.includes("come") || normalized.includes("water") || normalized.includes("power")) {
    return answers.mobile;
  }
  if (normalized.includes("ceramic") || normalized.includes("coat") || normalized.includes("paint correction") || normalized.includes("swirl")) {
    return answers.ceramic;
  }
  if (normalized.includes("pet") || normalized.includes("hair")) {
    return "Pet hair can usually be handled during a deeper interior detail. Mention the amount of pet hair in the booking notes so the team can quote the right time.";
  }
  if (normalized.includes("stain") || normalized.includes("seat") || normalized.includes("carpet")) {
    return "Interior stains can often be improved with extraction and proper cleaners. Some older stains may not fully disappear, but they can usually be cleaned up noticeably.";
  }
  if (normalized.includes("book") || normalized.includes("schedule") || normalized.includes("appointment")) {
    return "Use the booking form on this page or text 208-995-3298 with your vehicle, service, address, and preferred date.";
  }

  return answers.default;
}

function openChat() {
  chatPanel.hidden = false;
  chatToggle.setAttribute("aria-expanded", "true");
  if (!chatLog.dataset.started) {
    addMessage("Hey, I can answer quick detailing questions or help you decide what to book.");
    chatLog.dataset.started = "true";
  }
}

function closeChat() {
  chatPanel.hidden = true;
  chatToggle.setAttribute("aria-expanded", "false");
}

chatToggle.addEventListener("click", () => {
  if (chatPanel.hidden) {
    openChat();
    chatInput.focus();
  } else {
    closeChat();
  }
});

chatClose.addEventListener("click", closeChat);

document.querySelectorAll(".quick-questions button").forEach((button) => {
  button.addEventListener("click", () => {
    openChat();
    const key = button.dataset.question;
    const label = button.textContent.trim();
    addMessage(label, "user");
    addMessage(answers[key] || answers.default);
  });
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const question = chatInput.value.trim();
  if (!question) return;
  addMessage(question, "user");
  addMessage(answerFor(question));
  chatInput.value = "";
});

document.querySelectorAll(".select-service").forEach((button) => {
  button.addEventListener("click", () => {
    serviceSelect.value = button.dataset.service;
    document.querySelector("#booking").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(bookingForm);
  const lines = [
    "Ascent booking request",
    `Name: ${data.get("name")}`,
    `Phone: ${data.get("phone")}`,
    `Vehicle: ${data.get("vehicle")}`,
    `Service: ${data.get("service")}`,
    `Preferred date: ${data.get("date")}`,
    `Preferred time: ${data.get("time")}`,
    `Address: ${data.get("address")}`,
    `Notes: ${data.get("notes") || "None"}`
  ];
  const message = encodeURIComponent(lines.join("\n"));
  bookingStatus.textContent = "Opening your text app with the booking details.";
  window.location.href = `sms:+${OWNER_PHONE}?&body=${message}`;
});
