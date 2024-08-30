import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { finalize, map, shareReplay, switchMap } from 'rxjs/operators';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { BusinessFormComponent } from '../../components/business-form/business-form.component';
import { IBusiness } from '../../interfaces/business.interface';
import { BusinessService } from '../../services/business.service';

@Component({
  selector: 'app-business-create-edit',
  templateUrl: './business-create-edit.component.html',
  styleUrls: ['./business-create-edit.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    NgIf,
    MatSnackBarModule,
    BusinessFormComponent
  ]
})
export class BusinessCreateEditComponent implements OnInit {
  public business$?: Observable<IBusiness | null>;

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private businessService = inject(BusinessService);
  private loadingService = inject(LoadingService);
  public snackBar = inject(MatSnackBar);

  public loading$: Observable<boolean> = this.loadingService.isLoading();

  constructor() { }

  ngOnInit(): void {
    this.business$ = this.getBusiness();
  }

  public onFormBackButtonChange(): void {
    this.router.navigate(['businesses']);
  }

  public onCreateBusinessFormChange(business: IBusiness): void {
    this.loadingService.show();
    this.businessService.store(business)
      .pipe(
        finalize(() => this.loadingService.hide())
      )
      .subscribe(
        next => {
          this.snackBar.open(
            `[${business.name}] created!`,
            'x',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top'
            }
          );
        }
      );
  }

  public onSaveBusinessFormChange(business: IBusiness): void {
    this.loadingService.show();
    this.businessService.update(business)
      .pipe(
        finalize(() => this.loadingService.hide())
      )
      .subscribe(
        next => {
          this.snackBar.open(
            `[#${business.id} - ${business.name}] updated!`,
            'x',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top'
            }
          );
        }
      );
  }

  private getBusiness(): Observable<IBusiness | null> {
    return this
      .activatedRoute
      .paramMap
      .pipe(
        map(paramMap => Number(paramMap.get('id'))),
        switchMap(id => {
          return id
            ? this.businessService.getBusinessById(id)
            : of(null);
        }),
        shareReplay(1)
      );
  }
}
