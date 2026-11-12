/* 
title   - tytuł albumu (wymagane)
artist  - wykonawca (wymagane)
cover   - ścieżka do okładki, np. "covers/kind-of-blue.jpg" (opcjonalne)
info    - dowolne pary "nazwa: wartość", wyświetlane pod albumem (opcjonalne)
note    - krótka notatka tekstem (opcjonalne)
*/

const WINYLE = [
  {
    title: "For Emma, Forever Ago",
    artist: "Bon Iver",
    cover: "covers/boniverforemma.jpg",
    info: { Rok: "2008", 
            Gatunek: "Pop/Rock",
            Nośnik: "Winyl"}
  },
  {
    title: "Deadbeat",
    artist: "Tame Impala",
    cover: "covers/tameimpaladeadbeat.jpg",
    info: { Rok: "2025", 
            Gatunek: "Pop/Rock",
            Nośnik: "Winyl"}
  },
  {
    title: "Minecraft Volume Alpha",
    artist: "C418",
    cover: "covers/c418minecraft.jpg",
    info: { Rok: "2011", 
            Gatunek: "Soundtrack",
            Nośnik: "Winyl"}
  },
  {
    title: "Demon Days",
    artist: "Gorillaz",
    cover: "covers/gorillazdemon.jpg",
    info: { Rok: "2005", 
            Gatunek: "Pop/Rock, Rap",
            Nośnik: "Winyl"}
  },
  {
    title: "Sempiternal",
    artist: "Bring Me The Horizon",
    cover: "covers/bmthsempiternal.jpg",
    info: { Rok: "2013", 
            Gatunek: "Pop/Rock",
            Nośnik: "Winyl"}
  },
  {
    title: "Parachutes",
    artist: "Coldplay",
    cover: "covers/coldplayparachutes.jpg",
    info: { Rok: "2000", 
            Gatunek: "Pop/Rock",
            Nośnik: "Winyl"}
  },
  {
    title: "Hozier",
    artist: "Hozier",
    cover: "covers/hozierhozier.jpg",
    info: { Rok: "2014", 
            Gatunek: "Pop/Rock",
            Nośnik: "Winyl"}
  },
  {
    title: "Wiped Out!",
    artist: "The Neighbourhood",
    cover: "covers/tnbhwipedout.jpg",
    info: { Rok: "2015", 
            Gatunek: "Pop/Rock",
            Nośnik: "Winyl"}
  },
  {
    title: "Jesus Is King",
    artist: "Kanye West",
    cover: "covers/kanyejesus.jpg",
    info: { Rok: "2019", 
            Gatunek: "Rap",
            Nośnik: "Winyl"}
  },
  {
    title: "Greatest Hits",
    artist: "Simon & Garfunkel",
    cover: "covers/simonandgarfunkelgreatest.webp",
    info: { Rok: "2019", 
            Gatunek: "Pop/Rock, Folk",
            Nośnik: "Winyl",
            Info: "Składanka"}
  },
  {
    title: "Męskie Granie 2021",
    artist: "Various Artists",
    cover: "covers/meskiegranie.jpg",
    info: { Rok: "2021", 
            Gatunek: "Pop/Rock",
            Nośnik: "Winyl",
            Info: "Składanka"}
  },
  {
    title: "Trumpet Hits",
    artist: "Gino Marino",
    cover: "covers/trumpethits.webp",
    info: { Rok: "1970", 
            Gatunek: "Pop",
            Nośnik: "Winyl",
            Info: "Składanka"}
  },
  {
    title: "Songs",
    artist: "Bulat Okudzhava",
    cover: "covers/bulatsongs.webp",
    info: { Rok: "1978", 
            Gatunek: "Pop",
            Nośnik: "Winyl"}
  },
  {
    title: "Plays Chopin Live",
    artist: "Dang Thai Son",
    cover: "covers/dangthai.webp",
    info: { Rok: "1970", 
            Gatunek: "Muzyka klasyczna",
            Nośnik: "Winyl"}
  }
];
