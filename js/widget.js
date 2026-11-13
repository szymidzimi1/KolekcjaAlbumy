// Widget
{
  const menuHead = document.querySelector(".menu-head");

  const cebula = document.createElement("button");
  cebula.className = "cebula";
  cebula.title = "Schowaj";
  cebula.setAttribute("aria-label", "Schowaj cebulę");
  cebula.hidden = true;

  const img = document.createElement("img");
  img.src = "img/cebula.png";
  img.alt = "";
  cebula.appendChild(img);
  document.body.appendChild(cebula);

  cebula.addEventListener("click", () => {
    cebula.hidden = true;
    menuHead.focus();
  });

  menuHead.setAttribute("role", "button");
  menuHead.tabIndex = 0;
  menuHead.addEventListener("click", () => { cebula.hidden = false; });
  menuHead.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      cebula.hidden = false;
    }
  });
}
