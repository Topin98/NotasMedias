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

  getSuma(alumno: Alumno) {
    let sum = 0;
    this.lNombresListas.forEach(key => {
      sum += alumno[key] ? alumno[key].reduce((sumar, a) => sumar + Number(a), 0) : 0;
    });

    return sum;
  }

  getMedia(alumno: Alumno) {

    let suma = this.getSuma(alumno);

    if (suma) {
      return suma / this.getNumNotas(alumno);
    } else {
      return null;
    }
  }

  getNumNotas(alumno: Alumno) {
    let sum = 0;
    this.lNombresListas.forEach(key => {
      sum += alumno[key] ? alumno[key].filter(x => x).length : 0;
    })

    return sum;
  }

  filtrarAlumnos(lista: Alumno[]) {

    this.lAlumnosFiltrados = lista.filter(x => x.nombre.toUpperCase().includes(this.filtroNombre.toUpperCase()));
  }
}