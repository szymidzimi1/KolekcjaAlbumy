// Jedna strona bez przeładowania: ekran wybiera adres po "#"
// (#lista, #winyle, #kasety, #cd, #ustawienia)

// Kolory zastępczych okładek: ten sam tytuł zawsze dostaje ten sam kolor
const KOLORY = [
  "#000080", "#800000", "#006d6d", "#5f5f00",
  "#006400", "#141414", "#404040", "#7a3d10"
];

// Nazwy sortowań na pasku stanu (same sortowania są w common.js)
const NAZWY_SORTOW = {
  kolejnosc: "kolejności dodania",
  tytul: "tytułu",
  artysta: "wykonawcy",
  rok: "roku"
};

// Stan strony (artysta i sortowanie nie trafiają do adresu)
const stan = {
  ekran: "lista",
  dzial: null,
  sort: "kolejnosc",
  artysta: null,
  szkic: null,      // działy wyłączone w ustawieniach przed kliknięciem "Zapisz"
  szkicWygladu: TEN_WYGLAD
};

// Artysta do wyróżnienia po przejściu z listy do działu
let nastepnyArtysta = null;

const $ = id => document.getElementById(id);

// ---------- Zakładki, tytuł okna, pasek stanu ----------

function rysujZakladki() {
  const nav = $("zakladki");
  nav.textContent = "";
  ["lista", ...wlaczoneDzialy()].forEach(key => {
    const tab = el("a", "tab", key === "lista" ? "Lista" : DZIALY[key].nazwa);
    tab.href = `#${key}`;
    if (key !== "lista") tab.appendChild(el("span", "liczba", String(daneDzialu(key).length)));
    const aktywna = key === "lista" ? stan.ekran === "lista" : stan.ekran === "dzial" && stan.dzial === key;
    if (aktywna) tab.setAttribute("aria-current", "page");
    nav.appendChild(tab);
  });

  const ust = $("link-ustawienia");
  ust.classList.toggle("wlaczony", stan.ekran === "ustawienia");
  if (stan.ekran === "ustawienia") ust.setAttribute("aria-current", "page");
  else ust.removeAttribute("aria-current");
}

function ustawTytul(tekst) {
  $("tytul").textContent = `Moje albumy - ${tekst}`;
  document.title = `${tekst} - Moje albumy`;
}

function ustawStan(a, b, c) {
  $("stan1").textContent = a;
  $("stan2").textContent = b;
  $("stan3").textContent = c;
}

// ---------- Ekran działu ----------

// Zastępcza okładka: kolor i tytuł (brak okładki albo błąd wczytania)
function zastepcza(okladka, album) {
  okladka.querySelector("img")?.remove();
  okladka.style.backgroundColor = kolorDla(album.title, KOLORY);
  okladka.appendChild(el("span", "cover-title", album.title));
}

function karta(album, skrot) {
  const card = el("article", "card");
  card.dataset.artist = album.artist;

  const okladka = el("div", "cover");
  okladka.appendChild(el("span", "nosnik", skrot));
  if (album.cover) {
    const img = document.createElement("img");
    img.src = sciezka(album.cover);
    img.alt = `Okładka: ${album.title}, ${album.artist}`;
    img.loading = "lazy";
    img.onerror = () => zastepcza(okladka, album);
    okladka.appendChild(img);
  } else {
    zastepcza(okladka, album);
  }
  card.appendChild(okladka);

  card.appendChild(el("h2", "", album.title));

  const wyk = el("button", "link-btn", album.artist);
  wyk.type = "button";
  wyk.setAttribute("aria-label", `Wyróżnij albumy: ${album.artist}`);
  wyk.addEventListener("click", () => wybierzArtyste(album.artist));
  card.appendChild(wyk);

  if (album.info && Object.keys(album.info).length) {
    const dl = el("dl", "info sunken");
    for (const [key, value] of Object.entries(album.info)) {
      dl.appendChild(el("dt", "", key));
      dl.appendChild(el("dd", "", value));
    }
    card.appendChild(dl);
  }

  if (album.note) card.appendChild(el("p", "note", album.note));
  return card;
}

function rysujDzial() {
  const key = stan.dzial;
  const d = DZIALY[key];
  const albumy = daneDzialu(key);
  const ekran = $("ekran-dzial");
  ekran.className = `ekran ${key}`;

  $("dzial-nazwa").textContent = d.nazwa;
  $("dzial-licznik").textContent = odmiana(albumy.length, d.slowa);
  document.querySelector(`input[name="sortuj"][value="${stan.sort}"]`).checked = true;

  // Albumy
  const siatka = $("albumy");
  siatka.textContent = "";
  posortuj(albumy, stan.sort).forEach(a => siatka.appendChild(karta(a, d.skrot)));

  // Artyści alfabetycznie z liczbą albumów
  const ile = new Map();
  albumy.forEach(a => ile.set(a.artist, (ile.get(a.artist) || 0) + 1));
  const lista = $("lista-artystow");
  lista.textContent = "";
  [...ile.keys()].sort((a, b) => a.localeCompare(b, "pl")).forEach(name => {
    const btn = el("button", "artist-btn");
    btn.type = "button";
    btn.dataset.artist = name;
    btn.appendChild(el("span", "", name));
    btn.appendChild(el("span", "liczba", String(ile.get(name))));
    btn.addEventListener("click", () => wybierzArtyste(name));
    lista.appendChild(btn);
  });

  ustawTytul(d.nazwa);
  wyroznij();
}

// Wyróżnienie albumów wybranego artysty, bez przewijania i przerysowania
function wyroznij() {
  const sel = stan.artysta;
  let n = 0;
  document.querySelectorAll("#albumy .card").forEach(card => {
    const ten = card.dataset.artist === sel;
    card.classList.toggle("wybrany", ten);
    if (ten) n++;
  });
  document.querySelectorAll("#lista-artystow .artist-btn").forEach(btn => {
    btn.setAttribute("aria-pressed", String(btn.dataset.artist === sel));
  });
  $("wyczysc").hidden = !sel;

  const d = DZIALY[stan.dzial];
  ustawStan(
    odmiana(daneDzialu(stan.dzial).length, d.slowa),
    `Sortowanie: ${NAZWY_SORTOW[stan.sort]}`,
    sel ? `Wyróżniono: ${sel} (${n})` : "Kliknij wykonawcę, by wyróżnić jego albumy"
  );
}

// Kliknięcie tego samego artysty drugi raz zdejmuje wyróżnienie
function wybierzArtyste(name) {
  stan.artysta = stan.artysta === name ? null : name;
  wyroznij();
}

document.querySelectorAll('input[name="sortuj"]').forEach(radio => {
  radio.addEventListener("change", () => {
    stan.sort = radio.value;
    rysujDzial();
  });
});

$("wyczysc").addEventListener("click", () => {
  stan.artysta = null;
  wyroznij();
  $("lista-artystow").querySelector(".artist-btn")?.focus();
});

// ---------- Ekran listy ----------

function rysujListe() {
  const wlaczone = wlaczoneDzialy();
  const sekcje = $("sekcje");
  sekcje.textContent = "";
  let razem = 0;

  if (!wlaczone.length) {
    const p = el("p", "komunikat sunken", "Wszystkie działy są wyłączone w ustawieniach. ");
    const link = el("a", "", "Zmień ustawienia");
    link.href = "#ustawienia";
    p.appendChild(link);
    sekcje.appendChild(p);
  }

  wlaczone.forEach(key => {
    const albumy = daneDzialu(key);
    razem += albumy.length;

    const sekcja = el("section", "sekcja");
    const naglowek = el("div", "sekcja-naglowek");
    naglowek.appendChild(el("h2", "", `${DZIALY[key].nazwa} (${albumy.length})`));
    const otworz = el("a", "btn", "Otwórz dział →");
    otworz.href = `#${key}`;
    naglowek.appendChild(otworz);
    sekcja.appendChild(naglowek);

    const ramka = el("div", "tabela sunken");
    const table = el("table", "tbl");
    const thead = el("thead");
    const tr = el("tr");
    [["Wykonawca", "40%"], ["Tytuł", "45%"], ["Rok", "15%"]].forEach(([t, w]) => {
      const th = el("th", "", t);
      th.style.width = w;
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    table.appendChild(thead);

    const tbody = el("tbody");
    [...albumy].sort(poWykonawcy).forEach(a => {
      const row = el("tr");
      const td = el("td");
      const btn = el("button", "link-btn", a.artist);
      btn.type = "button";
      btn.setAttribute("aria-label", `${a.artist}: pokaż w dziale ${DZIALY[key].nazwa}`);
      btn.addEventListener("click", () => {
        nastepnyArtysta = a.artist;
        location.hash = `#${key}`;
      });
      td.appendChild(btn);
      row.appendChild(td);
      row.appendChild(el("td", "", a.title));
      row.appendChild(el("td", "rok", String(a.info?.Rok ?? "")));
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    ramka.appendChild(table);
    sekcja.appendChild(ramka);
    sekcje.appendChild(sekcja);
  });

  $("razem").textContent = odmiana(razem, DZIALY.winyle.slowa);
  ustawTytul("Lista");
  ustawStan(
    odmiana(razem, DZIALY.winyle.slowa),
    wlaczone.map(k => `${DZIALY[k].nazwa} (${daneDzialu(k).length})`).join(" · ") || "Brak włączonych działów",
    "Kliknij wykonawcę, by przejść do jego albumów"
  );
}

// ---------- Ekran ustawień ----------

function rysujUstawienia() {
  stan.szkic = wczytajUkryte();
  $("komunikat").textContent = "";
  const pola = $("pola-dzialow");
  pola.textContent = "";
  Object.entries(DZIALY).forEach(([key, d]) => {
    const label = el("label", "radio");
    const box = document.createElement("input");
    box.type = "checkbox";
    box.value = key;
    box.checked = !stan.szkic.includes(key);
    box.addEventListener("change", () => {
      stan.szkic = box.checked ? stan.szkic.filter(k => k !== key) : [...stan.szkic, key];
      $("komunikat").textContent = "";
      stanUstawien();
    });
    label.appendChild(box);
    label.appendChild(document.createTextNode(d.nazwa));
    pola.appendChild(label);
  });

  // Wybór wyglądu; zaznaczony jest ten, który właśnie oglądamy
  stan.szkicWygladu = TEN_WYGLAD;
  const wyglady = $("pola-wygladu");
  wyglady.textContent = "";
  Object.entries(WYGLADY).forEach(([key, w]) => {
    const label = el("label", "radio");
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "wyglad";
    radio.value = key;
    radio.checked = key === TEN_WYGLAD;
    radio.addEventListener("change", () => {
      stan.szkicWygladu = key;
      $("komunikat").textContent = "";
      stanUstawien();
    });
    label.appendChild(radio);
    label.appendChild(document.createTextNode(w.nazwa));
    wyglady.appendChild(label);
  });

  ustawTytul("Ustawienia");
  stanUstawien();
}

function stanUstawien() {
  const zapisane = wczytajUkryte();
  const zmiany = Object.keys(DZIALY).some(k => zapisane.includes(k) !== stan.szkic.includes(k))
    || stan.szkicWygladu !== TEN_WYGLAD;
  ustawStan(
    `Włączone działy: ${wlaczoneDzialy().length} z ${Object.keys(DZIALY).length}`,
    zmiany ? "Niezapisane zmiany" : "Brak zmian",
    "Zapis tylko w tej przeglądarce"
  );
}

$("ustawienia").addEventListener("submit", e => {
  e.preventDefault();
  const ok = zapiszUkryte(stan.szkic) && zapiszWyglad(stan.szkicWygladu);
  const msg = $("komunikat");
  msg.textContent = ok ? "Zapisano." : "Nie udało się zapisać: przeglądarka blokuje zapis ustawień.";
  msg.style.color = ok ? "" : "#800000";
  rysujZakladki();
  stanUstawien();

  // Inny wygląd: przejście do niego, na ekran ustawień
  if (ok && stan.szkicWygladu !== TEN_WYGLAD) idzDoWygladu(stan.szkicWygladu);
});

// ---------- Przełączanie ekranów ----------

function pokaz() {
  const { ekran, dzial } = ekranZAdresu();
  const artysta = nastepnyArtysta;
  nastepnyArtysta = null;

  // Zmiana działu zdejmuje wyróżnienie, chyba że przychodzimy z listy z wybranym artystą
  if (ekran !== stan.ekran || dzial !== stan.dzial || artysta) stan.artysta = artysta;
  stan.ekran = ekran;
  stan.dzial = dzial;

  $("ekran-dzial").hidden = stan.ekran !== "dzial";
  $("ekran-lista").hidden = stan.ekran !== "lista";
  $("ekran-ustawienia").hidden = stan.ekran !== "ustawienia";

  if (stan.ekran === "dzial") rysujDzial();
  else if (stan.ekran === "lista") rysujListe();
  else rysujUstawienia();

  rysujZakladki();
  window.scrollTo(0, 0);
}

// Przy przejściu do innego wyglądu (common.js) tej strony nie rysujemy
if (!PRZEKIEROWANIE) {
  window.addEventListener("hashchange", pokaz);
  pokaz();
}
