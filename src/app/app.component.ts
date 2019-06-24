import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AlumnosService } from './services/alumnos.service';
import { AsignaturasService } from './services/asignaturas.service';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public alumnosService: AlumnosService,
    public asignaturasService: AsignaturasService,
    public authService: AuthenticationService,
    public navCtrl: NavController) {

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.authService.getState().subscribe(user => {
        //console.log("user?", user);

        if (user){
          this.navCtrl.navigateRoot("/");
        } else {
          this.navCtrl.navigateRoot("/login");
        }
      })
    });
  }
}
