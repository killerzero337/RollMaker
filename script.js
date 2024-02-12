const campoClases = document.getElementById("clases");
const campoHechizos = document.getElementById("hechizos");
const campoRazas = document.getElementById("raza");
const infoTextoDefault = document.querySelector(".infoTextoAdicional");
const contenidoCompletoWeb = document.querySelector(".Formulario");
const statInputs = document.querySelectorAll('.statinput input[type="number"]');

console.log(campoRazas);

function llamadaDePromesaAlaApi(url, respuestaApi) {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(`Tipos de ${respuestaApi.id}:`);
      data.results.forEach((element) => {
        const option = document.createElement("option");
        option.value = element.name;
        option.textContent = element.name;
        respuestaApi.appendChild(option);
      });
    });
}

window.onload = function () {
  const campoClases = document.getElementById("clases");
  const campoRazas = document.getElementById("raza");
  const campoAlinieamiento = document.getElementById("alinieamiento");
  const campoObjeto = document.getElementById("objeto");
  llamadaDePromesaAlaApi("https://www.dnd5eapi.co/api/classes", campoClases);
  llamadaDePromesaAlaApi("https://www.dnd5eapi.co/api/races", campoRazas);
  llamadaDePromesaAlaApi(
    "https://www.dnd5eapi.co/api/alignments",
    campoAlinieamiento
  );
  llamadaDePromesaAlaApi("https://www.dnd5eapi.co/api/equipment", campoObjeto);
};

campoRazas.addEventListener("change", () => {
  const selectedRace = campoRazas.value.toLowerCase();
  const selectHechizosRazaSubtipo = document.getElementById("hechizosRaza");

  // borramos las opciones existentes si hay
  selectHechizosRazaSubtipo.innerHTML = `<option value="" disabled selected>Elige un hechizo de raza</option>`;

  fetch(`https://www.dnd5eapi.co/api/races/${selectedRace}`)
    .then((response) => response.json())
    .then((raceData) => {
      if (raceData.traits && raceData.traits.length > 0) {
        raceData.traits.forEach((trait) => {
          const option = document.createElement("option");
          option.value = trait.name;
          option.textContent = trait.name;
          selectHechizosRazaSubtipo.appendChild(option);
        });
      } else {
        console.log("La raza no tiene traits.");
      }
    })
    .catch((error) => console.log("error", error));
});

campoClases.addEventListener("change", () => {
  const selectedClass = campoClases.value.toLowerCase();
  const tercerSelectExistente = document.getElementById("tercerSelect");

  if (tercerSelectExistente) {
    tercerSelectExistente.remove();
  }

  fetch(`https://www.dnd5eapi.co/api/classes/${selectedClass}`)
    .then((response) => response.json())
    .then((classData) => {
      campoHechizos.innerHTML = "";

      if (classData.spellcasting) {
        classData.spellcasting.info.forEach((spellInfo) => {
          const option = document.createElement("option");
          option.value = spellInfo.name;
          option.textContent = spellInfo.name;
          campoHechizos.appendChild(option);
        });

        fetch("https://www.dnd5eapi.co/api/spells")
          .then((spellsResponse) => spellsResponse.json())
          .then((spellsData) => {
            const tercerSelect = document.createElement("select");
            tercerSelect.id = "tercerSelect";

            spellsData.results.forEach((spell) => {
              const option = document.createElement("option");
              option.value = spell.index;
              option.textContent = spell.name;
              tercerSelect.appendChild(option);
            });

            campoHechizos.parentNode.appendChild(tercerSelect);
          })
          .catch((error) => {
            console.log("error", error);
          });
      } else if (classData.proficiencies) {
        classData.proficiencies.forEach((proficiency) => {
          const option = document.createElement("option");
          option.value = proficiency.name;
          option.textContent = proficiency.name;
          campoHechizos.appendChild(option);
          campoHechizos.classList.add("multiple");
        });
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
});

campoClases.addEventListener("change", () => {
  mostrarInfo("clase");
});

campoRazas.addEventListener("change", () => {
  console.log("Estás seleccionando una raza");
  mostrarInfo("raza");
});

function mostrarInfo(campoElegido) {
  let imagenInfo = document.querySelector(".imagenInfo");
  let textoInfo = document.querySelector(".infoTextoAdicional");

  if (campoElegido == "clase") {
    campoElegido = campoClases.value.toLowerCase();
    switch (campoElegido) {
      case "cleric":
        imagenInfo.style.backgroundImage = 'url("assets/clases/clerigo.jpg")';
        imagenInfo.style.backgroundRepeat = "no-repeat";
        imagenInfo.style.backgroundPosition = "top";
        textoInfo.style.fontSize = "1vh";
        imagenInfo.style.width = "15vw";
        textoInfo.innerHTML =
          " <p>Los clérigos son devotos guerreros sagrados que canalizan</p> <p>el poder divino para sanar heridas y castigar a los enemigos.</p>";
        textoInfo.innerHTML +=
          "<p>Visten túnicas sagradas y llevan símbolos</p> <p>religiosos que reflejan su conexión con los dioses.</p>";
        break;
      case "barbarian":
        imagenInfo.style.backgroundPosition = "center";
        imagenInfo.style.backgroundImage = 'url("assets/clases/barbaro.jpg")';
        textoInfo.style.fontSize = "1vh";
        // caja.style.width = 100 + "vw";
        textoInfo.innerHTML =
          "<p>Los bárbaros son guerreros salvajes y furiosos que desatan su ira en la batalla.</p>";
        textoInfo.innerHTML +=
          "<p>Visten pieles de bestias y llevan armas primitivas.</p>";
        break;

      case "bard":
        imagenInfo.style.backgroundImage = 'url("assets/clases/bardo.webp")';
        imagenInfo.style.backgroundPosition = "center";
        textoInfo.style.fontSize = "1vh";
        // caja.style.width = 100 + "vw";
        textoInfo.innerHTML =
          "<p>Los bardos son artistas versátiles que combinan música, magia y habilidades sociales. Visten con atuendos elegantes y llevan instrumentos musicales.</p>";
        textoInfo.innerHTML +=
          "<p>Su magia se expresa a través de la creatividad y la música, pudiendo inspirar a sus aliados o desmoralizar a sus enemigos.</p>";

        break;
      default:
        console.error("Me he salido.");
        break;
    }
  } else if (campoElegido == "raza") {
    campoElegido = campoRazas.value.toLowerCase();
    switch (campoElegido) {
      case "dragonborn":
        imagenInfo.style.backgroundImage = 'url("assets/razas/dragon.webp")';
        imagenInfo.style.backgroundPosition = "right";
        textoInfo.style.fontSize = "1vh";
        imagenInfo.style.width = "28vw";
        textoInfo.innerHTML =
          "<p>Los dragonborn son guerreros con linaje de dragón, con escamas y rasgos draconianos.</p> <p>Pueden lanzar alientos de energía elemental.</p>";
        textoInfo.innerHTML +=
          "<p>En la sociedad, los dragonborn a menudo se destacan como líderes y defensores de sus comunidades.</p>";
        break;
      case "dwarf":
        imagenInfo.style.backgroundImage = 'url("assets/razas/Dwarf.webp")';
        imagenInfo.style.width = "20vw";
        textoInfo.style.fontSize = "1.1vh";
        textoInfo.innerHTML =
          "<p>Los enanos son expertos artesanos y guerreros resistentes.</p> <p>Tienen una estatura baja, barbas largas y habilidades</p><p> sobresalientes en la metalurgia.</p>";
        textoInfo.innerHTML +=
          "<p>En la guerra, los enanos son conocidos por su tenacidad</p> <p>y habilidades en la forja de armas y armaduras.</p>";
        break;
      case "elf":
        imagenInfo.style.backgroundImage = 'url("assets/razas/elf.webp")';
        textoInfo.innerHTML =
          "<p>Los elfos son seres gráciles y mágicos con orejas puntiagudas.<p/> <p>Son maestros de la arquería y la magia,</p> <p>teniendo una conexión profunda con la naturaleza.</p>";
        textoInfo.innerHTML +=
          "<p>Visten con ropas elegantes y a menudo se destacan</p> <p>como exploradores y defensores de los bosques.</p>";
        textoInfo.style.fontSize = "1.5vh";
        imagenInfo.style.width = "30vw";
        break;
      default:
        imagenInfo.style.backgroundImage = 'url("assets/logo_con_fondo.png")';
        textoInfo.innerHTML =
          '<p>Bienvenido a nuestro generador de fichas</p> <p>esperemos tenga un gran roll! </p> <p style="color: red;">(prohibido lanzar bolas de fuego en la web)</p>';
        console.error("Me he salido.");
        imagenInfo.style.width = "40vh";
        textoInfo.style.fontSize = "2vh";
        break;
    }
  }
}

function generarMonstruoAleatorio() {
  contenidoCompletoWeb.innerHTML = "";
  //  let numeroAleatorioMonstru = Math.floor(Math.random() * data.count);
  fetch("https://www.dnd5eapi.co/api/monsters/")
    .then((response) => response.json())
    .then((data) => {
      var monstruoAleatorio =
        data.results[Math.floor(Math.random() * data.count)];
      return fetch("https://www.dnd5eapi.co" + monstruoAleatorio.url);
    })
    .then((response) => response.json())
    .then((monstruoDetalles) => {
      mostrarDatosMonstruo(monstruoDetalles);
    })
    .catch((error) => {
      console.error("no salgo", error);
    });
}

function mostrarDatosMonstruo(monstruo) {
  let imagenInfo = document.querySelector(".imagenInfo");
  let textoInfo = document.querySelector(".infoTextoAdicional");

  var detallesMonstruo = document.createElement("div");
  detallesMonstruo.classList.add("detallesMonstruo");

  var nombreMonstruo = document.createElement("h2");
  nombreMonstruo.textContent = monstruo.name;

  var tipoMonstruo = document.createElement("p");
  tipoMonstruo.textContent = "Tipo: " + monstruo.type;

  var puntosDeGolpe = document.createElement("p");
  puntosDeGolpe.textContent = "Puntos de Golpe (vida): " + monstruo.hit_points;

  var estadisticasMonstruo = document.createElement("p");
  estadisticasMonstruo.innerHTML += `Estadísticas: <br> Fuerza: ${monstruo.strength}, Destreza: ${monstruo.dexterity}<br>`;
  estadisticasMonstruo.innerHTML += `Constitucion: ${monstruo.constitution}, Inteligencia: ${monstruo.intelligence}<br>`;
  estadisticasMonstruo.innerHTML += `Sabiduria: ${monstruo.wisdom}, Carisma: ${monstruo.charisma}<br>`;
  var dadoDeDano = document.createElement("p");
  dadoDeDano.textContent = "HP(Puntos de golpe): " + monstruo.hit_dice;

  detallesMonstruo.appendChild(nombreMonstruo);
  detallesMonstruo.appendChild(tipoMonstruo);
  detallesMonstruo.appendChild(puntosDeGolpe);
  detallesMonstruo.appendChild(estadisticasMonstruo);
  detallesMonstruo.appendChild(dadoDeDano);

  var descripcionMonstruo = monstruo.desc;

  if (descripcionMonstruo == undefined) {
    textoInfo.innerHTML =
      "<p>No hay información adicional sobre este monstruo</p>";
  } else {
    textoInfo.innerHTML = `<p>${descripcionMonstruo}</p>`;
  }

  var botonGenerarOtro = document.createElement("button");
  botonGenerarOtro.textContent = "Generar Otro Monstruo";
  botonGenerarOtro.addEventListener("click", generarMonstruoAleatorio);

  contenidoCompletoWeb.appendChild(detallesMonstruo);
  contenidoCompletoWeb.appendChild(botonGenerarOtro);

  if (monstruo.image) {
    imagenInfo.style.width = 100 + "vw";
    imagenInfo.style.backgroundImage = `url(https://www.dnd5eapi.co${monstruo.image})`;
  } else {
    imagenInfo.style.backgroundImage = `url(assets/404.png)`;
    imagenInfo.style.width = 100 + "vw";
    imagenInfo.style.backgroundPosition = "center";
  }
}

function tirarDado() {
  document.getElementById("fuerza").value = Math.floor(Math.random() * 20) + 1;
  document.getElementById("destreza").value =
    Math.floor(Math.random() * 20) + 1;
  document.getElementById("constitucion").value =
    Math.floor(Math.random() * 20) + 1;
  document.getElementById("inteligencia").value =
    Math.floor(Math.random() * 20) + 1;
  document.getElementById("sabiduria").value =
    Math.floor(Math.random() * 20) + 1;
  document.getElementById("carisma").value = Math.floor(Math.random() * 20) + 1;
}

function calcularModificador(valorEstadistica) {
  return Math.floor((valorEstadistica - 10) / 2);
}

async function imprimir() {
  const clase = document.getElementById("clases").value;
  const raza = document.getElementById("raza").value;
  const fuerza = document.getElementById("fuerza").value;
  const destreza = document.getElementById("destreza").value;
  const constitucion = document.getElementById("constitucion").value;
  const inteligencia = document.getElementById("inteligencia").value;
  const sabiduria = document.getElementById("sabiduria").value;
  const carisma = document.getElementById("carisma").value;

  const modificadorFuerza = calcularModificador(fuerza);
  const modificadorDestreza = calcularModificador(destreza);
  const modificadorConstitucion = calcularModificador(constitucion);
  const modificadorInteligencia = calcularModificador(inteligencia);
  const modificadorSabiduria = calcularModificador(sabiduria);
  const modificadorCarisma = calcularModificador(carisma);

  const alinieamiento = document.getElementById("alinieamiento").value;
  const objetoInicial = document.getElementById("objeto").value;

  const pdfUrl = "assets/ficha/SheetDnD5.pdf";

  const { PDFDocument } = PDFLib;
  const existingPdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const page = pdfDoc.getPages()[0];

  const fontSize = 12;

  //Stats sin modificador
  const coordenadasClase = { x: 270, y: 735 };
  const coordenadasRaza = { x: 270, y: 710 };
  const coordenadasFuerza = { x: 52, y: 595 };
  const coordenadasDestreza = { x: 52, y: 522 };
  const coordenadasConstitucion = { x: 50, y: 450 };
  const coordenadasInteligencia = { x: 50, y: 376 };
  const coordenadasSabiduria = { x: 50, y: 310 };
  const coordenadasCarisma = { x: 50, y: 234 };

  //modificador de las stats

  const coordenadaModificadorFuerza = { x: 55, y: 615 };
  const coordenadaModificadorDestreza = { x: 55, y: 542 };
  const coordenadaModificadorConstitucion = { x: 55, y: 473 };
  const coordenadaModificadorInteligencia = { x: 55, y: 403 };
  const coordenadaModificadorSabiduria = { x: 55, y: 327 };
  const coordenadaModificadorCarisma = { x: 55, y: 254 };
  const coordenadaAliniacion = { x: 390, y: 710 };
  const coordenadaItems = { x: 270, y: 165 };

  page.setFontSize(fontSize);

  page.drawText(`${clase}, nivel 1`, {
    x: coordenadasClase.x,
    y: coordenadasClase.y,
  });

  page.drawText(`${alinieamiento}`, {
    x: coordenadaAliniacion.x,
    y: coordenadaAliniacion.y,
  });

  page.drawText(`${objetoInicial}`, {
    x: coordenadaItems.x,
    y: coordenadaItems.y,
  });

  page.drawText(`${raza}`, {
    x: coordenadasRaza.x,
    y: coordenadasRaza.y,
  });

  page.drawText(`${fuerza}`, {
    x: coordenadasFuerza.x,
    y: coordenadasFuerza.y,
    fontsize: fontSize,
  });

  page.drawText(`${destreza}`, {
    x: coordenadasDestreza.x,
    y: coordenadasDestreza.y,
    fontsize: fontSize,
  });

  page.drawText(`${constitucion}`, {
    x: coordenadasConstitucion.x,
    y: coordenadasConstitucion.y,
    fontsize: fontSize,
  });

  page.drawText(`${inteligencia}`, {
    x: coordenadasInteligencia.x,
    y: coordenadasInteligencia.y,
    fontsize: fontSize,
  });

  page.drawText(`${sabiduria}`, {
    x: coordenadasSabiduria.x,
    y: coordenadasSabiduria.y,
    fontsize: fontSize,
  });

  page.drawText(`${carisma}`, {
    x: coordenadasCarisma.x,
    y: coordenadasCarisma.y,
    fontsize: fontSize,
  });

  page.drawText(`${modificadorFuerza}`, {
    x: coordenadaModificadorFuerza.x,
    y: coordenadaModificadorFuerza.y,
    fontSize: fontSize,
  });

  page.drawText(`${modificadorDestreza}`, {
    x: coordenadaModificadorDestreza.x,
    y: coordenadaModificadorDestreza.y,
    fontSize: fontSize,
  });

  page.drawText(`${modificadorConstitucion}`, {
    x: coordenadaModificadorConstitucion.x,
    y: coordenadaModificadorConstitucion.y,
    fontSize: fontSize,
  });

  page.drawText(`${modificadorSabiduria}`, {
    x: coordenadaModificadorSabiduria.x,
    y: coordenadaModificadorSabiduria.y,
    fontSize: fontSize,
  });

  page.drawText(`${modificadorInteligencia}`, {
    x: coordenadaModificadorInteligencia.x,
    y: coordenadaModificadorInteligencia.y,
    fontSize: fontSize,
  });

  page.drawText(`${modificadorCarisma}`, {
    x: coordenadaModificadorCarisma.x,
    y: coordenadaModificadorCarisma.y,
    fontSize: fontSize,
  });

  page.drawText(`${modificadorFuerza}`, {
    x: coordenadaModificadorFuerza.x,
    y: coordenadaModificadorFuerza.y,
    fontSize: fontSize,
  });

  const modifiedPdfBytes = await pdfDoc.save();

  const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "ficha_jugador_modificada.pdf";
  link.click();
}
