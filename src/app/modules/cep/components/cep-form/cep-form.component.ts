import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    ReactiveFormsModule,
    ValidationErrors,
    Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import {
    Observable,
    of
} from 'rxjs';
import {
    catchError,
    debounceTime,
    distinctUntilChanged, filter, finalize,
    map,
    switchMap,
    take,
    tap
} from 'rxjs/operators';
import { ICep } from '../../interfaces/cep.interface';
import { CepService } from '../../services/cep.service';

@Component({
    selector: 'app-cep',
    templateUrl: './cep-form.component.html',
    styleUrls: ['./cep-form.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSnackBarModule,
        MatInputModule,
        MatIconModule,
        MatProgressSpinnerModule,
        JsonPipe,
        AsyncPipe,
        NgxMaskDirective,
        NgxMaskPipe
    ]
})
export class CepFormComponent implements OnInit, OnChanges {
    private formBuilder = inject(FormBuilder);
    private cepService = inject(CepService);
    private snackBar = inject(MatSnackBar);

    public cepFormControl!: FormControl;

    @Input() cepNumber?: string;

    @Output() public cepChange: EventEmitter<ICep | null> = new EventEmitter();
    @Output() public state = new EventEmitter<boolean>();

    constructor() { }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.cepFormControl) {
            this.cepFormControl = this.buildForm();
            this.onInputCepChange();
        }

        if (changes['cepNumber'].currentValue) {
            this.cepFormControl.setValue(this.cepNumber);
        }
    }

    buildForm(): FormControl {
        return this.formBuilder.control(
            (this.cepNumber || ''),
            [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(10)
            ],
            [
                // (control: AbstractControl): Observable<ValidationErrors | null> => {
                //     return this.onInputCepChangeAsyncValidator(control);
                // }
            ]
        );
    }

    // onInputCepChangeAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    //     return control.valueChanges.pipe(
    //         map(cepNumber => cepNumber.replace(/\D/g, "")),
    //         distinctUntilChanged(),
    //         debounceTime(500),
    //         take(1),
    //         switchMap(cepNumber => {
    //             this.state.emit(true);

    //             return this
    //                 .cepService
    //                 .getCep(cepNumber)
    //                 .pipe(
    //                     map(cep => {
    //                         if (cep) {
    //                             this.cepChange.emit(cep);
    //                         }

    //                         return null;
    //                     }),
    //                     catchError(errors => {
    //                         if (errors?.name === 'CepPromiseError') {
    //                             const message = errors?.errors?.[0];
    //                             return of({ apiCep: message }).pipe(
    //                                 tap(response => {
    //                                     this.snackBar.open(
    //                                         response.apiCep.message,
    //                                         'x',
    //                                         {
    //                                             horizontalPosition: 'center',
    //                                             verticalPosition: 'top'
    //                                         }
    //                                     );
    //                                 }),
    //                                 tap(() => this.cepFormControl.markAsTouched({ onlySelf: true }))
    //                             )
    //                         }

    //                         return of(null);
    //                     }),
    //                     finalize(() => this.state.emit(false))
    //                 )
    //         }),
    //     );
    // }

    onInputCepChange(): void {
        this.cepFormControl.valueChanges.pipe(
            filter(cepNumber => cepNumber.length > 3),
            filter(cepNumber => this.cepFormControl.valid ? true : false),
            debounceTime(500),
            map(cepNumber => cepNumber.replace(/\D/g, "")), //captura apenas os números da string
            distinctUntilChanged(),
            tap(cepNumber => this.state.next(true)),
            tap(() => this.cepFormControl.setErrors(null)),
            switchMap(cepNumber => {
                return this
                    .cepService
                    .getCep(cepNumber)
                    .pipe(
                        catchError(errors => {
                            if (errors?.name === 'CepPromiseError') {
                                const message = errors?.errors?.[0];
                                
                                return of(null).pipe(
                                    tap(response => {
                                        this.snackBar.open(
                                            message,
                                            'x',
                                            {
                                                horizontalPosition: 'center',
                                                verticalPosition: 'top'
                                            }
                                        );
                                    }),
                                    tap(() => {
                                        this.cepFormControl.setErrors({ apiCep: message});
                                        this.cepFormControl.markAsTouched({ onlySelf: true });
                                    })
                                )
                            }

                            return of(null);
                        }),
                        finalize(() => this.state.next(false)),
                    )
            }),
        )
            .subscribe(
                cep => {
                    if (cep) {
                        this.cepChange.emit(cep);
                    }
                }
            )
    }

    get fieldValid(): boolean {
        return this.cepFormControl?.invalid && this.cepFormControl?.touched
    }

    get cep(): FormControl {
        return this.cepFormControl;
    }
}