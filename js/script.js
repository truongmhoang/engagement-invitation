const cfg = window.WEDDING_CONFIG || {};
const setText = (selector,value)=>{ if(value) document.querySelectorAll(selector).forEach(el=>el.textContent=value); };
setText('[data-groom]',cfg.groom);setText('[data-bride]',cfg.bride);setText('[data-date-text]',cfg.dateText);setText('[data-invitation]',cfg.invitationText);setText('[data-groom-parents]',cfg.groomParents);setText('[data-bride-parents]',cfg.brideParents);setText('[data-ceremony-title]',cfg.ceremonyTitle);setText('[data-ceremony-time]',cfg.ceremonyTime);setText('[data-ceremony-guest-time]',cfg.ceremonyGuestTime);setText('[data-venue-name]',cfg.venueName);setText('[data-venue-address]',cfg.venueAddress);setText('[data-story-text]',cfg.storyText);
document.title = `${cfg.groom || ''} & ${cfg.bride || ''} - Wedding Invitation`;

const opening=document.getElementById('opening');
const openButton=document.getElementById('openInvitation');
const music=document.getElementById('weddingMusic');
const musicToggle=document.getElementById('musicToggle');
const toTop=document.getElementById('toTop');
const mapButton=document.getElementById('mapButton');
if(cfg.mapUrl) mapButton.href=cfg.mapUrl;
document.body.classList.add('locked');
async function playMusic(){try{await music.play();musicToggle.classList.add('playing');musicToggle.textContent='♫';}catch(e){musicToggle.classList.remove('playing')}}
openButton.addEventListener('click',async()=>{opening.classList.add('hidden');document.body.classList.remove('locked');await playMusic();});
musicToggle.addEventListener('click',async()=>{if(music.paused){await playMusic()}else{music.pause();musicToggle.classList.remove('playing');musicToggle.textContent='♪'}});
toTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

const target=new Date(cfg.weddingDate).getTime();
function updateCountdown(){if(Number.isNaN(target))return;const safe=Math.max(target-Date.now(),0);const d=Math.floor(safe/86400000),h=Math.floor((safe%86400000)/3600000),m=Math.floor((safe%3600000)/60000),s=Math.floor((safe%60000)/1000);document.getElementById('days').textContent=String(d).padStart(3,'0');document.getElementById('hours').textContent=String(h).padStart(2,'0');document.getElementById('minutes').textContent=String(m).padStart(2,'0');document.getElementById('seconds').textContent=String(s).padStart(2,'0')}
updateCountdown();setInterval(updateCountdown,1000);

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.13,rootMargin:'0px 0px -6%'});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

function buildCalendar(){const wrap=document.getElementById('calendarDays');if(!wrap)return;const year=2026,month=9;const first=new Date(year,month,1);const start=(first.getDay()+6)%7;const days=new Date(year,month+1,0).getDate();for(let i=0;i<start;i++){const s=document.createElement('span');s.textContent='';wrap.appendChild(s)}for(let d=1;d<=days;d++){const s=document.createElement('span');s.textContent=d;if(d===25)s.className='wedding-day';wrap.appendChild(s)}}buildCalendar();

const form=document.getElementById('rsvpForm');const statusEl=document.getElementById('rsvpStatus');
form.addEventListener('submit',async e=>{e.preventDefault();statusEl.textContent='Đang gửi...';const endpoint=(cfg.rsvpEndpoint||'').trim();if(!endpoint){statusEl.textContent='Form đang ở chế độ mẫu. Hãy dán endpoint vào config.js.';return}try{const response=await fetch(endpoint,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});if(response.ok){form.reset();statusEl.textContent='Đã gửi xác nhận. Cảm ơn bạn! ♥'}else statusEl.textContent='Chưa gửi được. Vui lòng thử lại.'}catch(err){statusEl.textContent='Lỗi kết nối. Vui lòng thử lại.'}});
