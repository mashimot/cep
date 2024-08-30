import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';
import { take } from 'rxjs/operators';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit true when show() is called', (done) => {
    service.show();
    service.isLoading().pipe(take(1)).subscribe(isLoading => {
      expect(isLoading).toBe(true);
      done();
    });
  });

  it('should emit false when hide() is called', (done) => {
    service.show(); // First set to true
    service.hide();
    service.isLoading().pipe(take(1)).subscribe(isLoading => {
      expect(isLoading).toBe(false);
      done();
    });
  });

  it('should return an Observable that emits the current loading state', (done) => {
    service.isLoading().pipe(take(1)).subscribe(isLoading => {
      expect(isLoading).toBe(false); // Initially, the loading state should be false
      done();
    });
  });

  it('should toggle the loading state correctly', (done) => {
    service.show();
    service.isLoading().pipe(take(1)).subscribe(isLoading => {
      expect(isLoading).toBe(true);
      
      service.hide();
      service.isLoading().pipe(take(1)).subscribe(isLoading => {
        expect(isLoading).toBe(false);
        done();
      });
    });
  });
});