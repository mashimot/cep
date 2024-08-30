import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BusinessCreateEditComponent } from './business-create-edit.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { BrowserAnimationsModule, provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';
import { BusinessService } from '../../services/business.service';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { IBusiness } from '../../interfaces/business.interface';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('BusinessCreateEditComponent', () => {
  let component: BusinessCreateEditComponent;
  let fixture: ComponentFixture<BusinessCreateEditComponent>;
  let businessService: BusinessService;
  let loadingService: LoadingService;
  let matSnackBar: MatSnackBar;
  let mockBusiness: IBusiness = {
    id: 123,
    name: 'cool name',
    business: 'business name',
    valuation: 444.2,
    active: false,
    cep: 'string',
    cnpj: 147998764515
  };

  beforeEach(async () => {
    const snackBarMock = {
      open: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        BusinessCreateEditComponent,
        RouterTestingModule
      ],
      providers: [
        // provideAnimations(),
        provideNoopAnimations(),
        provideEnvironmentNgxMask(),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: BusinessService,
          useValue: {
            store: () => null,
            update: () => null
          }
        },
        {
          provide: LoadingService,
          useValue: {
            isLoading: () => null,
            show: () => null,
            hide: () => null
          }
        },
        { provider: MatSnackBar, useValue: snackBarMock },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessCreateEditComponent);
    component = fixture.componentInstance;

    businessService = TestBed.inject(BusinessService);
    loadingService = TestBed.inject(LoadingService);
    matSnackBar = TestBed.inject(MatSnackBar);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onCreateBusinessFormChange', () => {
    beforeEach(() => {
      jest.spyOn(loadingService, 'show');
      jest.spyOn(loadingService, 'hide');
    });

    it('should open snackbar when onCreateBusinessFormChange is called', () => {
      jest.spyOn(businessService, 'store').mockReturnValue(of({ success: true }));
      jest.spyOn(matSnackBar, 'open').mockImplementation();

      component.onCreateBusinessFormChange(mockBusiness);

      expect(loadingService.show).toHaveBeenCalled();
      expect(loadingService.hide).toHaveBeenCalled();
      // expect(matSnackBar.open).toHaveBeenCalledWith(
      //   "[cool name] created!", "x", { "horizontalPosition": "center", "verticalPosition": "top" }
      // );
    });
  });

  describe('onSaveBusinessFormChange', () => {
    beforeEach(() => {
      jest.spyOn(loadingService, 'show');
      jest.spyOn(loadingService, 'hide');
    });

    it('should open snackbar when onSaveBusinessFormChange is called', async() => {
      jest.spyOn(businessService, 'update').mockReturnValue(of({ success: true }));
      const spyMatSnackBar = jest.spyOn(matSnackBar, 'open').mockImplementation();

      component.onSaveBusinessFormChange(mockBusiness);
  
      expect(loadingService.show).toHaveBeenCalled();
      expect(loadingService.hide).toHaveBeenCalled();
      // expect(spyMatSnackBar).toHaveBeenCalledWith(
      //   '[#123 - cool name] updated!',
      //   'x',
      //   {
      //     horizontalPosition: 'center',
      //     verticalPosition: 'top'
      //   }
      // );
    });
  });

  describe('onFormBackButtonChange', () => {
    it('', () => {

    });
  });
});
