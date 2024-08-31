import {
    Directive,
    EventEmitter,
    forwardRef,
    inject,
    Output
} from '@angular/core';
import {
    AbstractControl,
    AsyncValidator,
    NG_ASYNC_VALIDATORS,
    ValidationErrors
} from '@angular/forms';
import {
    Observable,
    of
} from 'rxjs';
import {
    catchError,
    debounceTime,
    delay,
    distinctUntilChanged,
    map,
    switchMap
} from 'rxjs/operators';
import { ICep } from '../../interfaces/cep.interface';
import { CepService } from '../../services/cep.service';

@Directive({
    standalone: true,
    selector: (
        '[cep][formControlName],' +
        '[cep][formControl],' +
        '[cep][ngModel]'
    ),
    providers: [
        {
            provide: NG_ASYNC_VALIDATORS,
            useExisting: forwardRef(() => CepDirective),
            multi: true
        }
    ]
})
export class CepDirective implements AsyncValidator {
    private cepService = inject(CepService);

    @Output() public cepChange: EventEmitter<ICep | null> = new EventEmitter();

    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        return this.onInputCepChangeAsyncValidator(control);
    }

    onInputCepChangeAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
        if (!control.value) return of(null);

        return of(control.value).pipe(
            map(cepNumber => cepNumber.replace(/\D/g, "")),
            distinctUntilChanged(),
            debounceTime(500),
            switchMap(cepNumber => {
                return this
                    .cepService
                    .getCep(cepNumber)
                    .pipe(
                        map(cep => {
                            if (cep) {
                                this.cepChange.emit(cep);
                            }

                            return null;
                        }),
                        catchError(errors => {
                            if (errors?.name === 'CepPromiseError') {
                                const error = errors?.errors?.[0];
                                const message = error?.message;

                                control.markAsTouched({ onlySelf: true });

                                return of({ apiCep: message });
                            }

                            return of(null);
                        }),
                    )
            })
        );
    }
}