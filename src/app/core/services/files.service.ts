import { Injectable } from '@angular/core';
import { Drive, Folder, File } from '@app/shared/models';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { ElectronClientService } from './electron-client.service';

@Injectable()
export class FilesService {

    private _drives: Drive[] = [];
    private _current_drive: Drive = new Drive();
    private _path: Array<string> = [];
    private _dir_content: Array<Folder | File> = [];

    loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    drives$: BehaviorSubject<Drive[]> = new BehaviorSubject(this.drives);
    drive$: BehaviorSubject<Drive> = new BehaviorSubject(this.current_drive);

    path$: BehaviorSubject<Array<string>> = new BehaviorSubject([...this._path]);
    path_files$: BehaviorSubject<Array<string>> = new BehaviorSubject([...this._path]);

    dir_content$: BehaviorSubject<Array<Folder | File>> = new BehaviorSubject([]);

    constructor(
        private _electronClient: ElectronClientService,
    ) {
        const last_drive = JSON.parse(localStorage.getItem('last_drive') || null);
        this._current_drive = new Drive(last_drive);

        this.drive$.subscribe((drive: Drive) => {
            this._current_drive = drive;
            localStorage.setItem('last_drive', JSON.stringify(this._current_drive));
            this._path = [];
            if (this.current_drive.mounted)
                this.path$.next([this.current_drive.mounted, ...this.current_path]);
        });

        this.path$.subscribe((path: Array<string>) => {
            console.log(path);

            this.getPath([...path]).subscribe();
        });

        this.getDrives().subscribe((drives: Drive[]) => {
            this.path$.next([this.current_drive.mounted, ...this._path]);
        });

    }

    getDrives(): Observable<Drive[]> {
        return Observable.create((observer: Observer<Drive[]>) => {
            this.loading$.next(true);
            this._electronClient.send('get-drives').subscribe(data => {
                this._drives = data.map(x => new Drive(x));
                this.drives$.next(this.drives);

                if (!this.current_drive.mounted) {
                    this._current_drive = new Drive(this.drives[0]);
                    this.drive$.next(this.current_drive);

                }

                this.loading$.next(false);
                observer.next(this.drives);
                observer.complete();
            });
        });
    }

    getPath(path: Array<string>): Observable<Array<Folder | File>> {
        return Observable.create((observer: Observer<Array<Folder | File>>) => {
            if (path.length === 1) path = [...path, '/'];
            this._electronClient.send('get-path-content', path).subscribe(data => {
                this._dir_content = data.map(x => {
                    if (x.type === 'folder')
                        return new Folder(x);
                    else
                        return new File(x);
                });
                this.dir_content$.next(this.dir_content);
                observer.next(this.dir_content);
                observer.complete();
            });
        });
    }

    get current_drive(): Drive {
        return new Drive(this._current_drive);
    }

    get current_path(): Array<string> {
        return [...this._path];
    }

    get drives(): Drive[] {
        return [...this._drives];
    }

    get dir_content(): Array<Folder | File> {
        return [...this._dir_content];
    }
}
