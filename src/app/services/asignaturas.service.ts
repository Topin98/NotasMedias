import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Asignatura } from '../models/asignatura';

@Injectable({
  providedIn: 'root'
})
export class AsignaturasService {

  private asignaturasCollection: AngularFirestoreCollection<Asignatura>;

  private asignaturas: Observable<Asignatura[]>;

  public lAsignaturas: Asignatura[] = [];
  public lLAsignaturas: Asignatura[][] = []; //simplifica el html de asignaturas page
  public lPrimero: Asignatura[] = [];
  public lSegundo: Asignatura[] = [];
  public lTercero: Asignatura[] = [];
  public lCuarto: Asignatura[] = [];

  constructor(db: AngularFirestore) {

    this.asignaturasCollection = db.collection<Asignatura>("asignaturas");

    this.asignaturas = this.asignaturasCollection.snapshotChanges().pipe(
      map(res => {
        return res.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      }),
      map(asignaturas => {
        //console.log("asignaturas", asignaturas);

        this.lAsignaturas = asignaturas;

        this.lPrimero = this.filtrarAsignaturas(1);
        this.lSegundo = this.filtrarAsignaturas(2);
        this.lTercero = this.filtrarAsignaturas(3);
        this.lCuarto = this.filtrarAsignaturas(4);

        this.lLAsignaturas = [];
        this.lLAsignaturas.push(this.lPrimero, this.lSegundo, this.lTercero, this.lCuarto);

        return asignaturas;
      })
    );
  }

  getAsignaturas() {
    return this.asignaturas;
  }

  filtrarAsignaturas(curso: number) {
    return this.lAsignaturas.filter(x => x.curso == curso).sort((a1, a2) => a1.index < a2.index ? -1 : 1);
  }

  insertarAsignatura(asignatura: Asignatura) {
    this.asignaturasCollection.add(asignatura);
  }

  actualizarAsignatura(asignatura: Asignatura) {
    this.asignaturasCollection.doc(asignatura.id).set(asignatura);
  }

  eliminarAsignatura(asignatura: Asignatura) {
    this.asignaturasCollection.doc(asignatura.id).delete();
  }


}
