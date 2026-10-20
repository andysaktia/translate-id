/* Terjemahkan semua dan tempel teks sendiri */
// ====== Terjemahkan semua ======
const allBtn = $("allBtn"), allMsg = $("allMsg");
let allRun = false, stopAll = false;
allBtn.addEventListener("click", async () => {
  if (allRun){ stopAll = true; return; }
  const todo = paras.filter(p => !p.done());
  if (!todo.length){ allMsg.textContent = "Semua paragraf sudah diterjemahkan."; return; }
  syncDay();
  const need = todo.reduce((a, p) => a + p.pending(), 0), left = Math.max(0, limit() - Q.used);
  if (need > left && !confirm("Perkiraan butuh " + fmt(need) + " karakter, sisa kuota " + fmt(left) + ". Proses berhenti saat kuota habis. Lanjutkan?")) return;
  const g = gen; allRun = true; stopAll = false; allBtn.textContent = "Hentikan";
  let n = 0;
  for (const p of todo){
    if (stopAll || g !== gen) break;
    allMsg.textContent = "Menerjemahkan " + (++n) + " dari " + todo.length + "...";
    if (!await p.load()) break;
  }
  allRun = false; allBtn.textContent = "Terjemahkan semua";
  if (g !== gen){ allMsg.textContent = ""; return; }
  const rest = paras.filter(p => !p.done()).length;
  allMsg.textContent = rest ? "Berhenti. " + rest + " paragraf belum diterjemahkan." : "Selesai.";
});

// ====== Teks sendiri ======
const h1 = document.querySelector("h1"), subEl = document.querySelector(".sub");
const DEMO = { h1: h1.textContent, sub: subEl.textContent };
const ownBtn = $("ownBtn"), ownBox = $("ownBox"), ownText = $("ownText"), ownMsg = $("ownMsg"), demoBtn = $("demoBtn");
ownBtn.addEventListener("click", () => {
  const open = ownBox.hidden; ownBox.hidden = !open; ownBtn.setAttribute("aria-expanded", String(open));
  if (open) ownText.focus();
});
$("loadBtn").addEventListener("click", () => {
  const raw = ownText.value.replace(/\r/g, "").trim();
  if (!raw){ ownMsg.textContent = "Tempel teks dulu."; return; }
  if (raw.length > 60000){ ownMsg.textContent = "Teks terlalu panjang (maksimal 60.000 karakter)."; return; }
  let items = raw.split(/\n\s*\n+/).map(t => t.replace(/\s+/g, " ").trim()).filter(Boolean);
  if (items.length === 1 && raw.includes("\n")) items = raw.split("\n").map(t => t.trim()).filter(Boolean);   // satu baris per ayat
  h1.textContent = "Teks Anda"; subEl.textContent = "Teks yang Anda tempel. Bahasa terdeteksi otomatis";
  render([{ title: null, items }]);
  allMsg.textContent = ownMsg.textContent = ""; demoBtn.hidden = false; ownBox.hidden = true; ownBtn.setAttribute("aria-expanded", "false");
});
demoBtn.addEventListener("click", () => {
  h1.textContent = DEMO.h1; subEl.textContent = DEMO.sub; render(SECTIONS); allMsg.textContent = ""; demoBtn.hidden = true;
});
