import { Injectable } from '@angular/core';
import { Observable, fromEvent, map, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowResizeService {


  resize$: Observable<number>;

  
  constructor() {
    this.resize$ = fromEvent(window, 'resize').pipe(
      startWith(window.innerWidth),
      map(() => window.innerWidth)
    );
  }
}
