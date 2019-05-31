import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { AsignaturasService } from 'src/app/services/asignaturas.service';
import { Asignatura } from 'src/app/models/asignatura';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-asignaturas',
  templateUrl: './asignaturas.page.html',
  styleUrls: ['./asignaturas.page.scss'],
})
export class AsignaturasPage {

  constructor(
    public modalCtrl: ModalController,
    public asignaturasService: AsignaturasService,
    public alertController: AlertController,
    public messagesService: MessagesService) {

  }

  async nuevaAsignaturaAlert(curso: number) {

    const alert = await this.alertController.create({
      header: 'Nueva asignatura',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: "Nombre..."
        },
        {
          name: 'index',
          type: 'number',
          placeholder: "Posición..."
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Guardar',
          handler: data => {
            if (!data.nombre.trim() || !data.index) return false;

            let asignatura: Asignatura = {
              nombre: data.nombre,
              curso: curso,
              index: Number(data.index)
            }

            this.asignaturasService.insertarAsignatura(asignatura);
          }
        }
      ]
    });

    await alert.present();

  }

  async editarAsignaturaAlert(asignatura: Asignatura) {

    const alert = await this.alertController.create({
      header: 'Editar asignatura',
      cssClass: 'editar-asignatura',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: "Nombre...",
          value: asignatura.nombre
        },
        {
          name: 'index',
          type: 'number',
          placeholder: "Posición...",
          value: asignatura.index
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: "Eliminar",
          handler: () => {

            this.messagesService.presentAlertConfirm("Confirmación", "Estás seguro que quiere borrar la asignatura?", () => {
              this.asignaturasService.eliminarAsignatura(asignatura);
            });
          }
        },
        {
          text: 'Guardar',
          handler: data => {
            if (!data.nombre.trim() || !data.index) return false;

            asignatura.nombre = data.nombre;
            asignatura.index = data.index;

            this.asignaturasService.actualizarAsignatura(asignatura);
          }
        }
      ]
    });

    await alert.present();
  }


  cerrar() {
    this.modalCtrl.dismiss();
  }

}
