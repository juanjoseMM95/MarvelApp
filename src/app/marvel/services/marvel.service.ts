import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchMarvelResponse, Result } from '../interface/marvel.interface';
import { empty } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarvelService {

  private apiKeyPublic: string = "5a1ca8d6edc204a1f94e4e006901eb02";
  private apiKeyPrivate: string = "b3ab537049fbd0ff6cf0b0910d72b299e0fbd209";
  private hash: string = "3b5be3d0cdce6506c6b4d3e005b9a1f5";
  private servicioUrl: string = "https://gateway.marvel.com:443/v1/public/characters"
  private _historial: string[] = [];
  public resultadosBus: Result[] = [];

  public personajeSeleccionado: string = "";

  constructor(private http: HttpClient, ){

    //petición para que cargue todas las imágenes
    this.http.get<SearchMarvelResponse>(`https://gateway.marvel.com:443/v1/public/characters?&ts=1&apikey=5a1ca8d6edc204a1f94e4e006901eb02&hash=3b5be3d0cdce6506c6b4d3e005b9a1f5`)
    .subscribe((resp)=>{
      console.log(resp.data);
      this.resultadosBus = resp.data.results;
    })

    //traer la información del local storage
    this._historial = JSON.parse(localStorage.getItem('historial')!)||[];
  }

  get historial(){
    //obligo a paso por valor y no por referencia
    return [...this._historial];
  }

  buscarComics(query: string){

    //elimine espacios y siempre la ponga en minuscula
    query = query.trim().toLowerCase();

    if(!this._historial.includes(query)){
      this._historial.unshift(query);
      //configuración del historial para almacenar 10 valores
      this._historial = this.historial.splice(0,10);
      localStorage.setItem('historial',JSON.stringify(this._historial));
    }


    this.http.get<SearchMarvelResponse>(`https://gateway.marvel.com:443/v1/public/characters?name=${ query }&limit=10&ts=1&apikey=5a1ca8d6edc204a1f94e4e006901eb02&hash=3b5be3d0cdce6506c6b4d3e005b9a1f5`)
    .subscribe((resp)=>{
      console.log(resp.data);
      this.resultadosBus = resp.data.results;
    })
  }



}
