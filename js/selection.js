/* Terjemahkan teks yang diblok (popover) */
// ====== Terjemahkan teks yang diblok ======
const selBtn = document.getElementById("sel");
selBtn.innerHTML = ICON + "<span>Terjemahkan</span>";
const pop = document.getElementById("pop"), popBody = document.getElementById("popBody");
let selText = "", selRect = null, keepSel = false, selTimer;

function placeBelow(el, r){                        // r memakai koordinat dokumen
  const w = el.offsetWidth || 150;
  let left = r.left + r.width / 2 - w / 2;
  left = Math.max(window.scrollX + 12, Math.min(left, window.scrollX + document.documentElement.clientWidth - w - 12));
  el.style.left = left + "px"; el.style.top = (r.bottom + 10) + "px";
}
function checkSelection(){
  const s = window.getSelection(), text = s ? s.toString().trim() : "";
  const inEn = n => n && article.contains(n) && !(n.parentElement && n.parentElement.closest(".trwrap"));
  if (!text || text.length < 3 || !s.rangeCount || !inEn(s.anchorNode) || !inEn(s.focusNode)){
    if (!keepSel) selBtn.style.display = "none";
    return;
  }
  const r = s.getRangeAt(0).getBoundingClientRect();
  selRect = { left: r.left + window.scrollX, width: r.width, bottom: r.bottom + window.scrollY };
  selText = text.replace(/\s+/g, " ");
  selBtn.style.display = "inline-flex";
  placeBelow(selBtn, selRect);
}
// selectionchange + debounce: lebih andal di layar sentuh (handle seleksi Android/iOS) daripada mouseup/touchend
document.addEventListener("selectionchange", () => { clearTimeout(selTimer); selTimer = setTimeout(checkSelection, 220); });
selBtn.addEventListener("pointerdown", () => { keepSel = true; setTimeout(() => { keepSel = false; }, 800); });

selBtn.addEventListener("mousedown", e => e.preventDefault());
selBtn.addEventListener("click", async () => {
  const rect = selRect, text = selText;
  if (!rect) return;
  selBtn.style.display = "none";
  popBody.className = "tr"; popBody.innerHTML = '<span class="spin"></span>';
  document.getElementById("popTitle").textContent = "Terjemahan dari " + LANG[detectLang(text)];
  pop.style.display = "block"; placeBelow(pop, rect);
  try{ popBody.textContent = await translate(text); }
  catch(err){ popBody.textContent = err.message; popBody.className = "tr error"; }
});

const closePop = () => { pop.style.display = "none"; };
pop.querySelector(".pop-close").addEventListener("click", closePop);
document.addEventListener("keydown", e => { if (e.key === "Escape") closePop(); });
document.addEventListener("mousedown", e => {
  if (!pop.contains(e.target) && e.target !== selBtn && !selBtn.contains(e.target)) closePop();
  if (!selBtn.contains(e.target) && !article.contains(e.target)) selBtn.style.display = "none";
});
