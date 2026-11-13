// Strona ustawień: włączanie i wyłączanie działów, zapis w przeglądarce
const listaDzialow = document.getElementById("lista-dzialow");
const komunikat = document.getElementById("komunikat");
const ukryte = wczytajUkryte();

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

rysujZakladki(null);

document.getElementById("ustawienia").addEventListener("submit", e => {
  e.preventDefault();
  const odznaczone = [...listaDzialow.querySelectorAll("input")]
    .filter(p => !p.checked)
    .map(p => p.value);

  komunikat.textContent = zapiszUkryte(odznaczone)
    ? "Zapisano."
    : "Nie udało się zapisać: przeglądarka blokuje zapis ustawień.";
  rysujZakladki(null);
});
