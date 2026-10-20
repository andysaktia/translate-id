/* Pengaturan: email opsional untuk menaikkan kuota */
const setBtn_ = $("setBtn"), setBox = $("setBox"), emailIn = $("emailIn"), setMsg = $("setMsg");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
emailIn.value = getEmail();
setBtn_.addEventListener("click", () => {
  const open = setBox.hidden; setBox.hidden = !open; setBtn_.setAttribute("aria-expanded", String(open));
  if (open) emailIn.focus();
});
$("saveSet").addEventListener("click", () => {
  const v = emailIn.value.trim();
  if (v && !EMAIL_RE.test(v)){ setMsg.textContent = "Format email tidak valid."; return; }
  setEmail(v);
  setMsg.textContent = v ? "Tersimpan. Batas harian menjadi 50.000 karakter." : "Email dihapus. Batas harian kembali 5.000 karakter.";
  renderQuota();
});
