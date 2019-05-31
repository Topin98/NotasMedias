import { Injectable } from '@angular/core';
import { Alumno } from '../models/alumno';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {

  public readonly lNombresListas: string[] = ["lPrimero", "lSegundo", "lTercero", "lCuarto"];

  private alumnosCollection: AngularFirestoreCollection<Alumno>;
  private alumnos: Observable<Alumno[]>;
  public lAlumnos: Alumno[] = [];
  public lAlumnosFiltrados: Alumno[] = [];

  public filtroNombre: string = "";
  public filtroCurso: string = "";

  constructor(db: AngularFirestore) {

    this.alumnosCollection = db.collection<Alumno>("alumnos");

    this.alumnos = this.alumnosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );

    this.alumnos.subscribe(alumnos => {
      console.log("alumnos", alumnos);

      this.lAlumnos = alumnos;

      this.filtrarAlumnos(alumnos);
    })

  }

  getAlumnos() {
    return this.alumnos;
  }

  insertarAlumnos(lAlumnos: Alumno[]) {
    lAlumnos.forEach(alumno => this.insertarAlumno(alumno));
  }

  insertarAlumno(alumno: Alumno) {
    if (alumno.id) {
      this.alumnosCollection.doc(alumno.id).set(alumno);
    } else {
      this.alumnosCollection.add(alumno);
    }
  }

  eliminarAlumno(alumno: Alumno) {
    this.alumnosCollection.doc(alumno.id).delete();
  }

  getSuma(alumno: Alumno, lista: string) {
    return alumno[lista] ? alumno[lista].reduce((sumar, a) => sumar + Number(a), 0) : null;
  }

  getMedia(alumno: Alumno, lista: string) {

    let suma = this.getSuma(alumno, lista);

    if (suma) {
      return suma / alumno[lista].filter(x => x).length;
    } else {
      return null;
    }
  }

  filtrarAlumnos(lista: Alumno[]){
    
    this.lAlumnosFiltrados = lista.filter(x => x.nombre.toUpperCase().includes(this.filtroNombre.toUpperCase()));
  }
}