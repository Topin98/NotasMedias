import { Component, OnInit } from '@angular/core';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { Alumno } from 'src/app/models/alumno';
import { MessagesService } from 'src/app/services/messages.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-nuevos-alumnos',
  templateUrl: './nuevos-alumnos.page.html',
  styleUrls: ['./nuevos-alumnos.page.scss'],
})
export class NuevosAlumnosPage {

  texto: string = "";
  curso: string = "lPrimero";

  constructor(
    private alumnosService: AlumnosService,
    private messagesService: MessagesService,
    private modalCtrl: ModalController) {

  }

  traducir() {

    let lAlumnosInsertar: Alumno[] = [];

    let resultados = this.limpiarTexto();

    resultados.forEach(linea => {

      let nombre;

      try {
        //desde el principio de la linea hasta el primer numero
        nombre = linea.substring(0, linea.match(/\d/).index).trim();
      } catch (err) {

        try {
          //si peta es que tiene como NP
          //(haciendolo asi si tiene un NP y despues un numero el NP se incluye en el nombre)
          nombre = linea.substring(0, linea.match(/NP/).index).trim();

        } catch (error) {
          //si no encuentra ningun numero ni ningun NP
          this.messagesService.presentAlert("Error", "Los datos copiados no son correctos");
          return;
        }
      }

      //quitamos el nombre del textarea, un espacio en blanco que hay entre el nombre y el primer numero y dividimos los numeros en un array
      let notas = linea.replace(new RegExp(nombre, "g"), "").substring(1).split(" ");

      let alumno = this.crearAlumno(nombre, notas);

      //lo añadimos a la lista temporal de los alumnos que se van a insertar
      lAlumnosInsertar.push(alumno);

    });

    this.alumnosService.insertarAlumnos(lAlumnosInsertar);

    this.texto = "";

  }

  limpiarTexto(): string[] {
    this.texto = this.texto
      .replace(/IN|SU|BI|NT|SB|\t|\t /g, "")
      .replace(/\n /g, " ")
      .replace(/\nNP/g, " NP");

    return this.texto.split("\n");
  }

  crearAlumno(nombre: string, notas: string[]): Alumno {

    //buscamos el alumno en la lista de todos los alumnos ya en la base de datos
    let alumno: Alumno = this.alumnosService.lAlumnos.find(x => x.nombre == nombre);

    //si no existe
    if (!alumno) {
      //creamos uno nuevo
      alumno = {
        nombre: nombre
      };
    }

    //ponemos las notas al curso correspondiente
    alumno[this.curso] = notas;

    return alumno;
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

}
