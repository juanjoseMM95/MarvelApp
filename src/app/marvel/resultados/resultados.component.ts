import { Component, OnInit } from '@angular/core';
import { Result } from '../interface/marvel.interface';
import { MarvelService } from '../services/marvel.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CharacterComponent } from '../character/character.component';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styles: [
  ]
})
export class ResultadosComponent {

  constructor(private marvelService: MarvelService,
              private modalService: NgbModal) { }
  
  get resultados(){
    return this.marvelService.resultadosBus;
  }

  openDialog(comic: Result){
    this.marvelService.personajeSeleccionado = comic.name;
    this.marvelService.buscarComics(comic.name);
    this.modalService.open(CharacterComponent, { windowClass : "myCustomModalClass"});
  }

}
