// Kolory zastępczych okładek: ten sam tytuł zawsze dostaje ten sam kolor
const PLAIN_COLORS = [
  "#000080", "#800000", "#008080", "#808000",
  "#006400", "#000000", "#404040", "#8b4513"
];

function colorFor(text) {
  let sum = 0;
  for (const ch of text) sum = (sum * 31 + ch.charCodeAt(0)) >>> 0;
  return PLAIN_COLORS[sum % PLAIN_COLORS.length];
}

// Tworzy element z klasą i tekstem
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// Adres artysty do linku, np. "Łąka Żółć" -> "laka-zolc"
function slug(text) {
  return text.toLowerCase()
    .normalize("NFD").replace(/\p{M}/gu, "")
    .replace(/ł/g, "l")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "") || "artysta";
}

// Zastępcza okładka: kolor i tytuł (brak okładki albo błąd wczytania)
function placeholder(cover, album) {
  cover.textContent = "";
  cover.style.backgroundColor = colorFor(album.title);
  cover.appendChild(el("span", "cover-title", album.title));
}

// Jeden kwadrat albumu: okładka, tytuł, artysta, tabelka info, notatka
function renderAlbum(album) {
  const item = el("div", "album");

  const cover = el("div", "cover");
  if (album.cover) {
    const img = document.createElement("img");
    img.src = album.cover;
    img.alt = `Okładka: ${album.title}, ${album.artist}`;
    img.loading = "lazy";
    img.onerror = () => placeholder(cover, album);
    cover.appendChild(img);
  } else {
    placeholder(cover, album);
  }
  item.appendChild(cover);

  item.appendChild(el("h2", "title", album.title));
  item.appendChild(el("p", "artist", album.artist));

  if (album.info && Object.keys(album.info).length) {
    const table = el("table", "info");
    for (const [key, value] of Object.entries(album.info)) {
      const row = document.createElement("tr");
      row.appendChild(el("td", "", key));
      row.appendChild(el("td", "", value));
      table.appendChild(row);
    }
    item.appendChild(table);
  }

  if (album.note) item.appendChild(el("p", "note", album.note));

  return item;
}

// Pozycja listy w menu
function menuItem(child) {
  const li = document.createElement("li");
  li.appendChild(child);
  return li;
}

// Działy: nazwa zakładki, strona, dane i odmiana licznika
const DZIALY = {
  winyle: { nazwa: "Winyle", strona: "index.html",  dane: () => WINYLE, slowa: ["album", "albumy", "albumów"] },
  kasety: { nazwa: "Kasety", strona: "kasety.html", dane: () => KASETY, slowa: ["kaseta", "kasety", "kaset"] },
};
const DZIAL = DZIALY[document.body.dataset.dzial] ? document.body.dataset.dzial : "winyle";
const ALBUMS = DZIALY[DZIAL].dane();

// Zakładki działów
const tabs = document.getElementById("tabs");
Object.entries(DZIALY).forEach(([key, d]) => {
  const tab = el(key === DZIAL ? "b" : "a", "tab", d.nazwa);
  if (key !== DZIAL) tab.href = d.strona + location.search;
  tabs.appendChild(tab);
});

// Sortowanie
const year = a => parseInt(String(a.info?.Rok ?? "").match(/\d{4}/)?.[0]) || 9999;

const SORTS = {
  kolejnosc: { label: "kolejności dodania", fn: null },
  tytul:     { label: "tytułu",  fn: (a, b) => a.title.localeCompare(b.title, "pl") },
  artysta:   { label: "artysty", fn: (a, b) => a.artist.localeCompare(b.artist, "pl") || a.title.localeCompare(b.title, "pl") },
  rok:       { label: "roku",    fn: (a, b) => year(a) - year(b) }
};

// Menu sortowania: aktywna opcja pogrubiona, pozostałe to linki
const params = new URLSearchParams(location.search);
const current = SORTS[params.get("sortuj")] ? params.get("sortuj") : "kolejnosc";

const sortList = document.getElementById("sort");
Object.entries(SORTS).forEach(([key, s]) => {
  const item = el(key === current ? "b" : "a", "", s.label);
  if (key !== current) item.href = key === "kolejnosc" ? "?" : `?sortuj=${key}`;
  sortList.appendChild(menuItem(item));
});

// Numerowanie albumów (album-1, album-2…) według kolejności w pliku danych, potem sortowanie
const numbered = ALBUMS.map((a, i) => ({ ...a, id: `album-${i + 1}` }));
const albums = SORTS[current].fn ? [...numbered].sort(SORTS[current].fn) : numbered;

// Spis artystów alfabetycznie; każdy dostaje unikalny adres (np. "AC/DC" i "AC DC" różne)
const artists = [...new Set(ALBUMS.map(a => a.artist))].sort((a, b) => a.localeCompare(b, "pl"));
const artistIds = new Map();
artists.forEach(name => {
  let id = slug(name), i = 2;
  while ([...artistIds.values()].includes(id)) id = `${slug(name)}-${i++}`;
  artistIds.set(name, id);
});

// Rysowanie albumów
const list = document.getElementById("albums");
albums.forEach(a => {
  const node = renderAlbum(a);
  node.id = a.id;
  node.dataset.artist = artistIds.get(a.artist);
  list.appendChild(node);
});

// Menu artystów
const indexList = document.getElementById("index");
artists.forEach(name => {
  const a = el("a", "", name);
  a.href = `#${artistIds.get(name)}`;
  indexList.appendChild(menuItem(a));
});

// Podświetlanie albumów wskazanych w adresie: #artysta albo #album-N
function highlight() {
  let target = location.hash.slice(1);
  try { target = decodeURIComponent(target); } catch {}
  document.querySelectorAll(".album").forEach(node => {
    const match = target !== "" &&
      (node.id === target || node.dataset.artist === target);
    node.classList.toggle("wybrany", match);
  });
}
highlight();
window.addEventListener("hashchange", highlight);

// Licznik
const n = ALBUMS.length;
const [one, few, many] = DZIALY[DZIAL].slowa;
const word = { one, few }[new Intl.PluralRules("pl").select(n)] ?? many;
document.getElementById("count").textContent = `${n} ${word}`;

// Wyłączone animacje w systemie zatrzymują przewijany napis
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const m = document.getElementById("marquee");
  if (m && m.stop) m.stop();
}
