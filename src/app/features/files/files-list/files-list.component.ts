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

    path: Array<string> = [];
    dir_content: Array<Folder | File> = [];

    path_subs: Subscription;
    dir_content_subs: Subscription;

    constructor(
        private _filesService: FilesService,
    ) {
        this.path_subs = this._filesService.path$.subscribe((path: Array<string>) => {
            this.path = path;

        });

        this.dir_content_subs = this._filesService.dir_content$.subscribe((content: Array<Folder | File>) => {
            this.dir_content = content;
        });
    }

    ngOnInit() {
    }

    goUp() {
        if (this.path.length > 1) {
            this.path.pop();
            this._filesService.path$.next(this.path);
        }
    }

    openDir(dir_item: Folder) {
        this._filesService.path$.next(dir_item.full_path);
    }

    openItem(dir_item: File)  {
        console.log(dir_item);
    }

    goToPathElement(idx: number) {
        const path = this.path.slice(0, idx + 1);
        this._filesService.path$.next(path);
    }

    ngOnDestroy() {
        this.path_subs.unsubscribe();
        this.dir_content_subs.unsubscribe();
    }

}
