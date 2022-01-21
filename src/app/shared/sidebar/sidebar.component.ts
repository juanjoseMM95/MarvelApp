import { Component, OnInit } from '@angular/core';
import { MarvelService } from '../../marvel/services/marvel.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls:['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(private marvelService: MarvelService) { }

  get historial(){
    return this.marvelService.historial;
  }

  buscar(termino:string){
    this.marvelService.buscarComics(termino);
  }

  VerFavoritos(){
    this.marvelService.MostrarFavoritos();
  }

  GeneraAleatorios(){
    this.marvelService.GeneraAleatorios();
  }

}
