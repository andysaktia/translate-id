/* Pelacak kuota harian (perkiraan, per browser) */
// ====== Pelacak kuota (perkiraan, disimpan per hari di browser ini) ======
let AVG = 1;
const setAvg = items => { AVG = Math.max(1, Math.round(items.reduce((a,t) => a + t.length, 0) / Math.max(1, items.length))); };
const today = () => new Date().toISOString().slice(0,10);
const fresh = () => ({ d: today(), used: 0, finished: false });
let Q = (() => { try{ const q = JSON.parse(localStorage.getItem("tr:quota")); if (q && q.d === today()) return q; }catch(e){} return fresh(); })();
const fmt = n => n.toLocaleString("id-ID");

const RING = 2 * Math.PI * 20;
let prevLevel = null, toastTimer = null;
function renderQuota(){
  const left = Math.max(0, limit() - Q.used);
  const pct = Q.finished ? 0 : Math.round(left / limit() * 100);
  const level = pct === 0 ? "out" : pct <= 15 ? "low" : pct <= 40 ? "warn" : "ok";
  const box = document.getElementById("quota"), fab = document.getElementById("qbtn");
  const label = level === "low" ? "Kuota hampir habis" : level === "out" ? "Kuota habis hari ini" : "Kuota terjemahan hari ini";
  box.dataset.level = level;
  document.getElementById("qring").style.strokeDashoffset = RING * (1 - pct / 100);
  const val = document.getElementById("qval");
  if (val.textContent !== pct + "%"){ val.textContent = pct + "%"; fab.classList.remove("bump"); void fab.offsetWidth; fab.classList.add("bump"); }
  fab.setAttribute("aria-label", level === "out" ? "Kuota terjemahan habis hari ini" : "Kuota terjemahan: " + pct + "% tersisa");
  document.getElementById("qlabel").textContent = label;
  document.getElementById("qdetail").innerHTML = level === "out"
    ? "<p><strong>Kuota harian habis.</strong> Terjemahan baru bisa dicoba lagi besok.</p><p>Paragraf yang sudah pernah diterjemahkan tetap bisa dibuka karena tersimpan di browser.</p>"
    : "<p>Terpakai <strong>" + fmt(Q.used) + "</strong> dari " + fmt(limit()) + " karakter. Cukup untuk sekitar <strong>" + fmt(Math.floor(left / AVG)) + " paragraf</strong> lagi.</p>"
      + "<p>Terjemahan yang pernah dibuka diambil dari browser dan tidak memakai kuota. Angka ini perkiraan dari perangkat ini.</p>";
  // Peringatan singkat saat kuota memasuki level hampir habis / habis
  if (prevLevel && prevLevel !== level && (level === "low" || level === "out")){
    const t = document.getElementById("qtoast");
    t.textContent = label; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 4000);
  }
  prevLevel = level;
}
function saveQuota(){ try{ localStorage.setItem("tr:quota", JSON.stringify(Q)); }catch(e){} renderQuota(); }
function quotaOut(){ Q.finished = true; saveQuota(); return new Error("Kuota terjemahan hari ini sudah habis. Coba lagi besok."); }

const qbox = document.getElementById("quota"), qbtn = document.getElementById("qbtn");
const setQ = open => { qbox.classList.toggle("open", open); qbtn.setAttribute("aria-expanded", String(open)); };
qbtn.addEventListener("click", () => setQ(!qbox.classList.contains("open")));
document.addEventListener("pointerdown", e => { if (!qbox.contains(e.target)) setQ(false); });
document.addEventListener("keydown", e => { if (e.key === "Escape") setQ(false); });

renderQuota();

// Ganti hari (UTC) tanpa perlu memuat ulang halaman
function syncDay(){ if (Q.d !== today()){ Q = fresh(); saveQuota(); } }
document.addEventListener("visibilitychange", () => { if (!document.hidden) syncDay(); });
