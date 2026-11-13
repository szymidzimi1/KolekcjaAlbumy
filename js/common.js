// Wspólne dla wszystkich stron: ścieżki, działy, ustawienia, zakładki

// Droga do głównego folderu: "" na index.html, "../" na stronach w pages/ (atrybut data-root)
const ROOT = document.body.dataset.root || "";

// Ścieżka z danych (np. "covers/plyta.jpg") liczona od głównego folderu
function sciezka(p) {
  return /^([a-z]+:|\/)/i.test(p) ? p : ROOT + p;
}

// Tworzy element z klasą i tekstem
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// Działy: nazwa zakładki, strona, dane i odmiana licznika
const DZIALY = {
  winyle: { nazwa: "Winyle", strona: "pages/winyle.html", dane: () => WINYLE, slowa: ["album", "albumy", "albumów"] },
  kasety: { nazwa: "Kasety", strona: "pages/kasety.html", dane: () => KASETY, slowa: ["kaseta", "kasety", "kaset"] },
};

// Działy wyłączone w ustawieniach, zapisane w przeglądarce (localStorage).
// Gdy zapis jest niedostępny albo uszkodzony, wszystkie działy są włączone.
const KLUCZ_UKRYTE = "ukryteDzialy";

function wczytajUkryte() {
  try {
    const lista = JSON.parse(localStorage.getItem(KLUCZ_UKRYTE));
    return Array.isArray(lista) ? lista.filter(k => k in DZIALY) : [];
  } catch {
    return [];
  }
}

function zapiszUkryte(ukryte) {
  try {
    localStorage.setItem(KLUCZ_UKRYTE, JSON.stringify(ukryte));
    return true;
  } catch {
    return false;
  }
}

// Włączone działy jako pary [klucz, dział]
function wlaczoneDzialy() {
  const ukryte = wczytajUkryte();
  return Object.entries(DZIALY).filter(([key]) => !ukryte.includes(key));
}

// Zakładki: Lista (zawsze), potem włączone działy; aktywna pogrubiona, pozostałe to linki
function rysujZakladki(aktywna) {
  const tabs = document.getElementById("tabs");
  tabs.textContent = "";
  const strony = [["lista", { nazwa: "Lista", strona: "index.html" }], ...wlaczoneDzialy()];
  strony.forEach(([key, s]) => {
    const tab = el(key === aktywna ? "b" : "a", "tab", s.nazwa);
    if (key !== aktywna) tab.href = ROOT + s.strona + (key === "lista" ? "" : location.search);
    tabs.appendChild(tab);
  });
}

// Komunikat z linkiem do ustawień (wyłączony dział albo wszystkie działy wyłączone)
function komunikatUstawien(tekst) {
  const info = el("p", "wylaczony", tekst + " ");
  const link = el("a", "", "Zmień ustawienia");
  link.href = ROOT + "pages/ustawienia.html";
  info.appendChild(link);
  return info;
}

// Wyłączone animacje w systemie zatrzymują przewijany napis
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const m = document.getElementById("marquee");
  if (m && m.stop) m.stop();
}
