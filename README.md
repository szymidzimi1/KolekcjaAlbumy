# Moje albumy

Aplikacja do katalogowania płyt.

![Dział Winyle na komputerze](docs/screenshot.png)

## Funkcje

- Przeglądanie kolekcji w dwóch działach: winyle i kasety
- Karta albumu z okładką, tytułem, wykonawcą i dowolnymi informacjami
- Sortowanie po tytule, wykonawcy, roku lub kolejności dodania
- Wyróżnienie wszystkich albumów wybranego wykonawcy jednym kliknięciem
- Dodawanie albumów przez edycję pliku

## Pliki

| Plik | Do czego służy |
|------|----------------|
| `index.html` | Dział Winyle: szkielet strony i tekst przewijanego napisu |
| `kasety.html` | Dział Kasety: ten sam szkielet |
| `css/style.css` | Wygląd |
| `js/app.js` | Zakładki działów, wyświetlanie albumów, sortowanie i podświetlanie |
| `js/widget.js` | Cebula w prawym dolnym rogu |
| `data/winyle.js` | **Lista winyli** |
| `data/kasety.js` | **Lista kaset** |
| `img/` | Grafiki strony (cebula) |
| `docs/` | Zrzuty ekranu do README |
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

## Uruchomienie

Wystarczy skopiować cały folder do katalogu, z którego serwer WWW podaje pliki (np. `/var/www/html/albumy`).

## Licencja

Kod jest udostępniony na licencji MIT, szczegóły w pliku [LICENSE](LICENSE).
Licencja nie obejmuje okładek albumów: prawa do nich należą do ich właścicieli.
