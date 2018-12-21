import { FsStat } from './fs-stat';
import { Observable } from 'rxjs';

export class File {
    full_path: Array<string> = [];
    title: string = '';
    parent_path: string = '';
    type: string = '';
    stat: FsStat;

    name: string = '';
    selected: boolean = false;
    _thumb: string = '';
    width: number;
    height: number;
    default_picture: string = 'assets/picture.svg';

    constructor(data?) {
        if (data) {
            if (data.hasOwnProperty('title')) this.title = data.title;
            if (data.hasOwnProperty('full_path')) {
                if (data.full_path instanceof Array)
                    this.full_path = data.full_path;
                else if (typeof data.full_path === 'string') {
                    this.full_path = data.full_path.split(/[\\\/]/g);
                }

            }
            if (data.hasOwnProperty('type')) this.type = data.type;
            if (data.hasOwnProperty('stat')) this.stat = new FsStat(data.stat);

            if (data.hasOwnProperty('name')) this.name = data.name;
            if (data.hasOwnProperty('selected')) this.selected = data.selected;
            if (data.hasOwnProperty('thumb')) this._thumb = data.thumb;
            else if (this.type === 'file') this.makeThumb().then(thumb => this._thumb = thumb);
        }
    }

    get mimeType() {
        let ext = this.title.split('.').reverse()[0].toLowerCase();
        if (ext === 'jpeg') ext = 'jpg';
        return `image/${ext}`;
    }

    get thumb() {
        return Observable.create(observer => {
            if (this._thumb) {
                observer.next(this._thumb);
                observer.complete();
            } else {
                this.makeThumb().then(thumb => {
                    observer.next(thumb);
                    observer.complete();
                });
            }
        });
    }

    makeThumb(): Promise<string> {
        return new Promise(resolve => {
            const img = new Image();

            img.onload = () => {
                // if (this.mimeType !== 'image/gif') {
                    const canvas = document.createElement('canvas'),
                        width = 250, // destination canvas size
                        height = 250,
                        ctx = canvas.getContext('2d');

                    canvas.width = width;
                    canvas.height = height;

                    this.width = img.width;
                    this.height = img.height;

                    const img_dim = {
                        width: 0,
                        height: 0,
                        x: 0,
                        y: 0
                    };

                    if (img.width > img.height) {
                        img_dim.height = height;
                        img_dim.width = (img.width / img.height) * width;
                        img_dim.x = (width - img_dim.width) / 2;
                    } else {
                        img_dim.height = (img.height / img.width) * height;
                        img_dim.width = width;
                        img_dim.y = (height - img_dim.height) / 2;
                    }

                    ctx.drawImage(img, img_dim.x, img_dim.y, img_dim.width, img_dim.height);
                    this._thumb = canvas.toDataURL();

                    resolve(this._thumb);
                // }
            };

            img.src = [...this.full_path].join('/');
        });
    }

    // buildThumb() {
    //     const img = new Image();

    //     img.onload = () => {
    //         if (this.mimeType !== 'image/gif') {
    //             const canvas = document.createElement('canvas'),
    //                 width = 200, // destination canvas size
    //                 height = 200,
    //                 ctx = canvas.getContext('2d');

    //             canvas.width = width;
    //             // canvas.height = canvas.width * img.height / img.width;
    //             canvas.height = height;

    //             this.width = img.width;
    //             this.height = img.height;

    //             let cur = {
    //                 width: Math.floor(img.width * 0.5),
    //                 height: Math.floor(img.height * 0.5)
    //             };

    //             canvas.width = cur.width;
    //             canvas.height = cur.height;

    //             ctx.drawImage(img, 0, 0, cur.width, cur.height);

    //             while (cur.width * 0.5 > width) {
    //                 cur = {
    //                     width: Math.floor(cur.width * 0.5),
    //                     height: Math.floor(cur.height * 0.5)
    //                 };
    //                 ctx.drawImage(canvas, 0, 0, cur.width * 2, cur.height * 2, 0, 0, cur.width, cur.height);
    //             }

    //             ctx.drawImage(canvas, 0, 0, cur.width, cur.height, 0, 0, canvas.width, canvas.height);

    //             this.thumb = canvas.toDataURL();
    //             console.log(this.thumb);
    //         } else {
    //             this.thumb = [...this.full_path].join('/');
    //         }
    //     };

    //     img.onerror = (err) => {
    //         // let new_full_path = this.full_path.split('.');
    //         // new_full_path.pop();
    //         // if (this.mimeType === 'image/jpg') {
    //         //     this.full_path = new_full_path.join('.') + '.png';
    //         //     this.buildThumb();
    //         // } else if (this.mimeType === 'image/png') {
    //         //     this.full_path = new_full_path.join('.') + '.gif';
    //         //     this.buildThumb();
    //         // }
    //     };
    //     console.log([...this.full_path].join('/'));
    //     img.src = [...this.full_path].join('/');
    // }
}
