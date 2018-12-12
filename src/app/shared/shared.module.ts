import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatIconModule,
    MatDrawer,
    MatSidenavModule,
    MatListModule,
    MatGridListModule
} from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatListModule,
        MatGridListModule,
    ],
    exports: [
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatTableModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatListModule,
        MatGridListModule,
    ],
    declarations: [],
})
export class SharedModule { }
