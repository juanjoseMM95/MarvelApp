import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { ResultadosComponent } from './resultados/resultados.component';
import { MarvelPagesComponent } from './marvel-pages/marvel-pages.component';
import { CharacterComponent } from './character/character.component';



@NgModule({
  declarations: [
    MarvelPagesComponent,
    BusquedaComponent,
    ResultadosComponent,
    CharacterComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    MarvelPagesComponent
  ]
})
export class MarvelModule { }
