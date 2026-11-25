// Widget
{
  const przycisk = document.getElementById("maksymalizuj");

  const cebula = document.createElement("button");
  cebula.type = "button";
  cebula.className = "cebula";
  cebula.title = "Schowaj";
  cebula.setAttribute("aria-label", "Schowaj cebulę");
  cebula.hidden = true;

  const img = document.createElement("img");
  img.src = sciezka("img/cebula.png");
  img.alt = "";
  cebula.appendChild(img);
  document.body.appendChild(cebula);

  function pokaz(widoczna) {
    cebula.hidden = !widoczna;
    przycisk.setAttribute("aria-pressed", String(widoczna));
  }

  przycisk.addEventListener("click", () => pokaz(cebula.hidden));
  cebula.addEventListener("click", () => {
    pokaz(false);
    przycisk.focus();
  });
}
