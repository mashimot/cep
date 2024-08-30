import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarModule
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BusinessListComponent } from '../../components/business-list/business-list.component';
import { IBusiness } from '../../interfaces/business.interface';
import { BusinessService } from '../../services/business.service';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    AsyncPipe,
    MatSnackBarModule,
    BusinessListComponent
  ]
})
export class BusinessComponent implements OnInit {
  private businessService = inject(BusinessService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  public businesses$?: Observable<IBusiness[]>;

  ngOnInit(): void {
    this.businesses$ = this.businessService.getBusinesses();
  }

  public onCreateBusiness(): void {
    this.router.navigate(['businesses', 'create']);
  }

  public onDetailBusinessChange(business: IBusiness): void {
    this.router.navigate(['businesses', business.id]);
  }

  public onSaveBusinessChange(business: IBusiness): void {
    this.router.navigate(['businesses', business.id, 'edit']);
  }

  public onDeleteBusinessChange(business: IBusiness): void {
    this.snackBar.open(
      `[#${business.id} - ${business.name}] deleted!`,
      'x',
      {
        horizontalPosition: 'center',
        verticalPosition: 'top'
      }
    );
  }

  public onSearchBusinessChange(value: string): void {
    console.log('onSearchBusinessChange', value);
  }
}
