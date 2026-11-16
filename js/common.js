// Wspólne dla wyglądów: działy, dane, sortowanie, liczniki, ustawienia, wybór ekranu

// Droga do głównego folderu (atrybut data-root na <body>, np. "../" w podfolderze)
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

// Działy: nazwa zakładki, skrót nośnika, dane i odmiana licznika
const DZIALY = {
  winyle: { nazwa: "Winyle", skrot: "LP", dane: () => WINYLE, slowa: ["album", "albumy", "albumów"] },
  kasety: { nazwa: "Kasety", skrot: "MC", dane: () => KASETY, slowa: ["kaseta", "kasety", "kaset"] },
  cd:     { nazwa: "CD",     skrot: "CD", dane: () => CD,     slowa: ["płyta CD", "płyty CD", "płyt CD"] },
};

// Albumy działu; brak pliku z danymi daje pusty dział zamiast błędu
function daneDzialu(key) {
  try {
    const lista = DZIALY[key].dane();
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

// Liczba z odmianą, np. "1 kaseta", "3 kasety", "5 kaset"
function odmiana(n, [one, few, many]) {
  const forma = new Intl.PluralRules("pl").select(n);
  return `${n} ${forma === "one" ? one : forma === "few" ? few : many}`;
}

// Kolor zastępczej okładki: ten sam tytuł zawsze dostaje ten sam kolor z palety
function kolorDla(text, paleta) {
  let sum = 0;
  for (const ch of text) sum = (sum * 31 + ch.charCodeAt(0)) >>> 0;
  return paleta[sum % paleta.length];
}

// Sortowanie ("ok. 1975" liczy się jak 1975, brak roku na końcu)
const rok = a => parseInt(String(a.info?.Rok ?? "").match(/\d{4}/)?.[0]) || 9999;
const poWykonawcy = (a, b) => a.artist.localeCompare(b.artist, "pl") || a.title.localeCompare(b.title, "pl");

const SORTY = {
  kolejnosc: null,
  tytul:     (a, b) => a.title.localeCompare(b.title, "pl"),
  artysta:   poWykonawcy,
  rok:       (a, b) => rok(a) - rok(b)
};

function posortuj(albumy, sort) {
  return SORTY[sort] ? [...albumy].sort(SORTY[sort]) : albumy;
}

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

// Klucze włączonych działów w stałej kolejności
function wlaczoneDzialy() {
  const ukryte = wczytajUkryte();
  return Object.keys(DZIALY).filter(key => !ukryte.includes(key));
}

// Ekran z adresu po "#": lista, dział albo ustawienia.
// Pusty adres, nieznany albo wyłączony dział daje listę.
function ekranZAdresu() {
  const cel = location.hash.slice(1);
  if (cel === "ustawienia") return { ekran: "ustawienia", dzial: null };
  if (cel in DZIALY && wlaczoneDzialy().includes(cel)) return { ekran: "dzial", dzial: cel };
  return { ekran: "lista", dzial: null };
}
