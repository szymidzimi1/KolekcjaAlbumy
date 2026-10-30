/* 
title   - tytuł albumu (wymagane)
artist  - wykonawca (wymagane)
cover   - ścieżka do okładki, np. "covers/kind-of-blue.jpg" (opcjonalne)
info    - dowolne pary "nazwa: wartość", wyświetlane pod albumem (opcjonalne)
note    - krótka notatka tekstem (opcjonalne)
*/

const ALBUMS = [
  {
    title: "Lorem ipsum dolor",
    artist: "Sit Amet",
    info: { Rok: "1984", 
            Gatunek: "Adipiscing",
            Nośnik: "Elit"}
  },
  {
    title: "Sed do eiusmod",
    artist: "Tempor Incididunt",
    info: { Rok: "2012", 
            Gatunek: "Et dolore",
            Nośnik: "Magna"}
  },
  {
    title: "Aliqua ut enim",
    artist: "Ad Minim",
    info: { Rok: "1997", 
            Gatunek: "Quis nostrud",
            Nośnik: "Exercitation"}
  },
  {
    title: "Ullamco laboris",
    artist: "Nisi ut aliquip",
    info: { Rok: "2023", 
            Gatunek: "Consequat",
            Nośnik: "Duis aute",
            Info: "Irure dolor"}
  }
];
