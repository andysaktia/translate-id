/* Panggilan API MyMemory dan alur terjemahan */
async function callAPI(q, lang){
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try{
    const res = await fetch(`${API}?q=${encodeURIComponent(q)}&langpair=${lang}|id` + (getEmail() ? `&de=${encodeURIComponent(getEmail())}` : ""), { signal: ctl.signal });
    if (res.status === 429) throw quotaOut();
    if (!res.ok) throw new Error("Server terjemahan tidak merespons (" + res.status + ").");
    return await res.json();
  }catch(e){
    if (e.name === "AbortError") throw new Error("Server terjemahan terlalu lama merespons.");
    if (e instanceof TypeError) throw new Error("Tidak bisa terhubung ke server terjemahan. Periksa koneksi internet.");
    if (e instanceof SyntaxError) throw new Error("Balasan server terjemahan tidak valid.");
    throw e;
  }finally{ clearTimeout(timer); }
}
async function translateChunk(q, lang){
  const key = lang + "|" + q, hit = cache.get(key);
  if (hit) return hit;                             // dari cache: tidak memakai kuota
  syncDay();
  if (Q.finished) throw quotaOut();
  const data = await callAPI(q, lang);
  if (Number(data.responseStatus) === 429 || data.quotaFinished === true ||
      /MYMEMORY WARNING/i.test(data.responseData?.translatedText || "")) throw quotaOut();
  if (Number(data.responseStatus) !== 200 || !data.responseData) throw new Error(data.responseDetails || "Terjemahan gagal.");
  const out = decode(data.responseData.translatedText);
  Q.used += q.length; saveQuota();
  cache.set(key, out);                             // simpan per potongan: kalau potongan berikutnya gagal, yang sudah jadi tidak hilang
  return out;
}
async function translate(text, lang = detectLang(text)){
  const parts = [];
  for (const c of splitText(prep(text, lang))) parts.push(await translateChunk(c, lang));
  return parts.join(" ");
}
// Perkiraan karakter yang masih harus dikirim ke API (potongan yang belum ada di cache)
const uncached = (text, lang) => splitText(prep(text, lang)).filter(c => !cache.get(lang + "|" + c)).reduce((a, c) => a + c.length, 0);
