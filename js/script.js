const cfg = window.WEDDING_CONFIG || {};

function setText(selector, value){
  if(value === undefined || value === null || value === "") return;
  document.querySelectorAll(selector).forEach(el => {
    el.textContent = value;
  });
}

function setMeta(property, value){
  if(!value) return;
  const el = document.querySelector(`meta[property="${property}"]`);
  if(el) el.setAttribute("content", value);
}

/* ===== ĐỔ DỮ LIỆU TỪ config.js RA WEBSITE ===== */
setText("[data-opening-title]", cfg.openingTitle);
setText("[data-groom]", cfg.groom);
setText("[data-bride]", cfg.bride);
setText("[data-groom-short]", cfg.groomShort || cfg.groom);
setText("[data-bride-short]", cfg.brideShort || cfg.bride);
setText("[data-guest-name]", cfg.guestName);
setText("[data-date-text]", cfg.dateText);
setText("[data-date-dotted]", cfg.dateDotted || cfg.dateText);
setText("[data-weekday]", cfg.weekday);
setText("[data-day]", cfg.day);
setText("[data-month-text]", cfg.monthText);
setText("[data-year]", cfg.year);
setText("[data-lunar-date]", cfg.lunarDate);
setText("[data-ceremony-title]", cfg.ceremonyTitle);
setText("[data-invitation]", cfg.invitationText);
setText("[data-ceremony-guest-time]", cfg.ceremonyGuestTime);
setText("[data-ceremony-time]", cfg.ceremonyTime);
setText("[data-groom-parents]", cfg.groomParents);
setText("[data-bride-parents]", cfg.brideParents);
setText("[data-groom-address]", cfg.groomAddress);
setText("[data-bride-address]", cfg.brideAddress);
setText("[data-venue-name]", cfg.venueName);
setText("[data-venue-address]", cfg.venueAddress);
setText("[data-story-text]", cfg.storyText);
setText("[data-quote]", cfg.quote);
setText("[data-countdown-note]", cfg.countdownNote);

if(Array.isArray(cfg.timeline)){
  cfg.timeline.slice(0,4).forEach((item,index) => {
    const n = index + 1;
    setText(`[data-timeline-${n}-time]`, item.time);
    setText(`[data-timeline-${n}-label]`, item.label);
  });
}

if(cfg.shareTitle) document.title = cfg.shareTitle;
setMeta("og:title", cfg.shareTitle);
setMeta("og:description", cfg.shareDescription);
setMeta("og:image", cfg.shareImage);

const mapButton = document.getElementById("mapButton");
if(mapButton && cfg.mapUrl) mapButton.href = cfg.mapUrl;

/* ===== MỞ THIỆP + NHẠC ===== */
const opening = document.getElementById("opening");
const openButton = document.getElementById("openInvitation");
const music = document.getElementById("weddingMusic");
const musicToggle = document.getElementById("musicToggle");

document.body.classList.add("locked");

async function playMusic(){
  if(!music || !musicToggle) return;
  try{
    await music.play();
    musicToggle.classList.add("playing");
    musicToggle.textContent = "♫";
  }catch(err){
    musicToggle.classList.remove("playing");
  }
}

if(openButton){
  openButton.addEventListener("click", async () => {
    if(opening) opening.classList.add("hidden");
    document.body.classList.remove("locked");
    await playMusic();
  });
}

if(musicToggle && music){
  musicToggle.addEventListener("click", async () => {
    if(music.paused){
      await playMusic();
    }else{
      music.pause();
      musicToggle.classList.remove("playing");
      musicToggle.textContent = "♪";
    }
  });
}

/* ===== COUNTDOWN ===== */
const target = new Date(cfg.weddingDate).getTime();
function updateCountdown(){
  if(Number.isNaN(target)) return;
  const safe = Math.max(target - Date.now(), 0);
  const d = Math.floor(safe / 86400000);
  const h = Math.floor((safe % 86400000) / 3600000);
  const m = Math.floor((safe % 3600000) / 60000);
  const s = Math.floor((safe % 60000) / 1000);

  const dayEl = document.getElementById("days");
  const hourEl = document.getElementById("hours");
  const minuteEl = document.getElementById("minutes");
  const secondEl = document.getElementById("seconds");

  if(dayEl) dayEl.textContent = String(d).padStart(3,"0");
  if(hourEl) hourEl.textContent = String(h).padStart(2,"0");
  if(minuteEl) minuteEl.textContent = String(m).padStart(2,"0");
  if(secondEl) secondEl.textContent = String(s).padStart(2,"0");
}
updateCountdown();
setInterval(updateCountdown,1000);

/* ===== HIỆU ỨNG KHI CUỘN ===== */
if("IntersectionObserver" in window){
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.10});

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}else{
  document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
}

/* ===== RSVP ===== */
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
