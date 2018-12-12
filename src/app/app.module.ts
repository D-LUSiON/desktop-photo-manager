import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxElectronModule } from 'ngx-electron';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { TitlebarComponent } from './titlebar/titlebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core';
import { SharedModule } from './shared/shared.module';


@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgxElectronModule,
        BrowserAnimationsModule,
        CoreModule,
        SharedModule,
    ],
    declarations: [
        AppComponent,
        TitlebarComponent,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
