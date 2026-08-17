const cfg = window.WEDDING_CONFIG || {};

function setText(selector, value){
  if(value === undefined || value === null || value === "") return;
  document.querySelectorAll(selector).forEach(el => { el.textContent = value; });
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
setText("[data-timeline-title]", cfg.timelineTitle);
setText("[data-timeline1-time]", cfg.timeline1Time);
setText("[data-timeline1-label]", cfg.timeline1Label);
setText("[data-timeline2-time]", cfg.timeline2Time);
setText("[data-timeline2-label]", cfg.timeline2Label);
setText("[data-timeline3-time]", cfg.timeline3Time);
setText("[data-timeline3-label]", cfg.timeline3Label);
setText("[data-quote]", cfg.quote);
setText("[data-memory-caption-1]", cfg.memoryCaption1);
setText("[data-memory-caption-2]", cfg.memoryCaption2);

if(cfg.countdownNote){
  document.querySelectorAll("[data-countdown-note]").forEach(el => {
    el.innerHTML = String(cfg.countdownNote).split("\n").map(line => line.replace(/</g,"&lt;")).join("<br>");
  });
}

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
  if(inlinePlay) inlinePlay.textContent = playing ? "❚❚" : "▶";
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
   HIỆU ỨNG KHI CUỘN — tách từng element thay vì cả section
   ========================================================= */
if("IntersectionObserver" in window){
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.22,rootMargin:"0px 0px -8% 0px"});

  document.querySelectorAll("[data-reveal]").forEach(el => {
    observer.observe(el);
  });
}else{
  document.querySelectorAll("[data-reveal]").forEach(el => el.classList.add("is-visible"));
}

/* =========================================================
   BACK TO TOP
   ========================================================= */
backToTop?.addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));

/* =========================================================
   RSVP
   ========================================================= */
const form = document.getElementById("rsvpForm");
const statusEl = document.getElementById("rsvpStatus");

if(form && statusEl){
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "Đang gửi...";
    const endpoint = (cfg.rsvpEndpoint || "").trim();

    if(!endpoint){
      statusEl.textContent = "Form đang ở chế độ mẫu. Hãy dán endpoint Formspree vào js/config.js.";
      return;
    }

    try{
      const response = await fetch(endpoint,{
        method:"POST",
        body:new FormData(form),
        headers:{Accept:"application/json"}
      });

      if(response.ok){
        form.reset();
        statusEl.textContent = "Đã gửi xác nhận. Cảm ơn bạn! ♡";
      }else{
        statusEl.textContent = "Chưa gửi được. Vui lòng thử lại.";
      }
    }catch(err){
      statusEl.textContent = "Lỗi kết nối. Vui lòng thử lại.";
    }
  });
}
