import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  //extrai apenas os números da string
  public extractJustNumbers(value: string): string {
    return value.replace(/\D/g, "");
  }
}
