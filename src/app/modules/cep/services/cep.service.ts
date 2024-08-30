import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, delay, from, map, Observable, of, tap, throwError } from 'rxjs';
import cep from 'cep-promise';
import { ICep, IViaCep } from '../interfaces/cep.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
	providedIn: 'root'
})
export class CepService {
	protected readonly URL: string = "https://viacep.com.br/ws/01001000/json/";

	private http = inject(HttpClient);
	// private snackBar = inject(MatSnackBar);
	
	constructor(
	) { }

	public getCepByNumber(cepNumber: string): Observable<ICep | null> {
		return this.http.get<IViaCep>(`https://viacep.com.br/ws/${cepNumber}/json/`)
			.pipe(
				map(response => {
					return {
						"cep": response.cep,
						"state": response.uf,
						"city": response.localidade,
						"street": response.logradouro,
						"neighborhood": response.bairro
					}
				})
			);
	}

	public getCep(cepNumber: string): Observable<ICep | null> {
		return from(
			cep(cepNumber, { providers: ['brasilapi'] })
		);
	}
}
