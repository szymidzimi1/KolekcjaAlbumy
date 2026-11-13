// Lista wszystkich albumów: sekcja z tabelą dla każdego włączonego działu

// Dane działu; brak pliku z danymi traktujemy jak pusty dział
function daneDzialu(d) {
  try { return d.dane(); } catch { return []; }
}

// Stała kolejność: wykonawca, potem tytuł
const poWykonawcy = (a, b) =>
  a.artist.localeCompare(b.artist, "pl") || a.title.localeCompare(b.title, "pl");

const lista = document.getElementById("lista");
const liczniki = [];

const wlaczone = wlaczoneDzialy();

wlaczone.forEach(([, d]) => {
  const albumy = [...daneDzialu(d)].sort(poWykonawcy);
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

// Wszystkie działy wyłączone w ustawieniach
if (wlaczone.length === 0) {
  lista.appendChild(komunikatUstawien("Wszystkie działy są wyłączone w ustawieniach."));
}

// Liczby albumów na przewijanym pasku
document.getElementById("liczniki").textContent = liczniki.join(" | ");

// Zakładki
rysujZakladki("lista");
