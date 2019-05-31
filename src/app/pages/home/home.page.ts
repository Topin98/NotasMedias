import { Component } from '@angular/core';
import { Alumno } from 'src/app/models/alumno';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { MessagesService } from 'src/app/services/messages.service';
import { NavController, ModalController } from '@ionic/angular';
import { NuevosAlumnosPage } from '../nuevos-alumnos/nuevos-alumnos.page';
import { AsignaturasPage } from '../asignaturas/asignaturas.page';
import { AsignaturasService } from 'src/app/services/asignaturas.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    public alumnosService: AlumnosService,
    public messagesService: MessagesService,
    public modalController: ModalController,
    public asignaturasService: AsignaturasService) {

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

}
