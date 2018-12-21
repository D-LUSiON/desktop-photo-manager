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
import { VirtualScrollerModule } from 'ngx-virtual-scroller';

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
        VirtualScrollerModule
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
        VirtualScrollerModule
    ],
    declarations: [],
})
export class SharedModule { }
