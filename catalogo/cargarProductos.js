import { productos } from "./products.js";

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");
  if (!grid) return;

  productos.forEach(producto => {
    const card = document.createElement("a");
    card.className = "product-card";
    card.title = producto.nombre;
    card.href = `./paginaDetalle.html?id=${producto.id}`;

    const img = document.createElement("img");
    img.src = producto.srcImg;
    img.alt = producto.nombre;

    const h3 = document.createElement("h3");
    h3.textContent = producto.nombre;

    const p = document.createElement("p");
    p.textContent = "$" + producto.precio.toLocaleString();

    card.appendChild(img);
    card.appendChild(h3);
    card.appendChild(p);

    const btnAgregar = document.createElement("button");
    btnAgregar.textContent = "COMPRAR";
    btnAgregar.className = "add-to-cart"; // Para que salga para comprar en el catálogo
    btnAgregar.addEventListener("click", (e) => {
      e.preventDefault(); 
      anadirAlCarrito(producto.id);
    });

    card.appendChild(btnAgregar);
    grid.appendChild(card);
  });
});
