/* Util teks: deteksi bahasa, pembersihan nikud, pemecahan teks */
const decode = s => { const t = document.createElement("textarea"); t.innerHTML = s; return t.value; };

const enc = new TextEncoder();
const bytes = s => enc.encode(s).length;

// Deteksi bahasa dari aksara: huruf Ibrani lebih banyak dari huruf Latin -> "he", selain itu "en"
function detectLang(text){
  const he = (text.match(/[\u05D0-\u05EA]/g) || []).length;
  const la = (text.match(/[A-Za-z]/g) || []).length;
  return he > la ? "he" : "en";
}
// Buang nikud/ta'amim. Maqaf (U+05BE) jadi spasi supaya kata tidak menyatu; sof pasuq (U+05C3) jadi titik.
const stripNikud = s => s.replace(/\u05BE/g, " ").replace(/\u05C3/g, ".").replace(/[\u0591-\u05C7]/g, "");
const prep = (text, lang) => (lang === "he" ? stripNikud(text) : text).replace(/\s+/g, " ").trim();

// Pisah kalimat di spasi setelah . ! ? (angka seperti 3.5 tidak terpotong). Browser lama tanpa lookbehind: pisah per kata.
let SENT; try{ SENT = new RegExp("(?<=[.!?][\"'”’)\\]]*)\\s+"); }catch(e){ SENT = /\s+/; }
function splitText(text){
  const chunks = []; let cur = "";
  const flush = () => { if (cur) chunks.push(cur); cur = ""; };
  const fits = x => !cur || bytes(cur + " " + x) <= MAX_BYTES;
  const add = x => { cur = cur ? cur + " " + x : x; };
  for (const sen of text.split(SENT)){
    if (bytes(sen) > MAX_BYTES){                // kalimat sangat panjang: pecah per kata
      flush();
      for (const w of sen.split(/\s+/)){ if (!fits(w)) flush(); add(w); }
      flush(); continue;
    }
    if (!fits(sen)) flush();
    add(sen);
  }
  flush();
  return chunks;
}
