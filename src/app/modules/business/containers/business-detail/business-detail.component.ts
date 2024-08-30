import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { BusinessFormComponent } from '../../components/business-form/business-form.component';
import { IBusiness } from '../../interfaces/business.interface';
import { BusinessService } from '../../services/business.service';

@Component({
  selector: 'app-business-detail',
  templateUrl: './business-detail.component.html',
  styleUrls: ['./business-detail.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    NgIf,
    BusinessFormComponent
  ]
})
export class BusinessDetailComponent implements OnInit {
  public business$?: Observable<IBusiness>;

  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private businessService = inject(BusinessService);

  constructor() { }

  ngOnInit(): void {
    this.business$ = this.getBusiness();
  }

  public onFormBackButtonChange(): void {
    this.router.navigate(['businesses']);
  }

  private getBusiness(): Observable<IBusiness> {
    return this
      .activatedRoute
      .paramMap
      .pipe(
        map(paramMap => Number(paramMap.get('id'))),
        switchMap(id => this.businessService.getBusinessById(id)),
      );
  }
}
