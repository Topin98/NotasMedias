import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AlumnosService } from './services/alumnos.service';
import { AsignaturasService } from './services/asignaturas.service';

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
    public asignaturasService: AsignaturasService) {

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.alumnosService.getAlumnos().subscribe(alumnos => {
        //console.log("alumnos", alumnos);
      });

      this.asignaturasService.getAsignaturas().subscribe(asignaturas => {
        //console.log("asignaturas", asignaturas);
      });
    });
  }
}
