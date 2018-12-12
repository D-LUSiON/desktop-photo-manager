import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { ElectronClientService, FilesService } from '@app/core';
import { MatDrawer } from '@angular/material';
import { Router } from '@angular/router';
import { Drive } from './shared/models';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    back_url = '';
    current_url = '';

    root_url = '/';

    drives: Drive[] = [];

    current_drive: Drive;

    @ViewChild('sidebar') sidebar: MatDrawer;

    constructor(
        private _electron: ElectronService,
        private _electronClient: ElectronClientService,
        private _filesService: FilesService,
        private _ngZone: NgZone,
        private _router: Router,
    ) {
        this._filesService.drives$.subscribe((drives: Drive[]) => {
            this.drives = drives;
        });

        this._filesService.drive$.subscribe((drive: Drive) => {
            this.current_drive = drive;
        });
    }

    ngOnInit() {
        this._electronClient.send('get-drives').subscribe(data => {
            this.drives = data.map(x => new Drive(x));
            if (!this.current_drive || !this.current_drive.mounted)
                this.current_drive = new Drive(this.drives[0]);
        });
    }

    get show_back() {
        return this.current_url && this.current_url !== this.root_url;
    }

    closeMenu() {
        this.sidebar.close();
    }

    onToggleMenu() {
        this.sidebar.toggle();
    }

    onGoBack() {
        this._router.navigateByUrl(this.back_url);
    }

    openDrive(drive: Drive) {
        this._filesService.drive$.next(drive);
    }
}
