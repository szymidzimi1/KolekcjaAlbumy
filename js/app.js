// Jedna strona bez przeładowania: ekran wybiera adres po "#"
// (#lista, #winyle, #kasety, #cd, #ustawienia)

// Kolory zastępczych okładek
const PLAIN_COLORS = [
  "#000080", "#800000", "#008080", "#808000",
  "#006400", "#000000", "#404040", "#8b4513"
];

// Nazwy sortowań w menu
const NAZWY_SORTOW = {
  kolejnosc: "kolejności dodania",
  tytul: "tytułu",
  artysta: "artysty",
  rok: "roku"
};

// Stan strony (sortowanie i wyróżniony artysta nie trafiają do adresu)
const stan = { ekran: "lista", dzial: null, sort: "kolejnosc", artysta: null };

const $ = id => document.getElementById(id);

// Pozycja listy w menu
function menuItem(child) {
  const li = document.createElement("li");
  li.appendChild(child);
  return li;
}

// Link w menu, który nie zmienia adresu, tylko wywołuje akcję
function menuLink(tekst, akcja) {
  const a = el("a", "", tekst);
  a.href = location.hash || "#lista";
  a.addEventListener("click", e => {
    e.preventDefault();
    akcja();
  });
  return a;
}

// ---------- Wspólne części ekranu ----------

// Zakładki: Lista (zawsze), potem włączone działy; aktywna pogrubiona, pozostałe to linki
function rysujZakladki() {
  const tabs = $("tabs");
  tabs.textContent = "";
  const aktywna = stan.ekran === "dzial" ? stan.dzial : stan.ekran;
  ["lista", ...wlaczoneDzialy()].forEach(key => {
    const nazwa = key === "lista" ? "Lista" : DZIALY[key].nazwa;
    const tab = el(key === aktywna ? "b" : "a", "tab", nazwa);
    if (key !== aktywna) tab.href = `#${key}`;
    tabs.appendChild(tab);
  });
}

// Link „Ustawienia” na dole menu; na ekranie ustawień pogrubiony napis
function rysujLinkUstawien() {
  const p = $("menu-ustawienia");
  p.textContent = "";
  if (stan.ekran === "ustawienia") {
    p.appendChild(el("b", "", "Ustawienia"));
  } else {
    const a = el("a", "", "Ustawienia");
    a.href = "#ustawienia";
    p.appendChild(a);
  }
}

// Komunikat z linkiem do ustawień (wszystkie działy wyłączone)
function komunikatUstawien(tekst) {
  const info = el("p", "wylaczony", tekst + " ");
  const link = el("a", "", "Zmień ustawienia");
  link.href = "#ustawienia";
  info.appendChild(link);
  return info;
}

// ---------- Ekran listy ----------

function rysujListe() {
  const lista = $("lista");
  lista.textContent = "";
  const liczniki = [];
  const wlaczone = wlaczoneDzialy();

  wlaczone.forEach(key => {
    const d = DZIALY[key];
    const albumy = [...daneDzialu(key)].sort(poWykonawcy);
    const sekcja = el("section", "sekcja");
    sekcja.appendChild(el("h2", "", d.nazwa));
    liczniki.push(`${d.nazwa} (${albumy.length})`);

    if (albumy.length === 0) {
      sekcja.appendChild(el("p", "", "Brak albumów."));
    } else {
      const table = el("table", "lista");
      const head = table.createTHead().insertRow();
      ["Wykonawca", "Tytuł", "Rok"].forEach(t => head.appendChild(el("th", "", t)));
      const body = table.createTBody();
      albumy.forEach(a => {
        const row = body.insertRow();
        [a.artist, a.title, a.info?.Rok ?? ""].forEach(t => row.appendChild(el("td", "", t)));
      });
      sekcja.appendChild(table);
    }
    lista.appendChild(sekcja);
  });

  if (wlaczone.length === 0) {
    lista.appendChild(komunikatUstawien("Wszystkie działy są wyłączone w ustawieniach."));
  }

  // Liczby albumów na przewijanym pasku
  $("liczniki").textContent = liczniki.join(" | ");
}

// ---------- Ekran działu ----------

// Zastępcza okładka: kolor i tytuł (brak okładki albo błąd wczytania)
function placeholder(cover, album) {
  cover.textContent = "";
  cover.style.backgroundColor = kolorDla(album.title, PLAIN_COLORS);
  cover.appendChild(el("span", "cover-title", album.title));
}

// Jeden kwadrat albumu: okładka, tytuł, artysta, tabelka info, notatka
function renderAlbum(album) {
  const item = el("div", "album");
  item.dataset.artist = album.artist;

  const cover = el("div", "cover");
  if (album.cover) {
    const img = document.createElement("img");
    img.src = sciezka(album.cover);
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

// Menu sortowania: aktywna opcja pogrubiona, pozostałe to linki
function rysujSortowanie() {
  const sortList = $("sort");
  sortList.textContent = "";
  Object.entries(NAZWY_SORTOW).forEach(([key, nazwa]) => {
    const item = key === stan.sort
      ? el("b", "", nazwa)
      : menuLink(nazwa, () => {
          stan.sort = key;
          rysujDzial();
        });
    sortList.appendChild(menuItem(item));
  });
}

function rysujDzial() {
  const key = stan.dzial;
  const albumy = daneDzialu(key);
  document.body.dataset.dzial = key;   // np. okładki kaset są pionowe (style.css)

  rysujSortowanie();

  // Albumy
  const list = $("albums");
  list.textContent = "";
  posortuj(albumy, stan.sort).forEach(a => list.appendChild(renderAlbum(a)));

  // Spis artystów alfabetycznie
  const indexList = $("index");
  indexList.textContent = "";
  [...new Set(albumy.map(a => a.artist))]
    .sort((a, b) => a.localeCompare(b, "pl"))
    .forEach(name => indexList.appendChild(menuItem(menuLink(name, () => {
      stan.artysta = name;
      wyroznij();
    }))));

  $("count").textContent = odmiana(albumy.length, DZIALY[key].slowa);
  wyroznij();
}

// Podświetlenie wszystkich albumów wybranego artysty, bez przewijania
function wyroznij() {
  document.querySelectorAll("#albums .album").forEach(node => {
    node.classList.toggle("wybrany", node.dataset.artist === stan.artysta);
  });
}

// ---------- Ekran ustawień ----------

function rysujUstawienia() {
  const ukryte = wczytajUkryte();
  const listaDzialow = $("lista-dzialow");
  listaDzialow.textContent = "";
  $("komunikat").textContent = "";

  // Pole wyboru dla każdego działu (domyślnie wszystkie zaznaczone)
  Object.entries(DZIALY).forEach(([key, d]) => {
    const label = document.createElement("label");
    const box = document.createElement("input");
    box.type = "checkbox";
    box.value = key;
    box.checked = !ukryte.includes(key);
    label.append(box, " " + d.nazwa);
    listaDzialow.appendChild(label);
  });

  // Wybór wyglądu; zaznaczony jest ten, który właśnie oglądamy
  const wybor = $("wybor-wygladu");
  wybor.textContent = "";
  Object.entries(WYGLADY).forEach(([key, w]) => {
    const label = document.createElement("label");
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "wyglad";
    radio.value = key;
    radio.checked = key === TEN_WYGLAD;
    label.append(radio, " " + w.nazwa);
    wybor.appendChild(label);
  });
}

$("ustawienia").addEventListener("submit", e => {
  e.preventDefault();
  const odznaczone = [...$("lista-dzialow").querySelectorAll("input")]
    .filter(p => !p.checked)
    .map(p => p.value);

  const wyglad = $("wybor-wygladu").querySelector("input:checked").value;
  const ok = zapiszUkryte(odznaczone) && zapiszWyglad(wyglad);

  $("komunikat").textContent = ok
    ? "Zapisano."
    : "Nie udało się zapisać: przeglądarka blokuje zapis ustawień.";
  rysujZakladki();

  // Inny wygląd: przejście do niego, na ekran ustawień
  if (ok && wyglad !== TEN_WYGLAD) idzDoWygladu(wyglad);
});

// ---------- Przełączanie ekranów ----------

function pokaz() {
  const { ekran, dzial } = ekranZAdresu();
  if (ekran !== stan.ekran || dzial !== stan.dzial) stan.artysta = null;
  stan.ekran = ekran;
  stan.dzial = dzial;

  const naUstawieniach = ekran === "ustawienia";
  $("ekran-lista").hidden = ekran !== "lista";
  $("ekran-dzial").hidden = ekran !== "dzial";
  $("ekran-ustawienia").hidden = !naUstawieniach;
  $("menu-dzialu").hidden = ekran !== "dzial";
  $("pasek").hidden = naUstawieniach;
  $("stopka").hidden = naUstawieniach;
  $("naglowek").textContent = naUstawieniach ? "Ustawienia" : "Moje albumy";
  $("liczniki").textContent = "";
  if (ekran !== "dzial") delete document.body.dataset.dzial;

  const tytul = ekran === "dzial" ? DZIALY[dzial].nazwa : naUstawieniach ? "Ustawienia" : "Lista";
  document.title = `Moje albumy – ${tytul}`;

  if (ekran === "lista") rysujListe();
  else if (ekran === "dzial") rysujDzial();
  else rysujUstawienia();

  rysujZakladki();
  rysujLinkUstawien();
  window.scrollTo(0, 0);
}

// „do góry” przewija stronę, nie zmieniając ekranu
$("do-gory").addEventListener("click", e => {
  e.preventDefault();
  window.scrollTo(0, 0);
});

// Wyłączone animacje w systemie zatrzymują przewijany napis
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const m = $("marquee");
  if (m && m.stop) m.stop();
}

// Przy przejściu do innego wyglądu (common.js) tej strony nie rysujemy
if (!PRZEKIEROWANIE) {
  window.addEventListener("hashchange", pokaz);
  pokaz();
}
