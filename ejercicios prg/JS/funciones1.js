window.addEventListener("load", inicio);


let sistema = new Sistema();

function inicio() {
    document.getElementById('idFormTemas').addEventListener('submit', agregarTema);
    document.getElementById('idFormPreguntas').addEventListener('submit', agregarPregunta);
    document.getElementById('idTemaCreciente').addEventListener('change', actualizarTablaPreguntas);
    document.getElementById('idTemaDecreciente').addEventListener('change', actualizarTablaPreguntas);

    actualizarTotalPreguntasRegistradas();

        mostrarSeccion('Descripcion-general');
    }
    // document.getElementById("Administrar").addEventListener('click', mostrarSeccion("Gestion-de-temas"));
    // document.getElementById("Jugar").addEventListener('click', mostrarSeccion("jugar"));


    /*document.querySelectorAll('.navegador a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const sectionId = event.target.getAttribute('data-section');
            mostrarSeccion(sectionId);
        });
    }); 
*/    




function mostrarSeccion(id) {
    // Ocultar todas las secciones
    document.querySelectorAll('main section').forEach(section => {
        section.style.display = 'none';
    });

    // Mostrar la sección seleccionada
    let seccionSeleccionada = document.getElementById(id);
    if (seccionSeleccionada) {
        seccionSeleccionada.style.display = 'block';
    }
}


function agregarTema(event) {
    if(document.getElementById("idFormTemas").reportValidity()){
    event.preventDefault();

    let nombre = document.getElementById('idNombreTema').value;
    let descripcion = document.getElementById('idDescripcionTema').value;

    sistema.agregarTema(nombre, descripcion);
   
    document.getElementById("idFormTemas").reset();
    actualizar();
    }
}
function agregarPregunta(event) {
    event.preventDefault();
    let temaSeleccionado = document.getElementById('idTema').value;
    let nivel = document.getElementById('idNivel').value;
    let texto = document.getElementById('idPregunta').value;
    let respuestaCorrecta = document.getElementById('idCorrecto').value;
    let respuestasIncorrectas = document.getElementById('idIncorrectas').value.split(',');

    sistema.agregarPregunta(temaSeleccionado, nivel, texto, respuestaCorrecta, respuestasIncorrectas);
    
    document.getElementById("idFormPreguntas").reset(); // Resetea el formulario de preguntas
    actualizar();
    actualizarTotalPreguntasRegistradas();
}


function actualizar() {
    cargarLista();
    cargarCombo();
    actualizarTotalTemas();
    actualizarTemasSinPreguntas();
    actualizarTablaPreguntas();
    actualizarPromedioPreguntas(); 
    actualizarTotalPreguntasRegistradas();
}


function cargarLista() {
    let lista = document.getElementById("idLista");
    lista.innerHTML = "";
    let datos = sistema.obtenerTemas();
    for (let elem of datos) {
        let nodo = document.createElement("LI");
        let nodoTexto = document.createTextNode(`${elem.nombre}: ${elem.descripcion}`);
        nodo.appendChild(nodoTexto);
        lista.appendChild(nodo);
    }
}

function cargarCombo() {
    let selectTema = document.getElementById('idTema');
    let selectTemaAElegir = document.getElementById('idTemaAElegir');
    selectTema.innerHTML = '';
    selectTemaAElegir.innerHTML = '';
    let temas = sistema.obtenerTemas();
    temas.forEach(tema => {
        let option = document.createElement('option');
        option.value = tema.nombre;
        option.textContent = tema.nombre;
        selectTema.appendChild(option);
        selectTemaAElegir.appendChild(option.cloneNode(true));
    });
}

function actualizarTablaPreguntas() {
    let tablaPreguntas = document.getElementById('idTabla');
    
    // Mantener solo los encabezados de la tabla
    let encabezados = tablaPreguntas.rows[0].outerHTML;
    tablaPreguntas.innerHTML = encabezados; // Reiniciar la tabla manteniendo los encabezados

    // Obtener todas las preguntas del sistema
    let preguntas = sistema.obtenerTemas().flatMap(tema => tema.obtenerPreguntas());
// Determinar el criterio de ordenamiento
let ordenarDecreciente = document.getElementById('idTemaDecreciente').checked;

// Ordenar preguntas siempre por nivel creciente, luego por tema alfabéticamente (normal o inverso)
preguntas.sort((a, b) => {
    if (ordenarDecreciente) {
        if (a.tema > b.tema) return -1;
        if (a.tema < b.tema) return 1;
    } else {
        if (a.tema < b.tema) return -1;
        if (a.tema > b.tema) return 1;
    }
    return a.nivel - b.nivel; // Nivel creciente
});

    // Iterar sobre cada pregunta y agregar una fila a la tabla
    preguntas.forEach(pregunta => {
        let fila = tablaPreguntas.insertRow(); // Crear una nueva fila

        // Insertar celdas y asignar el contenido
        let celdaTema = fila.insertCell(0);
        let celdaNivel = fila.insertCell(1);
        let celdaTexto = fila.insertCell(2);
        let celdaRespuestaCorrecta = fila.insertCell(3);
        let celdaRespuestasIncorrectas = fila.insertCell(4);

        // Asignar el contenido a cada celda
        celdaTema.textContent = pregunta.tema;
        celdaNivel.textContent = pregunta.nivel;
        celdaTexto.textContent = pregunta.texto;
        celdaRespuestaCorrecta.textContent = pregunta.respuestaCorrecta;
        celdaRespuestasIncorrectas.textContent = pregunta.respuestasIncorrectas.join(', ');


        let tema = sistema.obtenerTemas().find(t => t.nombre === pregunta.tema);
        if (tema) {
            fila.classList.add(tema.color);
        }
        
    });


    

    // Actualizar el contador de preguntas
    document.getElementById('totalPreguntas').textContent = preguntas.length;
}


function actualizarTotalTemas() {
    let totalTemas = sistema.obtenerTemas().length;
    document.getElementById('totalTemas').textContent = totalTemas;
}

function contarTemasSinPreguntas() {
    let temasSinPreguntas = sistema.obtenerTemas().filter(tema => tema.obtenerCantidadPreguntas() === 0);
    return temasSinPreguntas.length;
}

function actualizarTemasSinPreguntas() {
    let temasSinPreguntas = sistema.obtenerTemas().filter(tema => tema.obtenerCantidadPreguntas() === 0);
    document.getElementById('totalTemasSinPreguntas').textContent = temasSinPreguntas.length;

    let listaTemasSinPreguntas = document.getElementById('listaTemasSinPreguntas');
    listaTemasSinPreguntas.innerHTML = '';
    temasSinPreguntas.forEach(tema => {
        let li = document.createElement('li');
        li.textContent = tema.nombre;
        listaTemasSinPreguntas.appendChild(li);
    });
}


function actualizarPromedioPreguntas() {
    let totalTemas = sistema.obtenerTemas().length;
    let totalPreguntas = sistema.obtenerTemas().reduce((acc, tema) => acc + tema.obtenerPreguntas().length, 0);

    let promedio = totalTemas > 0 ? (totalPreguntas / totalTemas).toFixed(2) : 0;
    promedio=sistema.promedioFuncion()
    document.getElementById('promedioPreguntas').textContent = promedio;
}


function actualizarTotalPreguntasRegistradas() {
    let totalPreguntas = sistema.obtenerTodasLasPreguntas().length;
    document.getElementById('totalPreguntasRegistradas').innerHTML = totalPreguntas;
}






