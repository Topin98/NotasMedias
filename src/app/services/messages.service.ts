import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private alertController: AlertController) { }

  async presentAlert(titulo: string, mensaje: string) {

    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentAlertConfirm(titulo: string, mensaje: string, handlerConfirm) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: () => {
            handlerConfirm();
          }
        }
      ]
    });

    await alert.present();
  }
}