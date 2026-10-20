/* Konfigurasi, konstanta, dan helper DOM */
const ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>';

const LANG = { en: "Inggris", he: "Ibrani" };

const API = "https://api.mymemory.translated.net/get";
const MAX_BYTES = 450;                 // batas MyMemory ±500 byte per request (huruf Ibrani = 2 byte)
const TIMEOUT_MS = 15000;
const CACHE_PREFIX = "tr:v2:to-id:", CACHE_MAX = 400, IDX = CACHE_PREFIX + "#idx";

// Email (opsional) disimpan di browser pengguna, bukan di kode.
// Email valid menaikkan kuota harian MyMemory dari 5.000 menjadi 50.000 karakter.
const EMAIL_KEY = "tr:email";
const getEmail = () => { try{ return (localStorage.getItem(EMAIL_KEY) || "").trim(); }catch(e){ return ""; } };
const setEmail = v => { try{ v ? localStorage.setItem(EMAIL_KEY, v) : localStorage.removeItem(EMAIL_KEY); }catch(e){} };
const limit = () => getEmail() ? 50000 : 5000;   // batas harian MyMemory

const $ = id => document.getElementById(id);
