/* Render artikel dan tombol terjemah per paragraf */
// ====== Render artikel ======
document.getElementById("hint").innerHTML = ICON + "<span>Ketuk ikon di akhir paragraf, atau blok teks, untuk menerjemahkan ke Indonesia. Bahasa asal dikenali otomatis.</span>";
const article = document.getElementById("article");
let paras = [], gen = 0;

function addPara(text){
  const lang = detectLang(text), id = "tr" + paras.length;
  const box = document.createElement("div"); box.className = "para";
  const p = document.createElement("p"); p.className = "en"; p.lang = lang; p.dir = lang === "he" ? "rtl" : "ltr";

  // Ikon menempel di kata terakhir, jadi tidak pernah jatuh sendirian di baris baru
  const i = text.lastIndexOf(" ");
  const nw = document.createElement("span"); nw.className = "nw";
  const btn = document.createElement("button"); btn.type = "button"; btn.className = "tbtn";
  btn.setAttribute("aria-controls", id); btn.setAttribute("aria-expanded", "false");
  nw.append(text.slice(i + 1), btn);
  p.append(text.slice(0, i + 1), nw);

  const wrap = document.createElement("div"); wrap.className = "trwrap"; wrap.id = id; wrap.setAttribute("aria-live", "polite");
  const inner = document.createElement("div"); inner.className = "trin";
  const tr = document.createElement("div"); tr.className = "tr"; tr.lang = "id"; tr.dir = "ltr";
  inner.append(tr); wrap.append(inner); box.append(p, wrap); article.append(box);

  const setBtn = (label, html, state) => { btn.setAttribute("aria-label", label); btn.title = label; btn.innerHTML = html; btn.dataset.state = state; };
  const setOpen = o => { wrap.classList.toggle("open", o); btn.setAttribute("aria-expanded", String(o)); };
  const idleLabel = "Terjemahan dari " + LANG[lang];
  setBtn("Terjemahkan dari " + LANG[lang], ICON, "idle");

  let done = false, busy = false;
  async function load(){                           // true bila terjemahan tersedia
    if (done) return true;
    if (busy) return false;
    busy = true; btn.disabled = true; setBtn("Menerjemahkan...", '<span class="spin"></span>', "loading");
    try{
      tr.className = "tr"; tr.textContent = await translate(text, lang);
      done = true; setOpen(true); setBtn(idleLabel, ICON, "done");
    }catch(err){
      tr.className = "tr error"; tr.textContent = err.message + " Ketuk ikon untuk mencoba lagi.";
      wrap.classList.add("open"); setBtn("Coba terjemahkan lagi", ICON, "error");
    }
    busy = false; btn.disabled = false;
    return done;
  }
  btn.addEventListener("click", () => { if (done) setOpen(!wrap.classList.contains("open")); else load(); });
  paras.push({ load, done: () => done, pending: () => done ? 0 : uncached(text, lang) });
}
function render(sections){
  gen++; article.textContent = ""; paras = [];
  sections.forEach(sec => {
    if (sec.title){ const h = document.createElement("h2"); h.className = "sec"; h.textContent = sec.title; article.append(h); }
    sec.items.forEach(addPara);
  });
  setAvg(sections.flatMap(sec => sec.items));
  renderQuota();
}
