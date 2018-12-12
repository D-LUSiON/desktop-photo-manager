import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilesRoutingModule } from './files-routing.module';
import { FilesListComponent } from './files-list/files-list.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
    declarations: [FilesListComponent],
    imports: [
        CommonModule,
        FilesRoutingModule,
        SharedModule,
    ]
})
export class FilesModule { }
