const cfg = window.WEDDING_CONFIG || {};

function setText(selector, value){
  if(value === undefined || value === null || value === "") return;
  document.querySelectorAll(selector).forEach(el => { el.textContent = value; });
}

function setHtml(selector, value){
  if(value === undefined || value === null || value === "") return;
  document.querySelectorAll(selector).forEach(el => { el.innerHTML = value; });
}

function setMeta(property, value){
  if(!value) return;
  const el = document.querySelector(`meta[property="${property}"]`);
  if(el) el.setAttribute("content", value);
}

/* =========================================================
   ĐỔ DỮ LIỆU TỪ config.js
   ========================================================= */
setText("[data-opening-title]", cfg.openingTitle);
setText("[data-groom]", cfg.groom);
setText("[data-bride]", cfg.bride);
setText("[data-date-text]", cfg.dateText);
setText("[data-groom-display]", cfg.groomDisplay || cfg.groom);
setText("[data-bride-display]", cfg.brideDisplay || cfg.bride);
setText("[data-groom-signature]", cfg.groomSignature || cfg.groomDisplay || cfg.groom);
setText("[data-bride-signature]", cfg.brideSignature || cfg.brideDisplay || cfg.bride);
setText("[data-groom-role]", cfg.groomRole || "Út Nam");
setText("[data-bride-role]", cfg.brideRole || "Út Nữ");
setText("[data-music-title]", cfg.musicTitle || "Beautiful In White");
setText("[data-event-time-short]", cfg.eventTimeShort || cfg.ceremonyTimeShort);
setText("[data-hero-time-short]", cfg.heroTimeShort || cfg.eventTimeShort || cfg.ceremonyTimeShort);
setText("[data-ceremony-time-short]", cfg.ceremonyTimeShort);
setText("[data-ceremony-time-long]", cfg.ceremonyTimeLong);
setText("[data-weekday]", cfg.weekday);
setText("[data-weekday-title]", cfg.weekdayTitle);
setText("[data-day]", cfg.day);
setText("[data-month-text]", cfg.monthText);
setText("[data-month-short]", cfg.monthShort);
setText("[data-year]", cfg.year);
setText("[data-event-date]", cfg.eventDate);
setText("[data-lunar-date]", cfg.lunarDate);
setText("[data-groom-father]", cfg.groomFather);
setText("[data-groom-mother]", cfg.groomMother);
setText("[data-groom-address]", cfg.groomAddress);
setText("[data-bride-father]", cfg.brideFather);
setText("[data-bride-mother]", cfg.brideMother);
setText("[data-bride-address]", cfg.brideAddress);
setText("[data-ceremony-title]", cfg.ceremonyTitle);
setText("[data-event-card-title]", cfg.eventCardTitle);
setText("[data-venue-short]", cfg.venueShort);
setText("[data-venue-name]", cfg.venueName);
setText("[data-venue-address]", cfg.venueAddress);
setText("[data-ceremony-home-note]", cfg.ceremonyHomeNote);
setText("[data-event-hall]", cfg.eventHall);
setText("[data-timeline-title]", cfg.timelineTitle);
setText("[data-timeline1-time]", cfg.timeline1Time);
setText("[data-timeline1-label]", cfg.timeline1Label);
setText("[data-timeline2-time]", cfg.timeline2Time);
setText("[data-timeline2-label]", cfg.timeline2Label);
setText("[data-timeline3-time]", cfg.timeline3Time);
setText("[data-timeline3-label]", cfg.timeline3Label);
setText("[data-quote]", cfg.quote);
if(cfg.memoryCaption1Html){
  setHtml("[data-memory-caption-1]", cfg.memoryCaption1Html);
}else{
  setText("[data-memory-caption-1]", cfg.memoryCaption1);
}
if(cfg.memoryCaption2Html){
  setHtml("[data-memory-caption-2]", cfg.memoryCaption2Html);
}else{
  setText("[data-memory-caption-2]", cfg.memoryCaption2);
}

if(cfg.countdownNoteHtml){
  setHtml("[data-countdown-note]", cfg.countdownNoteHtml);
}else if(cfg.countdownNote){
  document.querySelectorAll("[data-countdown-note]").forEach(el => {
    el.innerHTML = String(cfg.countdownNote).split("\n").map(line => line.replace(/</g,"&lt;")).join("<br>");
  });
}

// V34: countdown text phải luôn có thể đọc được kể cả khi IntersectionObserver/reveal bị lỗi trên mobile.
document.querySelectorAll(".countdown-script, .countdown-message").forEach(el => {
  el.classList.add("is-visible", "countdown-text-safe");
});

if(cfg.shareTitle) document.title = cfg.shareTitle;
setMeta("og:title", cfg.shareTitle);
setMeta("og:description", cfg.shareDescription);
setMeta("og:image", cfg.shareImage);

const mapButton = document.getElementById("mapButton");
if(mapButton && cfg.mapUrl) mapButton.href = cfg.mapUrl;
const mapFrame = document.getElementById("mapFrame");
if(mapFrame && cfg.mapEmbedUrl) mapFrame.src = cfg.mapEmbedUrl;

/* =========================================================
   MỞ THIỆP + NHẠC
   ========================================================= */
const opening = document.getElementById("opening");
const openButton = document.getElementById("openInvitation");
const music = document.getElementById("weddingMusic");
const musicToggle = document.getElementById("musicToggle");
const inlinePlay = document.getElementById("inlinePlay");
const progress = document.getElementById("musicProgress");
const currentTimeEl = document.getElementById("currentTime");
const durationTimeEl = document.getElementById("durationTime");
const backToTop = document.getElementById("backToTop");
const recordPhoto = document.querySelector(".record-photo");
const miniPlayer = document.querySelector(".mini-player");
const petalLayer = document.getElementById("petalLayer");

/* =========================================================
   CÁNH HOA HỒNG RƠI — nhẹ, tinh tế, tối ưu mobile
   ========================================================= */
const petalCfg = cfg.petalEffect || {};
const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
let petalTimer = null;
let petalsStarted = false;

function randomBetween(min,max){
  return Math.random() * (max - min) + min;
}

function createRosePetal(initial=false){
  if(!petalLayer || !petalsStarted || reduceMotion || petalCfg.enabled === false) return;

  const maxPetals = Number(petalCfg.maxPetals || 10);
  if(petalLayer.childElementCount >= maxPetals) return;

  const petal = document.createElement("span");
  const variant = 1 + Math.floor(Math.random() * 3);
  const palette = 1 + Math.floor(Math.random() * 3);
  const size = randomBetween(12, 22);
  const drift = randomBetween(-72, 72);
  const spin = randomBetween(430, 760);
  const duration = randomBetween(Number(petalCfg.durationMin || 9.5), Number(petalCfg.durationMax || 15));
  const opacity = randomBetween(.34, .62);
  const left = randomBetween(4, 96);

  petal.className = `rose-petal petal-v${variant} petal-p${palette}`;
  petal.style.setProperty("--petal-size", `${size}px`);
  petal.style.setProperty("--petal-left", `${left}%`);
  petal.style.setProperty("--petal-opacity", opacity.toFixed(2));
  petal.style.setProperty("--petal-duration", `${duration.toFixed(2)}s`);
  petal.style.setProperty("--petal-spin", `${spin.toFixed(0)}deg`);
  petal.style.setProperty("--drift-1", `${(drift * .28).toFixed(1)}px`);
  petal.style.setProperty("--drift-2", `${(drift * .66).toFixed(1)}px`);
  petal.style.setProperty("--drift-3", `${drift.toFixed(1)}px`);
  petal.style.setProperty("--petal-delay", initial ? `${(-randomBetween(0,duration*.72)).toFixed(2)}s` : `${randomBetween(0,.35).toFixed(2)}s`);

  petal.addEventListener("animationend", () => petal.remove(), {once:true});
  petalLayer.appendChild(petal);
}

function scheduleNextPetal(){
  clearTimeout(petalTimer);
  if(!petalsStarted || document.hidden || reduceMotion || petalCfg.enabled === false) return;
  const min = Number(petalCfg.spawnMin || 720);
  const max = Number(petalCfg.spawnMax || 1180);
  petalTimer = setTimeout(() => {
    createRosePetal(false);
    scheduleNextPetal();
  }, randomBetween(min,max));
}

function startPetalEffect(){
  if(!petalLayer || petalsStarted || reduceMotion || petalCfg.enabled === false) return;
  petalsStarted = true;
  petalLayer.classList.add("active");

  // Vài cánh ban đầu rải sẵn để hiệu ứng không bị trống khi vừa mở thiệp.
  const initialCount = Math.min(5, Number(petalCfg.maxPetals || 10));
  for(let i=0;i<initialCount;i++){
    setTimeout(() => createRosePetal(true), i * 150);
  }
  scheduleNextPetal();
}

function stopPetalEffect(remove=false){
  petalsStarted = false;
  clearTimeout(petalTimer);
  petalTimer = null;
  petalLayer?.classList.remove("active");
  if(remove) petalLayer?.replaceChildren();
}

document.addEventListener("visibilitychange", () => {
  if(!petalLayer) return;
  petalLayer.classList.toggle("petals-paused", document.hidden);
  if(document.hidden){
    clearTimeout(petalTimer);
    petalTimer = null;
  }else if(petalsStarted){
    scheduleNextPetal();
  }
});

document.body.classList.add("locked");

function formatTime(seconds){
  if(!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2,"0")}`;
}

function syncPlayerUI(){
  if(!music) return;
  const playing = !music.paused;
  musicToggle?.classList.toggle("playing", playing);
  miniPlayer?.classList.toggle("playing", playing);
  recordPhoto?.classList.toggle("is-spinning", playing);
  if(inlinePlay) inlinePlay.setAttribute("aria-label", playing ? "Tạm dừng" : "Phát");
}

async function playMusic(){
  if(!music) return;
  try{
    await music.play();
  }catch(err){
    // iOS có thể chặn cho đến khi có thao tác của người dùng.
  }
  syncPlayerUI();
}

function pauseMusic(){
  music?.pause();
  syncPlayerUI();
}

if(openButton){
  openButton.addEventListener("click", async () => {
    opening?.classList.add("hidden");
    document.body.classList.remove("locked");
    requestAnimationFrame(() => document.body.classList.add("invitation-opened"));
    setTimeout(startPetalEffect, 420);
    await playMusic();
  });
}

musicToggle?.addEventListener("click", async () => {
  if(!music) return;
  if(music.paused) await playMusic(); else pauseMusic();
});

inlinePlay?.addEventListener("click", async () => {
  if(!music) return;
  if(music.paused) await playMusic(); else pauseMusic();
});

document.querySelectorAll("[data-music-action]").forEach(button => {
  if(button === inlinePlay) return;
  button.addEventListener("click", async () => {
    if(!music) return;
    const action = button.dataset.musicAction;
    if(action === "restart") music.currentTime = 0;
    if(action === "back") music.currentTime = Math.max(0, music.currentTime - 10);
    if(action === "forward") music.currentTime = Math.min(music.duration || music.currentTime + 10, music.currentTime + 10);
    if(action === "shuffle" && Number.isFinite(music.duration) && music.duration > 5){ music.currentTime = Math.random() * Math.max(1, music.duration - 1); }
    if(music.paused) await playMusic();
  });
});

music?.addEventListener("loadedmetadata", () => {
  if(durationTimeEl) durationTimeEl.textContent = formatTime(music.duration);
});
music?.addEventListener("timeupdate", () => {
  if(currentTimeEl) currentTimeEl.textContent = formatTime(music.currentTime);
  if(progress && Number.isFinite(music.duration) && music.duration > 0){
    progress.value = String((music.currentTime / music.duration) * 100);
  }
});
music?.addEventListener("play", syncPlayerUI);
music?.addEventListener("pause", syncPlayerUI);

progress?.addEventListener("input", () => {
  if(!music || !Number.isFinite(music.duration) || music.duration <= 0) return;
  music.currentTime = (Number(progress.value) / 100) * music.duration;
});

/* =========================================================
   CALENDAR TỰ ĐỘNG THEO weddingDate
   ========================================================= */
function buildCalendar(){
  const root = document.getElementById("calendarDays");
  const title = document.getElementById("calendarTitle");
  if(!root) return;

  const date = new Date(cfg.weddingDate);
  if(Number.isNaN(date.getTime())) return;

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  if(title) title.textContent = `THÁNG ${month + 1} - ${year}`;

  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const mondayIndex = (first.getDay() + 6) % 7;
  root.innerHTML = "";

  for(let i=0;i<mondayIndex;i++){
    const blank = document.createElement("span");
    blank.className = "muted-day";
    root.appendChild(blank);
  }

  for(let d=1;d<=daysInMonth;d++){
    const el = document.createElement("span");
    el.textContent = d;
    if(d === day) el.classList.add("wedding-day");
    root.appendChild(el);
  }
}
buildCalendar();

/* =========================================================
   COUNTDOWN
   ========================================================= */
const target = new Date(cfg.weddingDate).getTime();
function updateCountdown(){
  if(Number.isNaN(target)) return;
  const safe = Math.max(target - Date.now(), 0);
  const d = Math.floor(safe / 86400000);
  const h = Math.floor((safe % 86400000) / 3600000);
  const m = Math.floor((safe % 3600000) / 60000);
  const s = Math.floor((safe % 60000) / 1000);

  const values = {days:String(d).padStart(2,"0"),hours:String(h).padStart(2,"0"),minutes:String(m).padStart(2,"0"),seconds:String(s).padStart(2,"0")};
  Object.entries(values).forEach(([id,value]) => {
    const el = document.getElementById(id);
    if(el) el.textContent = value;
  });
}
updateCountdown();
setInterval(updateCountdown,1000);


/* =========================================================
   V29 — SIGNATURE MOTION ENGINE
   - Title: từng ký tự bật lên, xoay 3D + blur rồi khóa nét
   - Copy dài: từng từ được mở như màn lụa
   - Tên hero/profile: letter cascade có nhịp
   ========================================================= */
function prepareCharFx(el, extraClass=""){
  if(!el || el.dataset.textFxReady === "1") return;
  const raw = el.textContent || "";
  const text = raw.replace(/\s+/g," ").trim();
  if(!text) return;

  el.dataset.textFxReady = "1";
  el.setAttribute("aria-label", text);
  el.textContent = "";
  el.classList.add("textfx-chars");
  if(extraClass) el.classList.add(extraClass);

  const frag = document.createDocumentFragment();
  // Grapheme-safe: không tách dấu tiếng Việt khỏi ký tự gốc.
  const chars = (typeof Intl !== "undefined" && Intl.Segmenter)
    ? Array.from(new Intl.Segmenter("vi", {granularity:"grapheme"}).segment(text), part => part.segment)
    : Array.from(text);
  const center = (chars.length - 1) / 2;
  chars.forEach((char,index) => {
    const span = document.createElement("span");
    span.className = char === " " ? "fx-char fx-space" : "fx-char";
    span.setAttribute("aria-hidden","true");
    span.style.setProperty("--char-i", index);
    span.style.setProperty("--center-i", Math.abs(index - center).toFixed(2));
    span.style.setProperty("--fx-x", `${index % 2 === 0 ? -18 : 18}px`);
    span.style.setProperty("--fx-y", `${24 + (index % 3) * 7}px`);
    span.style.setProperty("--fx-rx", `${index % 2 === 0 ? -76 : 76}deg`);
    span.style.setProperty("--fx-rz", `${index % 2 === 0 ? -4.5 : 4.5}deg`);
    span.textContent = char === " " ? "\u00A0" : char;
    frag.appendChild(span);
  });
  el.appendChild(frag);
}

function prepareWordFx(el, extraClass=""){
  if(!el || el.dataset.textFxReady === "1") return;
  const text = (el.textContent || "").replace(/\s+/g," ").trim();
  if(!text) return;

  el.dataset.textFxReady = "1";
  el.setAttribute("aria-label", text);
  el.textContent = "";
  el.classList.add("textfx-words");
  if(extraClass) el.classList.add(extraClass);

  const words = text.split(" ");
  const frag = document.createDocumentFragment();
  words.forEach((word,index) => {
    const wrap = document.createElement("span");
    wrap.className = "fx-word-wrap";
    wrap.setAttribute("aria-hidden","true");
    wrap.style.setProperty("--word-i", index);
    wrap.style.setProperty("--word-x", `${index % 2 === 0 ? -12 : 12}px`);
    const inner = document.createElement("span");
    inner.className = "fx-word";
    inner.textContent = word;
    wrap.appendChild(inner);
    frag.appendChild(wrap);
    if(index < words.length - 1) frag.appendChild(document.createTextNode(" "));
  });
  el.appendChild(frag);
}

// Các heading quan trọng: cinematic letter-bloom
[
  ".ceremony-title",
  ".event-card-title",
  ".venue-heading",
  ".memories-heading"
].forEach(selector => document.querySelectorAll(selector).forEach(el => prepareCharFx(el,"fx-lux-title")));

// Tên mở thiệp: chạy ký tự ngay khi load
[".opening-person-top", ".opening-person-bottom"].forEach(selector => {
  document.querySelectorAll(selector).forEach(el => prepareCharFx(el,"opening-letter-fx"));
});
requestAnimationFrame(() => requestAnimationFrame(() => document.querySelector(".opening-card")?.classList.add("fx-live")));

// Hero và profile: cascade riêng cho tên cô dâu/chú rể
[".couple-line [data-groom-display]", ".couple-line [data-bride-display]"].forEach(selector => {
  document.querySelectorAll(selector).forEach(el => prepareCharFx(el,"hero-letter-fx"));
});

// Các đoạn văn / địa chỉ: mở từng từ, không còn slide nguyên khối đơn điệu
[
  ".ceremony-home-note",
  ".venue-address",
  ".quote-block"
].forEach(selector => document.querySelectorAll(selector).forEach(el => prepareWordFx(el,"fx-silk-copy")));

// Bilingual: Hoa chạy từng ký tự, Việt mở từng từ
 document.querySelectorAll(".bilingual-han").forEach(el => prepareCharFx(el,"fx-bilingual-han"));

/* =========================================================
   HIỆU ỨNG KHI CUỘN — tách từng element thay vì cả section
   ========================================================= */
/* Hiệu ứng xuất hiện lần lượt trong từng section */
document.querySelectorAll(".site-shell section").forEach(section => {
  section.querySelectorAll("[data-reveal]").forEach((el,index) => {
    const type = el.dataset.reveal || "";
    let delay = Math.min(index * 0.065, 0.32);
    if(type === "timeline-left" || type === "timeline-right") delay = Math.min(index * 0.095, 0.34);
    if(type === "route") delay = 0.22;
    if(type === "map") delay = 0.16;
    el.style.setProperty("--reveal-delay", `${delay}s`);
  });
});

if("IntersectionObserver" in window){
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        requestAnimationFrame(() => {
          entry.target.classList.add("is-visible");

          // V32: các dòng lời mời đã được tách thành từng từ nhưng nằm bên trong
        });
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.08,rootMargin:"0px 0px -3% 0px"});

  document.querySelectorAll("[data-reveal]").forEach(el => observer.observe(el));

  /* Quan sát section thay vì pill để animation ngang luôn chạy được */
  const profileObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        setTimeout(() => entry.target.classList.add("profile-in"), 190);
        profileObserver.unobserve(entry.target);
      }
    });
  },{threshold:.12,rootMargin:"0px 0px -5% 0px"});

  document.querySelectorAll(".profile-section").forEach(section => profileObserver.observe(section));
}else{
  document.querySelectorAll("[data-reveal]").forEach(el => el.classList.add("is-visible"));
  document.querySelectorAll(".profile-section").forEach(section => section.classList.add("profile-in"));
}

/* =========================================================
   BACK TO TOP
   ========================================================= */
backToTop?.addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));

/* =========================================================
   RSVP -> GOOGLE SHEETS
   ========================================================= */
const form = document.getElementById("rsvpForm");
const statusEl = document.getElementById("rsvpStatus");
const destinationEl = document.getElementById("rsvpDestination");
const guestCountEl = document.getElementById("guestCount");
const submittedAtEl = document.getElementById("rsvpSubmittedAt");
const invitationUrlEl = document.getElementById("rsvpInvitationUrl");
const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
const submitButton = form?.querySelector('button[type="submit"]');

function updateGuestRequirement(){
  if(!guestCountEl) return;
  const attendance = form?.querySelector('input[name="attendance"]:checked')?.value || "";
  const isAttending = attendance === "Có";

  guestCountEl.required = isAttending;
  guestCountEl.disabled = attendance === "Không";

  if(attendance === "Không"){
    guestCountEl.value = "";
  }
}

attendanceRadios.forEach(radio => radio.addEventListener("change", updateGuestRequirement));
updateGuestRequirement();

function setSubmitState(isSubmitting){
  if(!submitButton) return;
  submitButton.disabled = isSubmitting;
  submitButton.textContent = isSubmitting ? "ĐANG GỬI..." : "GỬI NGAY";
  submitButton.classList.toggle("is-loading", isSubmitting);
}

function fillSubmissionMetadata(){
  if(submittedAtEl) submittedAtEl.value = new Date().toISOString();
  if(invitationUrlEl) invitationUrlEl.value = window.location.href;
}

function getGoogleSheetsEndpoint(){
  return String(cfg.googleSheetsEndpoint || "").trim();
}

async function submitToGoogleSheets(formData){
  const endpoint = getGoogleSheetsEndpoint();
  if(!endpoint) throw new Error("GOOGLE_SHEETS_ENDPOINT_MISSING");

  // Apps Script Web App thường không trả CORS headers cho static website.
  // mode:no-cors vẫn gửi đầy đủ POST data sang Google Sheets mà không chuyển trang.
  await fetch(endpoint, {
    method: "POST",
    mode: "no-cors",
    body: formData
  });
}

async function submitToLegacyEndpoint(formData){
  const endpoint = String(cfg.rsvpEndpoint || "").trim();
  if(!endpoint) throw new Error("LEGACY_ENDPOINT_MISSING");

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
    headers: {Accept: "application/json"}
  });

  if(!response.ok) throw new Error("LEGACY_ENDPOINT_FAILED");
}

if(destinationEl){
  destinationEl.textContent = getGoogleSheetsEndpoint()
    ? ""
    : "Chưa kết nối Google Sheets. Hãy dán URL Apps Script Web App vào config.js.";
}

if(form && statusEl){
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    updateGuestRequirement();
    if(!form.reportValidity()) return;

    fillSubmissionMetadata();
    statusEl.textContent = "Đang gửi xác nhận...";
    statusEl.classList.remove("success", "error");
    setSubmitState(true);

    const data = new FormData(form);
    data.set("phone", form.querySelector('[name="phone"]')?.value.trim() || "");
    data.set("guestSide", form.querySelector('[name="guestSide"]:checked')?.value || "");
    data.set("guestCount", guestCountEl?.disabled ? "0" : (guestCountEl?.value || ""));
    data.set("groom", cfg.groomDisplay || cfg.groom || "");
    data.set("bride", cfg.brideDisplay || cfg.bride || "");
    data.set("eventDate", cfg.eventDate || cfg.dateText || "");
    data.set("eventTime", cfg.eventTimeShort || cfg.ceremonyTimeShort || "");
    data.set("venue", cfg.venueName || "");
    data.set("sheetTab", cfg.googleSheetsTabName || "RSVP");

    try{
      if(getGoogleSheetsEndpoint()){
        await submitToGoogleSheets(data);
      }else if(String(cfg.rsvpEndpoint || "").trim()){
        await submitToLegacyEndpoint(data);
      }else{
        throw new Error("NO_RSVP_ENDPOINT");
      }

      statusEl.textContent = "Đã gửi xác nhận. Cảm ơn bạn! ♡";
      statusEl.classList.add("success");
      form.reset();
      updateGuestRequirement();
      fillSubmissionMetadata();
    }catch(err){
      console.error(err);
      if(err?.message === "GOOGLE_SHEETS_ENDPOINT_MISSING" || err?.message === "NO_RSVP_ENDPOINT"){
        statusEl.textContent = "Chưa kết nối Google Sheets. Hãy dán URL Apps Script Web App vào config.js.";
      }else{
        statusEl.textContent = "Chưa gửi được. Vui lòng thử lại.";
      }
      statusEl.classList.add("error");
    }finally{
      setSubmitState(false);
    }
  });
}

