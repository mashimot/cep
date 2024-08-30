import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { IBusiness } from '../interfaces/business.interface';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private httpClient = inject(HttpClient);
  private URL: string = 'https://antlia-mockapi.azurewebsites.net/api/v1/itau_teste';

  constructor(
  ) { }

  public getBusinesses(): Observable<IBusiness[]> {
    return this.httpClient.get<IBusiness[]>(this.URL);
  }

  public getBusinessById(id: number): Observable<IBusiness> {
    return this.httpClient.get<IBusiness>(`${this.URL}/${id}`);
  }

  public store(business: IBusiness) {
    return of({ success: true })
      .pipe(
        delay(3000)
      );
  }

  public update(business: IBusiness) {
    return of({ success: true })
      .pipe(
        delay(3000)
      );
  }

  public destroy(id: number) {
    return of({ success: true })
      .pipe(
        delay(3000)
      );
  }
}
