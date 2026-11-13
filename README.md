# Moje albumy

Aplikacja do katalogowania płyt.

![Dział Winyle na komputerze](docs/screenshot.png)

## Funkcje

- Lista wszystkich albumów w tabelach, osobno winyle i kasety
- Przeglądanie kolekcji w dwóch działach: winyle i kasety
- Karta albumu z okładką, tytułem, wykonawcą i dowolnymi informacjami
- Sortowanie po tytule, wykonawcy, roku lub kolejności dodania
- Wyróżnienie wszystkich albumów wybranego wykonawcy jednym kliknięciem
- Dodawanie albumów przez edycję pliku
- Włączanie i wyłączanie działów w ustawieniach (zapamiętywane w przeglądarce)

## Pliki

| Plik | Do czego służy |
|------|----------------|
| `index.html` | Strona startowa: lista wszystkich albumów |
| `pages/winyle.html` | Dział Winyle: szkielet strony i tekst przewijanego napisu |
| `pages/kasety.html` | Dział Kasety: ten sam szkielet |
| `pages/ustawienia.html` | Strona ustawień |
| `css/style.css` | Wygląd |
| `js/common.js` | Wspólne dla wszystkich stron: działy, ustawienia, zakładki, ścieżki |
| `js/lista.js` | Tabele na stronie z listą |
| `js/ustawienia.js` | Obsługa strony ustawień |
| `js/app.js` | Wyświetlanie albumów w działach, sortowanie i podświetlanie |
| `js/widget.js` | Cebula w prawym dolnym rogu |
| `data/winyle.js` | **Lista winyli** |
| `data/kasety.js` | **Lista kaset** |
| `LICENSE` | Licencja MIT |

## Dodawanie albumu

W `data/winyle.js` (tablica `WINYLE`) albo `data/kasety.js` (tablica `KASETY`) dopisz kolejny wpis:

```js
{
  title: "Tytuł albumu",
  artist: "Wykonawca",
  cover: "covers/okladka.jpg",
  info: { Rok: "1997", Gatunek: "Rock" },
  note: "Krótka notatka."
}
```

Okładki wrzuć do folderu `covers/` w głównym folderze projektu (kasety: `covers/kasety/`).
Ścieżkę w `cover` podaj od głównego folderu, tak jak w przykładzie.

## Uruchomienie

Wystarczy skopiować cały folder do katalogu, z którego serwer WWW podaje pliki (np. `/var/www/html/albumy`).

## Licencja

Kod jest udostępniony na licencji MIT, szczegóły w pliku [LICENSE](LICENSE).
Licencja nie obejmuje okładek albumów: prawa do nich należą do ich właścicieli.
