import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MarvelService } from '../services/marvel.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent {

  @ViewChild('txtBuscar') txtBuscar!:ElementRef<HTMLInputElement>;

  constructor(private marvelService: MarvelService){}

  buscar(){
    const valor = this.txtBuscar.nativeElement.value;
    this.marvelService.buscarComics(valor);
    this.txtBuscar.nativeElement.value = "";
  }

}
