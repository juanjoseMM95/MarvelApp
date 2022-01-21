import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultadosComponent } from './marvel/resultados/resultados.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', redirectTo: '/resultados', pathMatch: 'full'
  },
  {
    path: 'resultados', component: ResultadosComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes,{ onSameUrlNavigation: 'reload' }),
    CommonModule
  ],
  exports:[
    RouterModule
  ]
})
export class AppRoutingModule { }
