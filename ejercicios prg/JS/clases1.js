//clases.js


class Sistema {
    constructor() {
        this.temas = [];
        this.preguntasTotales = []; // Matriz para almacenar todas las preguntas
        this.colorIndex = 0; // Para mantener un índice de color
    }

    generarColorClase() {
        // Lista de clases CSS correspondientes a los colores
        const clasesColores = [
            "color-tema-0", "color-tema-1", "color-tema-2", "color-tema-3", "color-tema-4",
            "color-tema-5", "color-tema-6", "color-tema-7", "color-tema-8", "color-tema-9",
            "color-tema-10", "color-tema-11", "color-tema-12", "color-tema-13", "color-tema-14"
        ];
        // Obtener la clase CSS y aumentar el índice
        const clase = clasesColores[this.colorIndex % clasesColores.length];
        this.colorIndex++;
        return clase;
    }

    agregarTema(nombre, descripcion) {
        const colorClase = this.generarColorClase();
        let temaNuevo = new Tema(nombre, descripcion, colorClase);
        this.temas.push(temaNuevo);
    }

    obtenerTemas() {
        return this.temas;
    }

    agregarPregunta(temaNombre, nivel, texto, respuestaCorrecta, respuestasIncorrectas) {
        let tema = this.temas.find(t => t.nombre === temaNombre);
        if (tema) {
            let preguntaNueva = new Pregunta(temaNombre, nivel, texto, respuestaCorrecta, respuestasIncorrectas);
            tema.agregarPregunta(preguntaNueva);
            this.preguntasTotales.push(preguntaNueva); // Añadir la pregunta a la matriz general
        }
    }

    obtenerPreguntasDeTema(temaNombre) {
        let tema = this.temas.find(t => t.nombre === temaNombre);
        if (tema) {
            return tema.obtenerPreguntas();
        } else {
            return [];
        }
    }

    obtenerTodasLasPreguntas() {
        return this.preguntasTotales;
    }

    promedioFuncion(){
        let promedio = 0;
        if(this.temas.length > 0){
            promedio = this.preguntasTotales.length / this.temas.length;
        } else {
            promedio = "Sin datos";
        }
        return promedio;
    }
}

class Tema {
    constructor(nombre, descripcion, color) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.color = color;
        this.preguntas = [];
    }

    agregarPregunta(pregunta) {
        this.preguntas.push(pregunta);
    }

    obtenerCantidadPreguntas() {
        return this.preguntas.length;
    }

    obtenerPreguntas() {
        return this.preguntas;
    }
}

class Pregunta {
    constructor(tema, nivel, texto, respuestaCorrecta, respuestasIncorrectas) {
        this.tema = tema;
        this.nivel = nivel;
        this.texto = texto;
        this.respuestaCorrecta = respuestaCorrecta;
        this.respuestasIncorrectas = respuestasIncorrectas;
    }
}

/*
class Agenda{
    constructor(){
        this.lista = [];
    }
    agregar(unContacto){
        this.lista.push(unContacto);
        this.lista.sort(function(a,b){ return a.compararCon(b)});
    }
    darTodos(){
        return this.lista;
    }
    darJovenes(){
        let ret = [];
        for(let elem of this.lista){
            if(elem.esJoven()){
                ret.push(elem);
            }
        }
        return ret;
    }

    eliminar(pos){
        if(pos >= 0 && pos < this.lista.length){
            this.lista.splice(pos,1);
        }
    }

    estaTelefono(telefono){
        let esta = false;
        for(let i = 0; i < this.lista.length && !esta; i++){
            if(this.lista[i].telefono == telefono){
                esta = true;
            }
        }
        return esta;
    }
    /*
    masJoven(){
        let pos = -1;
        let edad = 61;
        for(let i = 0; i < this.lista.length; i++){
            if(this.lista[i].edad < edad){
                pos = i;
                edad = this.lista[i].edad;
            }
        }
        return this.lista[pos];
    }
    */
/*
    masJoven(){
        return this.lista[0];
    }

    cantidadMismaEdad(){
        let cant = 0;
        let edad = this.lista[0].edad;
        for(let i = 1; i < this.lista.length; i++){
            if(edad == this.lista[i].edad){
                cant++;
            }
            else{
                edad = this.lista[i].edad;
            }
        }
        return cant;
    }
}
*/