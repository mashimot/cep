import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusinessDetailComponent } from './business-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('BusinessDetailComponent', () => {
  let component: BusinessDetailComponent;
  let fixture: ComponentFixture<BusinessDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BusinessDetailComponent,
        RouterTestingModule
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    
    fixture = TestBed.createComponent(BusinessDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
