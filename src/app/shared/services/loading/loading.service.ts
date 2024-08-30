import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  protected loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }

  public show(): void {
    this.loading$.next(true);
  }

  public hide(): void {
    this.loading$.next(false);
  }

  public isLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }
}
