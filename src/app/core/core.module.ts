import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectronClientService } from './services/electron-client.service';
import { FilesService } from './services/files.service';

@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    providers: [
        ElectronClientService,
        FilesService
    ]
})
export class CoreModule {
    constructor(
        @Optional() @SkipSelf() parentModule: CoreModule
    ) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import only in AppModule');
        }
    }
}
