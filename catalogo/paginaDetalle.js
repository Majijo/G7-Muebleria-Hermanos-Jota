import { productos } from "./products.js";

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("detalle");
  if (!contenedor) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));

  const producto = productos.find(p => p.id === id);
  if (!producto) {
    contenedor.innerHTML = "<p>Producto no encontrado.</p>";
    return;
  }

  // CONTENEDOR PARA LAS IMAGENES DE LA PÁGINA
  contenedor.innerHTML = `
    <div class="detalle-card">
      <img src="${producto.srcImg}" alt="${producto.nombre}">
      <h2>${producto.nombre}</h2>
      <p><strong>Precio:</strong> $${producto.precio.toLocaleString()}</p>
      <p><strong>Descripción:</strong> ${producto.descripcion}</p>
    </div>
  `;

  const detallesContainer = document.createElement("div");
  detallesContainer.className = "detalle-adicional";

  const excludeKeys = ["id", "nombre", "descripcion", "srcImg", "precio"];

  Object.entries(producto).forEach(([key, value]) => {
    if (!excludeKeys.includes(key)) {
      const p = document.createElement("p");
      p.innerHTML = `<strong>${capitalizar(key)}:</strong> ${value}`;
      detallesContainer.appendChild(p);
    }
  });

  contenedor.appendChild(detallesContainer);

  // BOTÓN COMPRAR DENTRO DE LA PÁGINA
  const btnComprar = document.createElement("button");
  btnComprar.textContent = "COMPRAR";
  btnComprar.className = "add-to-cart";
  btnComprar.addEventListener("click", () => {
    anadirAlCarrito(producto.id);
  }
  );
  contenedor.appendChild(btnComprar);
});

// Para que la primera letra salga en mayúscula:
function capitalizar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
