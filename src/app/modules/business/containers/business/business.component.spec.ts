import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { BusinessComponent } from './business.component';
import { BusinessService } from '../../services/business.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { IBusiness } from '../../interfaces/business.interface';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('BusinessComponent', () => {
  let component: BusinessComponent;
  let fixture: ComponentFixture<BusinessComponent>;
  let router: jest.Mocked<Router>;
  let snackBar: jest.Mocked<MatSnackBar>;
  let businessService: jest.Mocked<BusinessService>;

  beforeEach(() => {
    const routerMockStub = {
      navigate: jest.fn(),
    };

    const snackBarMockStub = {
      open: jest.fn(),
    };

    const businessServiceMockStub = {
      getBusinesses: jest.fn().mockReturnValue(of([])),
    };

    TestBed.configureTestingModule({
      imports: [
        BusinessComponent,
        RouterTestingModule
      ],
      providers: [
        provideAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerMockStub },
        { provide: MatSnackBar, useValue: snackBarMockStub },
        { provide: BusinessService, useValue: businessServiceMockStub }
      ]
    });

    fixture = TestBed.createComponent(BusinessComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router) as jest.Mocked<Router>;
    snackBar = TestBed.inject(MatSnackBar) as jest.Mocked<MatSnackBar>;
    businessService = TestBed.inject(BusinessService) as jest.Mocked<BusinessService>;
   
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get businesses on init', () => {
    const mockBusinesses: IBusiness[] = [{ id: 1, name: 'Business 1' }] as any;
    jest.spyOn(businessService, 'getBusinesses').mockReturnValue(of(mockBusinesses));

    component.ngOnInit();

    expect(businessService.getBusinesses).toHaveBeenCalled();
    component.businesses$?.subscribe(businesses => {
      expect(businesses).toEqual(mockBusinesses);
    });
  });

  it('should navigate to create business when onCreateBusiness is called', () => {
    component.onCreateBusiness();
    expect(router.navigate).toHaveBeenCalledWith(['businesses', 'create']);
  });

  it('should navigate to business details when onDetailBusinessChange is called', () => {
    const mockBusiness: IBusiness = { id: 1, name: 'Business 1' } as any;
    component.onDetailBusinessChange(mockBusiness);
    expect(router.navigate).toHaveBeenCalledWith(['businesses', mockBusiness.id]);
  });

  it('should navigate to edit business when onSaveBusinessChange is called', () => {
    const mockBusiness: IBusiness = { id: 1, name: 'Business 1' } as any;
    component.onSaveBusinessChange(mockBusiness);
    expect(router.navigate).toHaveBeenCalledWith(['businesses', mockBusiness.id, 'edit']);
  });

  // it('should open snackbar when onDeleteBusinessChange is called', () => {
  //   const mockBusiness: IBusiness = { id: 1, name: 'Business 1' } as any;
  //   component.onDeleteBusinessChange(mockBusiness);
  //   expect(snackBar.open).toHaveBeenCalledWith(
  //     '[#1 - Business 1] deleted!',
  //     'x',
  //     {
  //       horizontalPosition: 'center',
  //       verticalPosition: 'top'
  //     }
  //   );
  // });
});
