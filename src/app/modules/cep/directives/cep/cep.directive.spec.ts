import { TestBed } from '@angular/core/testing';
import { AbstractControl } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CepService } from '../../services/cep.service';
import { CepDirective } from './cep.directive'; // Atualize o caminho de acordo com o seu projeto

describe('CepDirective', () => {
    let directive: CepDirective;
    let cepService: CepService;

    beforeEach(() => {
        const cepServiceMockStub = {
            getCep: jest.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                CepDirective,
                { provide: CepService, useValue: cepServiceMockStub },
            ],
        });

        directive = TestBed.inject(CepDirective);
        cepService = TestBed.inject(CepService);
    });

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    it('should return null if control value is empty', (done) => {
        const control = { value: '' } as AbstractControl;

        directive.validate(control).subscribe((result) => {
            expect(result).toBeNull();
            done();
        });
    });

    it('should call cepService.getCep and emit event if valid CEP is returned', (done) => {
        const control = { value: '12345-678' } as AbstractControl;
        const mockCep = {
            cep: '12345-678',
            state: 'SP',
            city: 'São Paulo',
            street: 'Av. Paulista',
            neighborhood: 'Bela Vista'
        };

        jest.spyOn(cepService, 'getCep').mockReturnValue(of(mockCep));
        jest.spyOn(directive.cepChange, 'emit');

        directive.validate(control).subscribe((result) => {
            expect(result).toBeNull();
            expect(cepService.getCep).toHaveBeenCalledWith('12345678');
            expect(directive.cepChange.emit).toHaveBeenCalledWith(mockCep);
            done();
        });
    });

    it('should return error object if cepService.getCep throws an error', (done) => {
        const control = { value: '12345-678', markAsTouched: jest.fn() } as any;
        const mockError = {
            name: 'CepPromiseError',
            errors: [{ message: 'CEP not found' }]
        };

        jest.spyOn(cepService, 'getCep').mockReturnValue(throwError(mockError));

        directive.validate(control).subscribe((result) => {
            expect(result).toEqual({ apiCep: 'CEP not found' });
            expect(control.markAsTouched).toHaveBeenCalledWith({ onlySelf: true });
            done();
        });
    });
});
