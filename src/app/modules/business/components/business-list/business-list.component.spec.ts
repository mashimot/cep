import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessListComponent } from './business-list.component';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('BusinessListComponent', () => {
  let component: BusinessListComponent;
  let fixture: ComponentFixture<BusinessListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BusinessListComponent],
      providers: [
        provideAnimations()
      ]
    });
    
    fixture = TestBed.createComponent(BusinessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
