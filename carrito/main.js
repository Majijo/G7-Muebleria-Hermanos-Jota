// Importar el array de productos
import { productos } from './products.js';

// Variables globales para el estado de la aplicación
let productosFiltrados = [...productos];
let carrito = []; // Array para almacenar productos en el carrito
let contadorCarrito = 0; // Contador de productos en el carrito

// ===== FUNCIONES DE CARGA ASÍNCRONA =====
// Simular carga asíncrona de productos con Promise + setTimeout
async function cargarProductosAsync() {
  try {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    return productos;
  } catch (error) {
    console.error('Error al cargar productos:', error);
    return [];
  }
}

// ===== FUNCIONES DE RENDERIZADO DINÁMICO =====
// Función para renderizar el catálogo completo de productos
async function renderCatalogo(productosParaMostrar = null) {
  const contenedorProductos = document.querySelector('.products-grid');
  
  if (!contenedorProductos) return;
  
  // Mostrar indicador de carga
  contenedorProductos.innerHTML = '<div class="loading">Cargando productos...</div>';
  
  try {
    // Cargar productos de forma asíncrona
    const productosACargar = productosParaMostrar || await cargarProductosAsync();
    
    // Limpiar contenido existente
    contenedorProductos.innerHTML = '';
    
    if (productosACargar.length === 0) {
      contenedorProductos.innerHTML = '<p class="no-products">No se encontraron productos que coincidan con tu búsqueda.</p>';
      return;
    }
    
    // Crear las tarjetas de productos dinámicamente
    productosACargar.forEach(producto => {
      const tarjetaProducto = crearElementoProducto(producto);
      contenedorProductos.appendChild(tarjetaProducto);
    });
  } catch (error) {
    contenedorProductos.innerHTML = '<p class="error">Error al cargar los productos. Intenta nuevamente.</p>';
    console.error('Error en renderCatalogo:', error);
  }
}

// Función para mostrar productos destacados en la página principal
async function renderDestacados() {
  const contenedorDestacados = document.querySelector('.products-grid');
  
  if (!contenedorDestacados) return;
  
  // Mostrar indicador de carga
  contenedorDestacados.innerHTML = '<div class="loading">Cargando productos destacados...</div>';
  
  try {
    // Cargar productos de forma asíncrona
    const productosACargar = await cargarProductosAsync();
    
    // Seleccionar los primeros 4 productos como destacados
    const productosDestacados = productosACargar.slice(0, 4);
    
    // Limpiar contenido existente
    contenedorDestacados.innerHTML = '';
    
    // Crear las tarjetas de productos destacados
    productosDestacados.forEach(producto => {
      const tarjetaProducto = crearElementoProducto(producto, true);
      contenedorDestacados.appendChild(tarjetaProducto);
    });
  } catch (error) {
    contenedorDestacados.innerHTML = '<p class="error">Error al cargar los productos destacados. Intenta nuevamente.</p>';
    console.error('Error en renderDestacados:', error);
  }
}

// ===== FUNCIONALIDAD DE BÚSQUEDA =====
// Función para buscar productos
async function buscarProductos() {
  const inputBusqueda = document.querySelector('.search-input');
  
  if (!inputBusqueda) return;
  
  const terminoBusqueda = inputBusqueda.value.toLowerCase().trim();
  
  try {
    // Cargar productos de forma asíncrona
    const productosACargar = await cargarProductosAsync();
    
    // Filtrar productos que coincidan con el término de búsqueda
    if (terminoBusqueda === '') {
      productosFiltrados = [...productosACargar];
    } else {
      productosFiltrados = productosACargar.filter(producto => 
        producto.nombre.toLowerCase().includes(terminoBusqueda) ||
        producto.descripcion.toLowerCase().includes(terminoBusqueda)
      );
    }
    
    // Renderizar los productos filtrados
    await renderCatalogo(productosFiltrados);
  } catch (error) {
    console.error('Error en búsqueda:', error);
  }
}

// ===== PÁGINA DE DETALLE DE PRODUCTO =====
// Función para mostrar el detalle de un producto específico
async function mostrarDetalleProducto() {
  // Obtener el parámetro id de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  if (!productId) {
    // Si no hay ID, mostrar todo el catálogo
    await renderCatalogo();
    return;
  }
  
  try {
    // Cargar productos de forma asíncrona
    const productosACargar = await cargarProductosAsync();
    
    // Buscar el producto por ID
    const producto = productosACargar.find(p => p.id === parseInt(productId));
    
    if (!producto) {
      // Si no se encuentra el producto, mostrar mensaje de error
      const contenedorProductos = document.querySelector('.products-grid');
      if (contenedorProductos) {
        contenedorProductos.innerHTML = '<p class="no-products">Producto no encontrado.</p>';
      }
      return;
    }
    
    // Buscar contenedor de detalle del producto
    const contenedorDetalle = document.querySelector('.product-detail');
    
    if (contenedorDetalle) {
      // Renderizar el detalle del producto con botón "Añadir al Carrito"
      contenedorDetalle.innerHTML = `
        <div class="product-detail-content">
          <div class="product-image-large">
            <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='img/placeholder.jpg'">
          </div>
          <div class="product-info">
            <h1>${producto.nombre}</h1>
            <p class="product-price">${formatearPrecio(producto.precio)}</p>
            <p class="product-description">${producto.descripcion}</p>
            <button class="add-to-cart-button" onclick="anadirAlCarrito(${producto.id})">
              Añadir al Carrito
            </button>
            <button class="contact-button" onclick="window.location.href='contacto.html'">
              Consultar Precio
            </button>
          </div>
        </div>
      `;
    } else {
      // Si no hay contenedor de detalle, mostrar todo el catálogo
      await renderCatalogo();
    }
  } catch (error) {
    console.error('Error al mostrar detalle del producto:', error);
    const contenedorProductos = document.querySelector('.products-grid');
    if (contenedorProductos) {
      contenedorProductos.innerHTML = '<p class="error">Error al cargar el producto. Intenta nuevamente.</p>';
    }
  }
}

// ===== FUNCIONALIDAD DEL CARRITO SIMULADO =====
// Función para añadir producto al carrito
function anadirAlCarrito(productoId) {
  try {
    // Buscar el producto
    const producto = productos.find(p => p.id === productoId);
    
    if (!producto) {
      console.error('Producto no encontrado para añadir al carrito');
      return;
    }
    
    // Verificar si el producto ya está en el carrito
    const productoEnCarrito = carrito.find(item => item.id === productoId);
    
    if (productoEnCarrito) {
      // Incrementar cantidad si ya existe
      productoEnCarrito.cantidad += 1;
    } else {
      // Añadir nuevo producto al carrito
      carrito.push({
        ...producto,
        cantidad: 1
      });
    }
    
    // Actualizar contador del carrito
    actualizarContadorCarrito();
    
    // Mostrar confirmación visual
    mostrarConfirmacionCarrito(producto.nombre);
    
    console.log('Producto añadido al carrito:', producto.nombre);
  } catch (error) {
    console.error('Error al añadir al carrito:', error);
  }
}

// Función para actualizar el contador del carrito en el header
function actualizarContadorCarrito() {
  // Calcular total de productos en el carrito
  contadorCarrito = carrito.reduce((total, item) => total + item.cantidad, 0);
  
  // Actualizar el elemento .cart-count en el header
  const contadorCarritoElement = document.querySelector('.cart-count');
  if (contadorCarritoElement) {
    contadorCarritoElement.textContent = contadorCarrito;
    
    // Mostrar/ocultar el contador según si hay productos
    if (contadorCarrito > 0) {
      contadorCarritoElement.style.display = 'inline-block';
    } else {
      contadorCarritoElement.style.display = 'none';
    }
  }
}

// Función para mostrar confirmación visual de producto añadido
function mostrarConfirmacionCarrito(nombreProducto) {
  // Crear notificación temporal
  const notificacion = document.createElement('div');
  notificacion.className = 'cart-notification';
  notificacion.innerHTML = `
    <span>✓ ${nombreProducto} añadido al carrito</span>
  `;
  
  // Añadir estilos básicos
  notificacion.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    z-index: 1000;
    font-weight: bold;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  `;
  
  // Añadir al DOM
  document.body.appendChild(notificacion);
  
  // Remover después de 3 segundos
  setTimeout(() => {
    if (notificacion.parentNode) {
      notificacion.parentNode.removeChild(notificacion);
    }
  }, 3000);
}

// ===== FUNCIONES AUXILIARES =====
// Función para configurar los eventos de búsqueda
function configurarBusqueda() {
  const inputBusqueda = document.querySelector('.search-input');
  const botonBusqueda = document.querySelector('.search-button');
  
  if (inputBusqueda) {
    // Buscar al escribir (con debounce para mejor performance)
    let timeoutId;
    inputBusqueda.addEventListener('input', () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(buscarProductos, 300);
    });
    
    // Buscar al presionar Enter
    inputBusqueda.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        buscarProductos();
      }
    });
  }
  
  if (botonBusqueda) {
    // Buscar al hacer clic en el botón
    botonBusqueda.addEventListener('click', (e) => {
      e.preventDefault();
      buscarProductos();
    });
  }
}

// Función para detectar en qué página estamos y ejecutar la función correspondiente
async function inicializarPagina() {
  const currentPage = window.location.pathname.split('/').pop();
  
  try {
    switch (currentPage) {
      case 'index.html':
      case '':
        // Página principal - mostrar productos destacados
        await renderDestacados();
        break;
        
      case 'producto.html':
        // Página de productos - configurar búsqueda y mostrar catálogo o detalle
        configurarBusqueda();
        await mostrarDetalleProducto();
        break;
        
      case 'contacto.html':
        // Página de contacto - no necesita funcionalidad específica por ahora
        break;
        
      default:
        // Página por defecto
        console.log('Página no reconocida:', currentPage);
        await renderCatalogo();
    }
  } catch (error) {
    console.error('Error en inicialización de página:', error);
  }
}

// Función para formatear precios en pesos argentinos usando Intl.NumberFormat
function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
  }).format(precio);
}

// Función auxiliar para crear elementos de producto
function crearElementoProducto(producto, esDestacado = false) {
  const enlaceProducto = document.createElement('a');
  enlaceProducto.href = `producto.html?id=${producto.id}`;
  enlaceProducto.className = 'product-card';
  
  enlaceProducto.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='img/placeholder.jpg'">
    <h3>${producto.nombre}</h3>
    <p class="price">${formatearPrecio(producto.precio)}</p>
    ${esDestacado ? '<span class="featured-badge">Destacado</span>' : ''}
  `;
  
  return enlaceProducto;
}

// ===== INICIALIZACIÓN DE LA APLICACIÓN =====
// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Inicializar contador del carrito
    actualizarContadorCarrito();
    
    // Inicializar página
    await inicializarPagina();
  } catch (error) {
    console.error('Error en inicialización de la aplicación:', error);
  }
});

// ===== EXPORTACIÓN Y FUNCIONES GLOBALES =====
// Exportar funciones para uso externo si es necesario
window.HermanosJota = {
  productos,
  carrito,
  contadorCarrito,
  renderCatalogo,
  renderDestacados,
  buscarProductos,
  mostrarDetalleProducto,
  anadirAlCarrito,
  actualizarContadorCarrito
};

// Hacer la función anadirAlCarrito global para el onclick del HTML
window.anadirAlCarrito = anadirAlCarrito;