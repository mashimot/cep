import { TestBed } from '@angular/core/testing';
import { CepService } from './cep.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('CepService', () => {
  let service: CepService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [        
        provideHttpClient(),
        provideHttpClientTesting(),
        CepService
      ]
    });

    service = TestBed.inject(CepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
