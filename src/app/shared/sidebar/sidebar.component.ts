import { Component, OnInit } from '@angular/core';
import { MarvelService } from '../../marvel/services/marvel.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {

  constructor(private marvelService: MarvelService) { }

  get historial(){
    return this.marvelService.historial;
  }

  buscar(termino:string){
    this.marvelService.buscarComics(termino);
  }
}
