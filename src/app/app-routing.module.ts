import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'insertarAlumnos', loadChildren: './pages/nuevos-alumnos/nuevos-alumnos.module#NuevosAlumnosPageModule' },
  { path: 'asignaturas', loadChildren: './pages/asignaturas/asignaturas.module#AsignaturasPageModule' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
