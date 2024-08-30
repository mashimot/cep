import { TestBed } from '@angular/core/testing';
import { BusinessService } from './business.service';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { IBusiness } from '../interfaces/business.interface';

describe('BusinessService', () => {
  let service: BusinessService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://antlia-mockapi.azurewebsites.net/api/v1/itau_teste';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        BusinessService
      ]
    });

    service = TestBed.inject(BusinessService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve businesses via GET', () => {
    const mockBusinesses: IBusiness[] = [
      { id: 1, name: 'Business 1' },
      { id: 2, name: 'Business 2' },
      { id: 3, name: 'Business 3' },
      { id: 4, name: 'Business 4' }
    ] as any;

    service.getBusinesses().subscribe((businesses) => {
      expect(businesses.length).toBe(4);
      expect(businesses).toEqual(mockBusinesses);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockBusinesses);
  });

  it('should retrieve a business by ID via GET', () => {
    const mockBusiness: IBusiness = { id: 44441, name: 'Business 1' } as any;

    service.getBusinessById(1).subscribe((business) => {
      expect(business).toEqual(mockBusiness);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockBusiness);
  });

  it('should store a business via POST', (done) => {
    const mockBusiness: IBusiness = { id: 1, name: 'Business 1' } as any;

    service.store(mockBusiness).subscribe((response) => {
      expect(response).toEqual({ success: true });
      done();
    });
  });

  it('should update a business via PUT', (done) => {
    const mockBusiness: IBusiness = { id: 1, name: 'Business 1' } as any;

    service.update(mockBusiness).subscribe((response) => {
      expect(response).toEqual({ success: true });
      done();
    });
  });

  it('should delete a business via DELETE', (done) => {
    service.destroy(1).subscribe((response) => {
      expect(response).toEqual({ success: true });
      done();
    });
  });
});