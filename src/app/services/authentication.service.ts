import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private afAuth: AngularFireAuth) {
  }

  getState() {
    return this.afAuth.authState;
  }

  public login(username, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(username, password);
  }

  public logout() {
    return this.afAuth.auth.signOut();
  }
}
