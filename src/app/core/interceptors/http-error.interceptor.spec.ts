import { TestBed } from '@angular/core/testing';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { importProvidersFrom } from '@angular/core';

describe('HttpErrorInterceptor', () => {
  let interceptor: HttpErrorInterceptor;
  let mockSnackBar: MatSnackBar;
  let mockHandler: HttpHandler;

  beforeEach(() => {
    mockSnackBar = {
      open: jest.fn()
    } as unknown as MatSnackBar;

    TestBed.configureTestingModule({
      providers: [
        HttpErrorInterceptor,
        importProvidersFrom([MatSnackBarModule]),
        {
          provide: MatSnackBar, 
          useValue: mockSnackBar,
          deps: [
            MatSnackBar
          ]
        }
      ]
    });

    interceptor = TestBed.inject(HttpErrorInterceptor);
    mockHandler = {
      handle: jest.fn()
    };
  });

  it('should create the interceptor', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should call MatSnackBar on HttpErrorResponse', () => {
    const mockErrorResponse = new HttpErrorResponse({
      error: 'error',
      status: 500,
      statusText: 'Server Error',
      url: 'http://test.com'
    });

    const request = new HttpRequest('GET', '/test');
    const next: HttpHandler = {
      handle: jest.fn(() => throwError(() => mockErrorResponse))
    };

    interceptor.intercept(request, next).subscribe({
      error: () => {
        // Verifique se MatSnackBar foi chamado com a mensagem de erro correta
        expect(mockSnackBar.open).toHaveBeenCalledWith(
          mockErrorResponse.message,
          ' x ',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['color:white;']
          }
        );
      }
    });
  });

  it('should propagate the error', (done) => {
    const mockErrorResponse = new HttpErrorResponse({
      error: 'error',
      status: 500,
      statusText: 'Server Error',
      url: 'http://test.com'
    });

    const request = new HttpRequest('GET', '/test');
    const next: HttpHandler = {
      handle: jest.fn(() => throwError(() => mockErrorResponse))
    };

    interceptor.intercept(request, next).subscribe({
      error: (error) => {
        expect(error).toEqual(mockErrorResponse);
        done();
      }
    });
  });

  it('should pass through the response if no error', (done) => {
    const mockResponse: HttpEvent<any> = { type: 0 };

    const request = new HttpRequest('GET', '/test');
    const next: HttpHandler = {
      handle: jest.fn(() => of(mockResponse))
    };

    interceptor.intercept(request, next).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      done();
    });
  });
});
