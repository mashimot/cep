import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { LanguageType } from './language.type';
import { getCurrencySymbol } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  protected language$: BehaviorSubject<any> = new BehaviorSubject('EN');

  constructor() { }

  public setLanguage(value: LanguageType): void {
    this.language$.next(value);
  }

  public getLanguage(): Observable<LanguageType> {
    return this.language$.asObservable();
  }

  public getCurrencyByLanguage(): Observable<string> {
    return this.getLanguage()
      .pipe(
        map((response: LanguageType) => {
          const currencyByLanguage = {
            'EN': 'USD',
            'PT': 'BRL'
          };

          return currencyByLanguage?.[response] || "BRL"
        })
      );
  }

  public getCurrencySymbol(): Observable<string> {
    return this.getLanguage()
      .pipe(
        map((response: LanguageType) => {
          const currencyByLanguage = {
            'EN': 'USD',
            'PT': 'BRL'
          };

          return getCurrencySymbol(currencyByLanguage?.[response] || "BRL", 'narrow');
        })
      );
  }

  public getLanguages(): Observable<LanguageType[]> {
    return of(['PT', 'EN']);
  }
}
