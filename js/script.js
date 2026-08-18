const cfg = window.WEDDING_CONFIG || {};

function setText(selector, value){
  if(value === undefined || value === null || value === "") return;
  document.querySelectorAll(selector).forEach(el => el.textContent = value);
}

setText("[data-opening-groom]", cfg.openingGroom);
setText("[data-opening-bride]", cfg.openingBride);
setText("[data-groom-display]", cfg.groomDisplay);
setText("[data-bride-display]", cfg.brideDisplay);
setText("[data-groom-signature]", cfg.groomSignature);
setText("[data-bride-signature]", cfg.brideSignature);
setText("[data-groom-role]", cfg.groomRole);
setText("[data-bride-role]", cfg.brideRole);

setText("[data-date-dots]", cfg.dateDots);
setText("[data-weekday]", cfg.weekday);
setText("[data-weekday-title]", cfg.weekdayTitle);
setText("[data-day]", cfg.day);
setText("[data-month]", cfg.month);
setText("[data-month-short]", cfg.monthShort);
setText("[data-year]", cfg.year);
setText("[data-hero-time]", cfg.heroTime);

setText("[data-ceremony-title]", cfg.ceremonyTitle);
setText("[data-event-date]", cfg.ceremonyDate);
setText("[data-ceremony-time-long]", cfg.ceremonyTimeLong);
setText("[data-ceremony-home-note]", cfg.ceremonyHomeNote);
setText("[data-lunar-date]", cfg.lunarDate);

setText("[data-groom-father]", cfg.groomFather);
setText("[data-groom-mother]", cfg.groomMother);
setText("[data-groom-address]", cfg.groomAddress);
setText("[data-bride-father]", cfg.brideFather);
setText("[data-bride-mother]", cfg.brideMother);
setText("[data-bride-address]", cfg.brideAddress);

setText("[data-event-card-title]", cfg.eventCardTitle);
setText("[data-venue-short]", cfg.venueShort);
setText("[data-event-hall]", cfg.eventHall);
setText("[data-event-time]", cfg.eventTime);
setText("[data-venue-name]", cfg.venueName);
setText("[data-venue-address]", cfg.venueAddress);

setText("[data-timeline1-time]", cfg.timeline1Time);
setText("[data-timeline1-label]", cfg.timeline1Label);
setText("[data-timeline2-time]", cfg.timeline2Time);
setText("[data-timeline2-label]", cfg.timeline2Label);
setText("[data-timeline3-time]", cfg.timeline3Time);
setText("[data-timeline3-label]", cfg.timeline3Label);
setText("[data-music-title]", cfg.musicTitle);
setText("[data-quote]", cfg.quote);

/* map */
const mapButton = document.getElementById("mapButton");
const mapFrame = document.getElementById("mapFrame");
if(mapButton && cfg.mapUrl) mapButton.href = cfg.mapUrl;
if(mapFrame && cfg.mapEmbedUrl) mapFrame.src = cfg.mapEmbedUrl;

/* calendar */
function buildCalendar(){
  const el = document.getElementById("calendarDays");
  if(!el) return;
  el.innerHTML = "";
  const firstDay = new Date(2026,9,1).getDay(); // Thu
  const offset = (firstDay + 6) % 7; // Monday-first
  for(let i=0;i<offset;i++){
    const blank=document.createElement("span");
    el.appendChild(blank);
  }
  for(let d=1; d<=31; d++){
    const cell=document.createElement("span");
    cell.textContent=d;
    if(d===25) cell.classList.add("wedding-day");
    el.appendChild(cell);
  }
}
buildCalendar();

/* reveal animations */
document.querySelectorAll(".site-shell section").forEach(section=>{
  section.querySelectorAll("[data-reveal]").forEach((el,i)=>{
    el.style.transitionDelay = `${Math.min(i*0.055,0.28)}s`;
  });
});

if("IntersectionObserver" in window){
  const revealObserver = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },{threshold:.1,rootMargin:"0px 0px -4% 0px"});
  document.querySelectorAll("[data-reveal]").forEach(el=>revealObserver.observe(el));

  const profileObserver = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("profile-in");
        profileObserver.unobserve(entry.target);
      }
    });
  },{threshold:.15});
  document.querySelectorAll(".profile-section").forEach(el=>profileObserver.observe(el));
}else{
  document.querySelectorAll("[data-reveal]").forEach(el=>el.classList.add("is-visible"));
  document.querySelectorAll(".profile-section").forEach(el=>el.classList.add("profile-in"));
}

/* music */
const music = document.getElementById("weddingMusic");
const musicFloat = document.getElementById("musicFloat");
const inlinePlay = document.getElementById("inlinePlay");
const progress = document.getElementById("musicProgress");
const currentTimeEl = document.getElementById("currentTime");
const durationTimeEl = document.getElementById("durationTime");
const recordPhoto = document.querySelector(".record-photo");
const miniPlayer = document.querySelector(".mini-player");

function fmt(sec){
  if(!Number.isFinite(sec)) return "0:00";
  const m=Math.floor(sec/60);
  const s=Math.floor(sec%60).toString().padStart(2,"0");
  return `${m}:${s}`;
}
function syncMusicUI(){
  const playing = music && !music.paused;
  recordPhoto?.classList.toggle("is-spinning", playing);
  miniPlayer?.classList.toggle("playing", playing);
  if(inlinePlay) inlinePlay.textContent = playing ? "Ⅱ" : "▶";
  if(musicFloat) musicFloat.textContent = playing ? "♫" : "♪";
}
async function playMusic(){
  if(!music) return;
  try{await music.play();syncMusicUI()}catch(e){syncMusicUI()}
}
function toggleMusic(){
  if(!music) return;
  if(music.paused) playMusic(); else {music.pause();syncMusicUI()}
}
musicFloat?.addEventListener("click",toggleMusic);

document.querySelectorAll("[data-music-action]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const action=btn.dataset.musicAction;
    if(action==="toggle") toggleMusic();
    if(action==="back") music.currentTime=Math.max(0,music.currentTime-10);
    if(action==="forward") music.currentTime=Math.min(music.duration||music.currentTime+10,music.currentTime+10);
    if(action==="restart") music.currentTime=0;
    if(action==="shuffle" && Number.isFinite(music.duration)) music.currentTime=Math.random()*Math.max(1,music.duration-1);
  });
});
music?.addEventListener("loadedmetadata",()=>{
  durationTimeEl.textContent=fmt(music.duration);
});
music?.addEventListener("timeupdate",()=>{
  currentTimeEl.textContent=fmt(music.currentTime);
  if(Number.isFinite(music.duration) && music.duration>0){
    progress.value=String((music.currentTime/music.duration)*100);
  }
});
music?.addEventListener("play",syncMusicUI);
music?.addEventListener("pause",syncMusicUI);
progress?.addEventListener("input",()=>{
  if(Number.isFinite(music.duration)){
    music.currentTime=(Number(progress.value)/100)*music.duration;
  }
});

/* opening */
const opening=document.getElementById("opening");
const openInvitation=document.getElementById("openInvitation");
openInvitation?.addEventListener("click",async()=>{
  opening?.classList.add("hidden");
  document.body.classList.remove("locked");
  await playMusic();
  startPetals();
});

/* countdown */
const target = new Date(cfg.weddingDate || "2026-10-25T12:00:00").getTime();
function updateCountdown(){
  const diff=Math.max(target-Date.now(),0);
  const d=Math.floor(diff/86400000);
  const h=Math.floor((diff%86400000)/3600000);
  const m=Math.floor((diff%3600000)/60000);
  const s=Math.floor((diff%60000)/1000);
  document.getElementById("days").textContent=String(d).padStart(3,"0");
  document.getElementById("hours").textContent=String(h).padStart(2,"0");
  document.getElementById("minutes").textContent=String(m).padStart(2,"0");
  document.getElementById("seconds").textContent=String(s).padStart(2,"0");
}
updateCountdown();
setInterval(updateCountdown,1000);

/* back to top */
document.getElementById("backToTop")?.addEventListener("click",()=>{
  window.scrollTo({top:0,behavior:"smooth"});
});

/* RSVP -> Google Apps Script */
const rsvpForm=document.getElementById("rsvpForm");
const formStatus=document.getElementById("formStatus");
const guestCount=document.getElementById("guestCount");
rsvpForm?.addEventListener("change",(e)=>{
  if(e.target.name==="attendance"){
    const coming=e.target.value==="Có";
    guestCount.disabled=!coming;
    if(!coming) guestCount.value="";
  }
});
rsvpForm?.addEventListener("submit",async(e)=>{
  e.preventDefault();
  const endpoint=(cfg.googleSheetsEndpoint||"").trim();
  const data=Object.fromEntries(new FormData(rsvpForm).entries());

  if(data.attendance==="Có" && !data.guestCount){
    formStatus.textContent="Vui lòng chọn số người tham dự.";
    return;
  }
  if(!endpoint){
    formStatus.textContent="RSVP chưa kết nối Google Sheets. Hãy dán Web App URL vào config.js.";
    return;
  }

  formStatus.textContent="Đang gửi...";
  const payload={
    ...data,
    submittedAt:new Date().toISOString(),
    groom:cfg.groomDisplay,
    bride:cfg.brideDisplay,
    eventDate:cfg.ceremonyDate,
    eventTime:cfg.eventTime,
    venue:cfg.venueName,
    pageUrl:location.href
  };

  try{
    await fetch(endpoint,{
      method:"POST",
      mode:"no-cors",
      headers:{"Content-Type":"text/plain;charset=utf-8"},
      body:JSON.stringify(payload)
    });
    formStatus.textContent="Đã gửi xác nhận. Cảm ơn bạn! ♥";
    rsvpForm.reset();
    guestCount.disabled=false;
  }catch(err){
    formStatus.textContent="Chưa gửi được. Vui lòng thử lại.";
  }
});

/* rose petals */
let petalTimer=null;
function startPetals(){
  const options=cfg.petalEffect||{};
  if(!options.enabled) return;
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if(petalTimer) return;

  const layer=document.getElementById("petalLayer");
  const max=options.maxPetals||10;

  function spawn(){
    if(document.hidden) return;
    if(layer.childElementCount>=max) return;
    const petal=document.createElement("i");
    const variants=["","alt","soft"];
    petal.className=`rose-petal ${variants[Math.floor(Math.random()*variants.length)]}`;
    petal.style.left=`${Math.random()*100}%`;
    petal.style.setProperty("--drift",`${-65+Math.random()*130}px`);
    const duration=(options.durationMin||10)+Math.random()*((options.durationMax||16)-(options.durationMin||10));
    petal.style.setProperty("--duration",`${duration}s`);
    petal.style.transform=`rotate(${Math.random()*180}deg)`;
    layer.appendChild(petal);
    setTimeout(()=>petal.remove(),(duration+1)*1000);
  }

  function schedule(){
    spawn();
    const min=options.spawnMin||760;
    const maxDelay=options.spawnMax||1250;
    petalTimer=setTimeout(schedule,min+Math.random()*(maxDelay-min));
  }
  schedule();
}
