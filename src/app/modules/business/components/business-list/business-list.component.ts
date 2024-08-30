import { AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { LanguageService } from '../../../../shared/services/languages/language.service';
import { IBusiness } from '../../interfaces/business.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-business-list',
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    CurrencyPipe,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ]
})
export class BusinessListComponent implements OnInit, OnChanges {

  private readonly languageService = inject(LanguageService);

  @Input() businesses?: IBusiness[] | null;

  @Output() createBusiness: EventEmitter<void> = new EventEmitter();
  @Output() deleteBusiness: EventEmitter<IBusiness> = new EventEmitter();
  @Output() saveBusiness: EventEmitter<IBusiness> = new EventEmitter();
  @Output() detailBusiness: EventEmitter<IBusiness> = new EventEmitter();
  @Output() searchBusiness: EventEmitter<string> = new EventEmitter();

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  public displayedColumns: string[] = ['name', 'business', 'valuation', 'active', 'action'];
  public dataSource = new MatTableDataSource<IBusiness>(this.businesses || []);
  public currencyLanguage$?: Observable<string>;
  public searchFormControl: FormControl = new FormControl('', []);

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['businesses'].currentValue) {
      this.dataSource = new MatTableDataSource<IBusiness>(this.businesses || []);
    }
  }

  ngOnInit(): void {
    this.currencyLanguage$ = this.languageService.getCurrencyByLanguage();
    this.searchFormControl.valueChanges.subscribe(value => this.searchBusiness.emit(value));
  }

  create(): void {
    this.createBusiness.emit();
  }

  delete(business: IBusiness): void {
    this.deleteBusiness.emit(business);
  }

  update(business: IBusiness): void {
    this.saveBusiness.emit(business);
  }

  detail(business: IBusiness): void {
    this.detailBusiness.emit(business);
  }
}
