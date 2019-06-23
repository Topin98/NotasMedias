import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NavController } from '@ionic/angular';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public username: string;
  public password: string;

  constructor(
    public authService: AuthenticationService,
    public navCtrl: NavController,
    public messages: MessagesService) {
  }

  ngOnInit(){
    this.username = window.localStorage.getItem("username");
  }

  login() {
    this.authService.login(this.username, this.password).then(data => {
      window.localStorage.setItem("username", this.username);
    }).catch(error => {
      this.messages.presentAlert("Error", "Correo o contraseña incorrectos");
    })
  }
}
