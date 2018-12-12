import { Component, OnInit, OnDestroy } from '@angular/core';
import { FilesService } from '@app/core';
import { Folder, File } from '@app/shared/models';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-files-list',
    templateUrl: './files-list.component.html',
    styleUrls: ['./files-list.component.scss']
})
export class FilesListComponent implements OnInit, OnDestroy {

    grid_cols = 6;

    dir_content: Array<Folder | File> = [];

    dir_content_subs: Subscription;

    constructor(
        private _filesService: FilesService,
    ) {
        this._filesService.path$.subscribe((path: Array<string>) => {

        });
        this.dir_content_subs = this._filesService.dir_content$.subscribe((content: Array<Folder | File>) => {
            this.dir_content = content;
        });
    }

    ngOnInit() {
    }

    openDir(dir_item: Folder) {
        this._filesService.path$.next(dir_item.full_path);
    }

    ngOnDestroy() {
        this.dir_content_subs.unsubscribe();
    }

}
