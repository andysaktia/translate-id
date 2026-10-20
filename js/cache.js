/* Cache terjemahan di localStorage */
// Cache per potongan teks, kunci = teks penuh (tanpa hash, jadi tidak ada tabrakan). Entri terlama dibuang bila penuh.
const cache = {
  idx(){ try{ return JSON.parse(localStorage.getItem(IDX)) || []; }catch(e){ return []; } },
  get(k){ try{ return localStorage.getItem(CACHE_PREFIX + k); }catch(e){ return null; } },
  set(k, v){
    try{
      const idx = this.idx().filter(x => x !== k); idx.push(k);
      while (idx.length > CACHE_MAX) localStorage.removeItem(CACHE_PREFIX + idx.shift());
      const put = () => localStorage.setItem(CACHE_PREFIX + k, v);
      try{ put(); }catch(e){
        while (idx.length > 1){ localStorage.removeItem(CACHE_PREFIX + idx.shift()); try{ put(); break; }catch(_){} }
      }
      localStorage.setItem(IDX, JSON.stringify(idx));
    }catch(e){}
  }
};
