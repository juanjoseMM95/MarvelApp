import { Component, OnInit } from '@angular/core';
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

  constructor(private marvelService: MarvelService) {
    this.comic = marvelService.personajeSeleccionado;
    console.log(this.comic);
  }

  get resultados(){
    return this.marvelService.resultadosBus;
  }


}
