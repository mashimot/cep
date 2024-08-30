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
        CepFormComponent,
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
        NgxMaskPipe
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
            "business": this.formBuilder.group({
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
            }),
        });
    }

    public displayBusiness(business: IBusiness): void {
        this.businessFormGroup.reset();
        this.businessFormGroup.patchValue(business);
        this.businessLocationCep.setValue(business.cep);
    }

    onStateCepChange($event: boolean): void {
        this.state = $event;
        if ($event === true) {
            this.businessLocation.disable();
        } else {
            this.businessLocation.enable();
        }
    }

    onCepChange($event: ICep | null): void {
        this.businessLocation.reset();
        if ($event) {
            this.businessLocation.patchValue({
                "cep": $event.cep,
                "state": $event.state,
                "city": $event.city,
                "street": $event.street,
                "neighborhood": $event.neighborhood
            });
        }
    }

    onSubmit(): void {
        if (this.f.valid) {
            const business = { ...this.businessFormGroup.value };
            business.cep = business.location.cep;

            delete business['location'];

            if (!this.business && !this.businessId.value) {
                this.createBusiness.emit(business);
            } else {
                this.saveBusiness.emit({
                    ...business,
                    id: this.businessId.value
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
    get businessFormGroup(): FormGroup {
        return this.f.get(['business']) as FormGroup;
    }
    get businessId(): FormControl {
        return this.f.get(['business', 'id']) as FormControl;
    }
    get businessName(): FormControl {
        return this.f.get(['business', 'name']) as FormControl;
    }
    get businessBusiness(): FormControl {
        return this.f.get(['business', 'business']) as FormControl;
    }
    get businessValuation(): FormControl {
        return this.f.get(['business', 'valuation']) as FormControl;
    }
    get businessActive(): FormControl {
        return this.f.get(['business', 'active']) as FormControl;
    }
    get businessCnpj(): FormControl {
        return this.f.get(['business', 'cnpj']) as FormControl;
    }
    get businessLocation(): FormGroup {
        return this.f.get(['business', 'location']) as FormGroup;
    }
    get businessLocationCep(): FormControl {
        return this.f.get(['business', 'location', 'cep']) as FormControl;
    }
    get businessLocationState(): FormControl {
        return this.f.get(['business', 'location', 'state']) as FormControl;
    }
    get businessLocationCity(): FormControl {
        return this.f.get(['business', 'location', 'city']) as FormControl;
    }
    get businessLocationStreet(): FormControl {
        return this.f.get(['business', 'location', 'street']) as FormControl;
    }
    get businessLocationNeighborhood(): FormControl {
        return this.f.get(['business', 'location', 'neighborhood']) as FormControl;
    }
}