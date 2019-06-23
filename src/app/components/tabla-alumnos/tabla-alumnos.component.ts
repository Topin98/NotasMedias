import { Component, Input } from '@angular/core';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { AsignaturasService } from 'src/app/services/asignaturas.service';
import { Alumno } from 'src/app/models/alumno';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-tabla-alumnos',
  templateUrl: './tabla-alumnos.component.html',
  styleUrls: ['./tabla-alumnos.component.scss'],
})
export class TablaAlumnosComponent {

  @Input() lista: string;
  @Input() titulo: string;

  constructor(
    public alumnosService: AlumnosService,
    public asignaturasService: AsignaturasService,
    public messages: MessagesService) {

  }

  actualizarNombre(nuevoNombre: string, alumno: Alumno) {
    if (nuevoNombre){
      alumno.nombre = nuevoNombre;
      this.alumnosService.insertarAlumno(alumno);

    } else {
      this.messages.presentAlertConfirm("Eliminar alumno", "Estás seguro que quieres eliminar el alumno?", () => {
        this.alumnosService.eliminarAlumno(alumno);
      });
    }
  }

  actualizarNota(nuevaNota: string, index: number, alumno: Alumno) {
    alumno[this.lista][index] = nuevaNota;
    this.alumnosService.insertarAlumno(alumno);
  }

  getSuma(alumno: Alumno){
    return this.alumnosService.getSuma(alumno);
  }

  getMedia(alumno: Alumno){
    return this.alumnosService.getMedia(alumno);
  }

}
