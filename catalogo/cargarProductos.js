var nombres = [
  "Aparador Uspallata",
  "Biblioteca Recoleta",
  "Butaca Mendoza",
  "Escritorio Costa",
  "Mesa Comedor Pampa",
  "Mesa de Centro Araucaria",
  "Mesa de Noche Aconcagua",
  "Silla de Trabajo Belgrano",
  "Sillas Córdoba",
  "Sillón Copacabana",
  "Sofá Patagonia",
  "Cama Neuquén"
]

var imagenes = [
  "img/Aparador Uspallata.png",
  "img/Biblioteca Recoleta.png",
  "img/Butaca Mendoza.png",
  "img/Escritorio Costa.png",
  "img/Mesa Comedor Pampa.png",
  "img/Mesa de Centro Araucaria.png",
  "img/Mesa de Noche Aconcagua.png",
  "img/Silla de Trabajo Belgrano.png",
  "img/Sillas Córdoba.png",
  "img/Sillón Copacabana.png",
  "img/Sofá Patagonia.png",
  "img/placeholder-1024x768.png"
]

var enlaces = ["#"]

var grid = document.getElementById("grid")

// USO DEL DOM PARA CARGAR LAS IMÁGENES
for (var i = 0; i < nombres.length; i++) {
  var card = document.createElement("a")  
  card.href = enlaces[0] // CAMBIAR DESPUÉS QUE TENGAMOS LOS ARCHIVOS
  card.className = "product-card"
  card.title = nombres[i]

  var img = document.createElement("img")   
  img.src = imagenes[i]
  img.alt = nombres[i]

  var h3 = document.createElement("h3")      
  h3.textContent = nombres[i]

  card.appendChild(img)
  card.appendChild(h3)
  grid.appendChild(card)
}