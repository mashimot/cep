import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxMaskDirective, NgxMaskPipe, provideEnvironmentNgxMask } from 'ngx-mask';
import { of } from 'rxjs';
import { CepDirective } from '../../../../modules/cep/directives/cep/cep.directive';
import { LanguageService } from '../../../../shared/services/languages/language.service';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { CepFormComponent } from '../../../cep/components/cep-form/cep-form.component';
import { IBusiness } from '../../interfaces/business.interface';
import { BusinessFormComponent } from './business-form.component';

describe('BusinessFormComponent', () => {
  let component: BusinessFormComponent;
  let fixture: ComponentFixture<BusinessFormComponent>;
  let languageService: LanguageService;
  let loadingService: LoadingService;

  beforeEach(async () => {
    const languageServiceStub = {
      getCurrencyByLanguage: () => of('PT'),
      getCurrencySymbol: () => null
    };
    const loadingServiceStub = {
      isLoading: () => of(false)
    };

    await TestBed.configureTestingModule({
      imports: [
        NgxMaskDirective,
        NgxMaskPipe,
        ReactiveFormsModule,
        CepFormComponent,
        CepDirective
      ],
      declarations: [],
      providers: [
        provideAnimations(),
        provideEnvironmentNgxMask(),
        provideHttpClient(),
        provideHttpClientTesting(),
        FormBuilder,
        { provide: LanguageService, useValue: languageServiceStub },
        { provide: LoadingService, useValue: loadingServiceStub }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessFormComponent);
    component = fixture.componentInstance;

    languageService = TestBed.inject(LanguageService);
    loadingService = TestBed.inject(LoadingService);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    fixture.detectChanges();

    expect(component.form).toBeDefined();
    expect(component.currencySymbol$).toBeDefined();
    expect(component.dominioYesOrNo$).toBeDefined();
  });

  it('should update the form when business @Input changes', () => {
    const mockBusiness: IBusiness = {
      id: 999999,
      name: 'Test Business',
      business: 'Tech',
      valuation: 1000000,
      active: true,
      cnpj: 12345678000199,
      cep: '12345-678'
    };
    component.business = mockBusiness;
    component.ngOnChanges({
      business: {
        currentValue: mockBusiness,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.f.invalid).toBeTruthy();
    expect(component.f.value).toEqual({
      id: 999999,
      name: 'Test Business',
      business: 'Tech',
      valuation: 1000000,
      active: true,
      cnpj: 12345678000199,
      location: {
        "cep": "12345-678",
        "city": null,
        "neighborhood": null,
        "state": null,
        "street": null,
      },
    });
  });

  it('should emit createBusiness when form is valid and no business ID exists', () => {
    jest.spyOn(component.createBusiness, 'emit');

    component.business = null;
    component.buildForm();
    component.f.setValue({
      id: null,
      name: 'Test Business',
      business: 'Tech',
      valuation: 1000000,
      active: true,
      cnpj: 12345678000199,
      location: {
        cep: '12345-678',
        state: 'SP',
        city: 'São Paulo',
        street: 'Av. Paulista',
        neighborhood: 'Bela Vista'
      }
    });

    component.onSubmit();
    
    expect(component.f.valid).toBeTruthy();
    expect(component.createBusiness.emit).toHaveBeenCalledWith({
      id: null,
      name: 'Test Business',
      business: 'Tech',
      valuation: 1000000,
      active: true,
      cnpj: 12345678000199,
      cep: '12345-678'
    } as any);
  });

  it('should emit saveBusiness when form is valid and business ID exists', () => {
    jest.spyOn(component.saveBusiness, 'emit');

    const mockCep = {
        cep: '12345-678',
        state: 'SP',
        city: 'São Paulo',
        street: 'Av. Paulista',
        neighborhood: 'Bela Vista'
    };
    const mockBusiness: IBusiness = {
      id: 23,
      name: 'Test Business',
      business: 'Tech',
      valuation: 1000000,
      active: true,
      cnpj: 12345678000199,
      cep: '12345-678'
    };

    component.form = component.buildForm();
    component.locationCep.setValue(mockBusiness.cep);
    component.onCepChange(mockCep);
    component.f.patchValue(mockBusiness);

    component.onSubmit();

    expect(component.f.valid).toBeTruthy();
    expect(component.saveBusiness.emit).toHaveBeenCalledWith({
      id: 23,
      name: 'Test Business',
      business: 'Tech',
      valuation: 1000000,
      active: true,
      cnpj: 12345678000199,
      cep: '12345-678'
    });
  });

  it('should disable location fields when onStateCepChange is true', () => {
    component.form = component.buildForm();
    component.onStateCepChange(true);
    expect(component.location.disabled).toBeTruthy();
  });

  it('should enable location fields when onStateCepChange is false', () => {
    component.form = component.buildForm();
    component.onStateCepChange(false);
    expect(component.location.enabled).toBeTruthy();
  });

  it('should reset location fields on onCepChange and patch values when CEP is provided', () => {
    const mockCep = {
      cep: '12345-678',
      state: 'SP',
      city: 'São Paulo',
      street: 'Av. Paulista',
      neighborhood: 'Bela Vista'
    };

    component.form = component.buildForm();
    component.locationCep.setValue(mockCep.cep);
    component.onCepChange(mockCep);

    expect(component.location.value).toEqual(mockCep);
  });

  it('should call validateAllFormFields when form is invalid on submit', () => {
    jest.spyOn(component, 'validateAllFormFields');

    component.form = component.buildForm();
    component.onSubmit();

    expect(component.validateAllFormFields).toHaveBeenCalled();
  });

  it('should emit formBackButtonChange when backButton is called', () => {
    jest.spyOn(component.formBackButtonChange, 'emit');
    component.backButton();
    expect(component.formBackButtonChange.emit).toHaveBeenCalled();
  });
});
