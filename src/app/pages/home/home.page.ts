import { Component, OnInit } from '@angular/core';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { MessagesService } from 'src/app/services/messages.service';
import { ModalController } from '@ionic/angular';
import { NuevosAlumnosPage } from '../nuevos-alumnos/nuevos-alumnos.page';
import { AsignaturasPage } from '../asignaturas/asignaturas.page';
import { AsignaturasService } from 'src/app/services/asignaturas.service';
import * as XLSX from "xlsx";
import { saveAs } from 'file-saver';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    public alumnosService: AlumnosService,
    public messagesService: MessagesService,
    public modalController: ModalController,
    public asignaturasService: AsignaturasService,
    public authService: AuthenticationService) {
  }

  ngOnInit() {
    this.alumnosService.getAlumnos().subscribe(alumnos => {
      //console.log("alumnos", alumnos);
    });

    this.asignaturasService.getAsignaturas().subscribe(asignaturas => {
      //console.log("asignaturas", asignaturas);
    });
  }

  async goInsertarAlumnos() {
    const modal = await this.modalController.create({
      component: NuevosAlumnosPage
    });

    await modal.present();
  }

  async goInsertarAsignaturas() {

    const modal = await this.modalController.create({
      component: AsignaturasPage,
      cssClass: "asignaturas-modal"
    });

    await modal.present();
  }

  generarExcel() {
    var wb = XLSX.utils.book_new();
    wb.SheetNames.push("sheet");
    var ws_data = this.getDataExcel();
    var ws = XLSX.utils.aoa_to_sheet(ws_data);
    wb.Sheets["sheet"] = ws;
    var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    saveAs(new Blob([this.s2ab(wbout)], { type: "application/octet-stream" }), "NotasMediasESO.xlsx");
  }

  getDataExcel() {
    let resultado = [];

    resultado.push(this.generarCabecera());

    let fila = [];
    this.alumnosService.lAlumnos.forEach(alumno => {
      fila.push(alumno.nombre);
      this.alumnosService.lNombresListas.forEach(key => {

        //si el alumnos tiene la lista de notas del curso
        if (alumno[key]) {
          alumno[key].forEach(nota => {
            fila.push(nota);
          })

          //si no creamos y concatenamos un nuevo array al array de notas para que no se descompagine
          //la relacion de posicion asignatura <-> nota
        } else {
          fila = fila.concat(new Array(this.asignaturasService[key].length).fill(null));
        }
      })
      fila.push(this.alumnosService.getSuma(alumno));
      fila.push(this.alumnosService.getMedia(alumno));
      resultado.push(fila);

      fila = [];
    });

    //console.log("resultado", resultado);

    return resultado;
  }

  generarCabecera(): string[] {

    let fila = ["Nombre"];
    this.asignaturasService.lLAsignaturas.forEach(lAsignaturas => {
      lAsignaturas.forEach(asignatura => {
        fila.push(asignatura.nombre);
      });
    });

    fila.push("Suma");
    fila.push("Media");

    return fila;
  }

  s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  logout(){
    this.authService.logout();
  }

}
