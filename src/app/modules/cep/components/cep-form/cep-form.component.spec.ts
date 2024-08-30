import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { of } from 'rxjs';
import { ICep, IViaCep } from '../../interfaces/cep.interface';
import { CepService } from '../../services/cep.service';
import { CepFormComponent } from './cep-form.component';

describe('CepFormComponent', () => {
  let component: CepFormComponent;
  let fixture: ComponentFixture<CepFormComponent>;
  let cepService: jest.Mocked<CepService>;
  const mockCep: IViaCep = {
    cep: '12345678',
    logradouro: 'Rua Teste',
    complemento: '',
    bairro: 'Bairro dahora',
    localidade: 'Localidade Muito legal',
    uf: 'SP',
    ibge: '',
    gia: '',
    ddd: '',
    siafi: ''
  };
  const mockCepConvertido = {
    "cep": mockCep.cep,
    "state": mockCep.uf,
    "city": mockCep.localidade,
    "street": mockCep.logradouro,
    "neighborhood": mockCep.bairro
  };

  beforeEach(async () => {
    cepService = {
      getCepByNumber: jest.fn()
    } as unknown as jest.Mocked<CepService>;

    await TestBed.configureTestingModule({
      imports: [
        CepFormComponent,
        ReactiveFormsModule
      ],
      declarations: [],
      providers: [
        provideAnimations(),
        provideEnvironmentNgxMask(),
        provideHttpClient(),
        provideHttpClientTesting(),
        FormBuilder,
        { provide: CepService, useValue: cepService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CepFormComponent);

    component = fixture.componentInstance;
    component.cepChange = new EventEmitter<ICep | null>();
    component.state = new EventEmitter<boolean>();
    component.cepFormControl = component.buildForm();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInputCepChange', () => {
    it('should call cepService and emit cepChange on success', () => {
      cepService.getCepByNumber.mockReturnValue(of(mockCepConvertido));

      component.cepFormControl = component.buildForm();
      component.cepFormControl.setValue('12345678');
      // component.onInputCepChange();

      component.cepChange.subscribe((cep) => {
        expect(cep).toEqual(mockCepConvertido);
      });

      component.state.subscribe((state) => {
        expect(state).toBe(false);
      });
    });

    it('should not call cepService if cep length is less than 4', () => {
      component.cepFormControl = component.buildForm();
      component.cepFormControl.setValue('123');
      // component.onInputCepChange();

      expect(cepService.getCepByNumber).not.toHaveBeenCalled();
    });
  });

  describe('fieldValid getter', () => {
    it('should return true if form control is invalid and touched', () => {
      component.cepFormControl = component.buildForm();
      component.cepFormControl.markAsTouched();
      component.cepFormControl.setErrors({ required: true });

      expect(component.fieldValid).toBe(true);
    });

    it('should return false if form control is valid or not touched', () => {
      component.cepFormControl = component.buildForm();

      expect(component.fieldValid).toBe(false);
    });
  });

  describe('cep getter', () => {
    it('should return cepFormControl', () => {
      component.cepFormControl = component.buildForm();
      expect(component.cep).toBe(component.cepFormControl);
    });
  });
});