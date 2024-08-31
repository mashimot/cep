import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
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
import { FlexLayoutModule } from '@angular/flex-layout';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { Observable, of } from 'rxjs';
import { CepDirective } from '../../../../modules/cep/directives/cep/cep.directive';
import { CepFormComponent } from '../../../../modules/cep/components/cep-form/cep-form.component';
import { ICep } from '../../../../modules/cep/interfaces/cep.interface';
import { LanguageService } from '../../../../shared/services/languages/language.service';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { IBusiness } from '../../interfaces/business.interface';

@Component({
    selector: 'app-business-form',
    templateUrl: './business-form.component.html',
    styleUrls: ['./business-form.component.scss'],
    standalone: true,
    imports: [
        // CepFormComponent,
        CommonModule,
        NgIf,
        AsyncPipe,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        FlexLayoutModule,
        NgxMaskDirective,
        NgxMaskPipe,
        CepDirective
    ]
})
export class BusinessFormComponent implements OnInit, OnChanges {
    @Input() public business?: IBusiness | null;
    @Input() public showSubmitButton?: boolean = true;

    @Output() public saveBusiness: EventEmitter<IBusiness> = new EventEmitter();
    @Output() public createBusiness: EventEmitter<IBusiness> = new EventEmitter();
    @Output() public formBackButtonChange: EventEmitter<void> = new EventEmitter();

    private readonly languageService = inject(LanguageService);
    private readonly loadingService = inject(LoadingService);
    private formBuilder = inject(FormBuilder);

    public state: boolean = false;
    public loading$: Observable<boolean> = this.loadingService.isLoading();
    public dominioYesOrNo$?: Observable<any>;
    public currencySymbol$?: Observable<string>;
    public form: FormGroup = this.buildForm();

    constructor() { }

    ngOnInit() {
        this.dominioYesOrNo$ = this.getDominio('yes_no');
        this.currencySymbol$ = this.languageService.getCurrencySymbol();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const business = changes['business'].currentValue as IBusiness;

        if (business) {
            this.displayBusiness(business);
        }
    }

    public buildForm(): FormGroup {
        return this.formBuilder.group({
            "id": ['', []],
            "name": ['', [Validators.required]],
            "business": ['', [Validators.required]],
            "valuation": ['', [Validators.required]],
            "active": ['', [Validators.required]],
            "cnpj": ['', [Validators.required]],
            "location": this.formBuilder.group({
                "cep": ['', [Validators.required]],
                "state": ['', [Validators.required]],
                "city": ['', [Validators.required]],
                "street": ['', [Validators.required]],
                "neighborhood": ['', [Validators.required]],
            }),
        });
    }

    public displayBusiness(business: IBusiness): void {
        this.f.reset();
        this.f.patchValue(business);
        this.locationCep.setValue(business.cep);
    }

    onStateCepChange($event: boolean): void {
        this.state = $event;
        if ($event === true) {
            this.location.disable();
        } else {
            this.location.enable();
        }
    }

    onCepChange($event: ICep | null): void {
        ['state', 'city', 'street', 'neighborhood'].forEach(value => {
            this.location.get(value)?.reset();
        });

        if ($event) {
            this.location.patchValue({
                // "cep": $event.cep,
                "state": $event.state,
                "city": $event.city,
                "street": $event.street,
                "neighborhood": $event.neighborhood
            }, {
                emitEvent: false,
                onlySelf: true
            });
        }
    }

    onSubmit(): void {
        if (this.f.valid) {
            const business = { ...this.f.value };
            business.cep = business.location.cep;

            delete business['location'];

            if (!this.business && !this.id.value) {
                this.createBusiness.emit(business);
            } else {
                this.saveBusiness.emit({
                    ...business,
                    id: this.id.value
                });
            }
        } else {
            this.validateAllFormFields(this.f);
        }
    }

    backButton(): void {
        this.formBackButtonChange.emit();
    }

    validateAllFormFields(control: AbstractControl): void {
        if (control instanceof FormControl) {
            control.markAsTouched({
                onlySelf: true
            });
        } else if (control instanceof FormGroup) {
            Object.keys(control.controls).forEach((field: string) => {
                const groupControl = control.get(field)!;
                this.validateAllFormFields(groupControl);
            });
        } else if (control instanceof FormArray) {
            const controlAsFormArray = control as FormArray;
            controlAsFormArray.controls.forEach((arrayControl: AbstractControl) => this.validateAllFormFields(arrayControl));
        }
    }

    public getDominio(dominio: string): Observable<{ dominio: string, value: boolean, viewValue: string }[]> {
        return of([
            {
                dominio: 'yes_no',
                value: true,
                viewValue: 'Sim'
            },
            {
                dominio: 'yes_no',
                value: false,
                viewValue: 'Não'
            }
        ]);
    }

    getField(path: (string | number)[] | string): {
        name: string,
        id: string,
        abstractControl: AbstractControl | null | any,
        isFieldValid: boolean | undefined
    } {
        return {
            name: typeof path === 'string' ? path : path.join('.'),
            id: typeof path === 'string' ? path : path.join('-'),
            abstractControl: this.f.get(path),
            isFieldValid: this.f.get(path)?.invalid && this.f.get(path)?.touched
        }
    }

    get f(): FormGroup {
        return this.form as FormGroup;
    }
    get id(): FormControl {
        return this.f.get(['id']) as FormControl;
    }
    get name(): FormControl {
        return this.f.get(['name']) as FormControl;
    }
    get valuation(): FormControl {
        return this.f.get(['valuation']) as FormControl;
    }
    get active(): FormControl {
        return this.f.get(['active']) as FormControl;
    }
    get cnpj(): FormControl {
        return this.f.get(['cnpj']) as FormControl;
    }
    get location(): FormGroup {
        return this.f.get(['location']) as FormGroup;
    }
    get locationCep(): FormControl {
        return this.f.get(['location', 'cep']) as FormControl;
    }
    get locationState(): FormControl {
        return this.f.get(['location', 'state']) as FormControl;
    }
    get locationCity(): FormControl {
        return this.f.get(['location', 'city']) as FormControl;
    }
    get locationStreet(): FormControl {
        return this.f.get(['location', 'street']) as FormControl;
    }
    get locationNeighborhood(): FormControl {
        return this.f.get(['location', 'neighborhood']) as FormControl;
    }
}