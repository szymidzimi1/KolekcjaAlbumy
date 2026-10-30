# Moje albumy

Aplikacja do katalogowania płyt.

![Widok strony na komputerze](screen/screenshot.png)

<img src="screen/screenshot-mobile.png" alt="Widok strony na telefonie" width="260">

## Funkcje

- Albumy wyświetlane w kwadratach: okładka, tytuł, artysta, tabelka z informacjami i notatka
- Album bez okładki dostaje kolor z tytułem
- Sortowanie według kolejności dodania, tytułu, artysty lub roku
- Spis artystów w menu, który podświetla na żółto wszystkie albumy danego artysty

## Pliki

| Plik | Do czego służy |
|------|----------------|
| `index.html` | Szkielet strony i tekst przewijanego napisu |
| `style.css` | Wygląd |
| `app.js` | Wyświetlanie albumów, sortowanie i podświetlanie |
| `albums.js` | **Lista albumów, edytujesz tylko ten plik** |
| `covers/` | Okładki albumów (opcjonalnie) |

## Dodawanie albumu

W `albums.js` dopisz kolejny wpis do tablicy `ALBUMS`:

```js
{
  title: "Tytuł albumu",
  artist: "Wykonawca",
  cover: "covers/okladka.jpg",
  info: { Rok: "1997", Gatunek: "Rock", Nośnik: "CD" },
  note: "Krótka notatka."
}
```

## Uruchomienie

Wystarczy skopiować cały folder do katalogu, z którego serwer WWW podaje pliki (np. `/var/www/html/albumy`).
