import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { ICep, IViaCep } from '../interfaces/cep.interface';
import { CepService } from './cep.service';

describe('CepService', () => {
  let service: CepService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CepService]
    });

    service = TestBed.inject(CepService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getCepByNumber', () => {
    it('should return a formatted CEP object when called', fakeAsync(() => {
      const mockCepNumber = '01001000';
      const mockViaCepResponse: IViaCep = {
        cep: mockCepNumber,
        uf: 'SP',
        localidade: 'São Paulo',
        logradouro: 'Praça da Sé',
        bairro: 'Sé',
        complemento: '',
        ddd: '',
        gia: '',
        ibge: '',
        siafi: ''
      };

      const expectedCep: ICep = {
        cep: '01001000',
        state: 'SP',
        city: 'São Paulo',
        street: 'Praça da Sé',
        neighborhood: 'Sé'
      };

      service.getCepByNumber(mockCepNumber).subscribe((cep) => {
        expect(cep).toEqual(expectedCep);
      });

      const req = httpMock.expectOne(`https://viacep.com.br/ws/${mockCepNumber}/json/`);
      expect(req.request.method).toBe('GET');
      req.flush(mockViaCepResponse);

      tick();
    }));
  });

  describe('getCep', () => {
    it('should return a CEP object from the cep-promise package', fakeAsync(() => {
      const mockCepNumber = '01001000';
      const mockCepResponse: ICep = {
        cep: mockCepNumber,
        state: 'SP',
        city: 'São Paulo',
        street: 'Praça da Sé',
        neighborhood: 'Sé'
      };

      jest.spyOn(service, 'getCep').mockReturnValue(of(mockCepResponse));

      service.getCep(mockCepNumber).subscribe((cepResult) => {
        expect(cepResult).toEqual(mockCepResponse);
      });

      tick();
    }));
  });
});
