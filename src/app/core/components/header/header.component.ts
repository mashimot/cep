import { Component, inject, OnInit } from '@angular/core';
import { LanguageType } from './../../../shared/services/languages/language.type';
import { LanguageService } from './../../../shared/services/languages/language.service';
import { Observable } from 'rxjs';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatMenuModule, NgIf, NgFor, AsyncPipe, FlexLayoutModule]
})
export class HeaderComponent implements OnInit {
    private languageService = inject(LanguageService);
    public languages$?: Observable<LanguageType[]>;
    public language$?: Observable<string>;

    ngOnInit() {
        this.languages$ = this.languageService.getLanguages();
        this.language$ = this.languageService.getLanguage();
    }

    onSelectedLanguage(language: string): void {
        this.languageService.setLanguage(language as LanguageType);
    }
}
