import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Result } from '../interface/marvel.interface';
import { MarvelService } from '../services/marvel.service';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})
export class CharacterComponent {

  private comic: string = "";
  btnCerrar = 'assets/icons/btn-close.png';
  iconFavourites = 'assets/icons/btn-favourites-primary.png'
  iconShopping = 'assets/icons/shopping-cart-primary.png'

  constructor(private marvelService: MarvelService, 
              private modalService: NgbModal,
              ) {
    this.comic = marvelService.personajeSeleccionado;
   // console.log(this.comic);
  }

  get resultados(){
    return this.marvelService.resultadosDetalles;
  }

  closeModal(){
    this.modalService.dismissAll();
  }

  AnadirFavoritos(comic:Result){
    alert("Personaje añadido con éxito");
    this.marvelService.favoritos.unshift(comic);
  }
}
