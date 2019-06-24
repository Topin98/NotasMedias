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

  constructor(public db: AngularFirestore) {

    this.alumnosCollection = db.collection<Alumno>("alumnos");

    this.alumnos = this.alumnosCollection.snapshotChanges().pipe(
      map(res => {
        return res.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      }),
      map(alumnos => {
        console.log("alumnos", alumnos);

        this.lAlumnos = alumnos;
        this.filtrarAlumnos();

        return alumnos;
      })
    );
  }

  getAlumnos() {
    return this.alumnos;
  }

  insertarAlumnos(lAlumnos: Alumno[]) {
    let batch = this.db.firestore.batch();
    lAlumnos.forEach(alumno => {
      batch.set(this.alumnosCollection.doc(this.db.createId()).ref, alumno);
    });
    batch.commit();
  }

  actualizarAlumno(alumno: Alumno) {
    this.alumnosCollection.doc(alumno.id).set(alumno);
  }

  eliminarAlumno(alumno: Alumno) {
    this.alumnosCollection.doc(alumno.id).delete();
  }

  getSuma(alumno: Alumno) {
    let sum = 0;
    this.lNombresListas.forEach(key => {
      sum += alumno[key] ? alumno[key].filter(x => !isNaN(x)).reduce((sumar, a) => sumar + Number(a), 0) : 0;
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

  filtrarAlumnos() {
    this.lAlumnosFiltrados = this.lAlumnos.filter(x => x.nombre.toUpperCase().includes(this.filtroNombre.toUpperCase()));
  }
}