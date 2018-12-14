import { FsStat } from './fs-stat';

export class File {
    full_path: Array<string> = [];
    title: string = '';
    type: string = '';
    stat: FsStat;

    name: string = '';
    selected: boolean = false;
    thumb: string = '';
    width: number;
    height: number;
    default_picture: string = 'assets/picture.svg';

    constructor(data?) {
        if (data) {
            if (data.hasOwnProperty('full_path')) {
                if (data.full_path instanceof Array)
                    this.full_path = data.full_path;
                else if (typeof data.full_path === 'string')
                    this.full_path = data.full_path.split(/\\/g);
            }
            if (data.hasOwnProperty('title')) this.title = data.title;
            if (data.hasOwnProperty('type')) this.type = data.type;
            if (data.hasOwnProperty('stat')) this.stat = new FsStat(data.stat);

            if (data.hasOwnProperty('name')) this.name = data.name;
            if (data.hasOwnProperty('full_path')) this.full_path = data.full_path;
            if (data.hasOwnProperty('selected')) this.selected = data.selected;
            if (data.hasOwnProperty('thumb')) this.thumb = data.thumb;
        }
    }

    get mimeType() {
        let ext = this.title.split('.').reverse()[0].toLowerCase();
        if (ext === 'jpeg') ext = 'jpg';
        return `image/${ext}`;
    }

    buildThumb() {
        const img = new Image();

        img.onload = () => {
            if (this.mimeType !== 'image/gif') {
                const canvas = document.createElement('canvas'),
                    width = 300, // destination canvas size
                    ctx = canvas.getContext('2d');

                canvas.width = width;
                canvas.height = canvas.width * img.height / img.width;

                this.width = img.width;
                this.height = img.height;

                let cur = {
                    width: Math.floor(img.width * 0.5),
                    height: Math.floor(img.height * 0.5)
                };

                canvas.width = cur.width;
                canvas.height = cur.height;

                ctx.drawImage(img, 0, 0, cur.width, cur.height);

                while (cur.width * 0.5 > width) {
                    cur = {
                        width: Math.floor(cur.width * 0.5),
                        height: Math.floor(cur.height * 0.5)
                    };
                    ctx.drawImage(canvas, 0, 0, cur.width * 2, cur.height * 2, 0, 0, cur.width, cur.height);
                }

                ctx.drawImage(canvas, 0, 0, cur.width, cur.height, 0, 0, canvas.width, canvas.height);

                this.thumb = canvas.toDataURL();
            } else {
                this.thumb = [...this.full_path, this.title].join('/');
            }
        };

        img.onerror = (err) => {
            // let new_full_path = this.full_path.split('.');
            // new_full_path.pop();
            // if (this.mimeType === 'image/jpg') {
            //     this.full_path = new_full_path.join('.') + '.png';
            //     this.buildThumb();
            // } else if (this.mimeType === 'image/png') {
            //     this.full_path = new_full_path.join('.') + '.gif';
            //     this.buildThumb();
            // }
        };

        img.src = [...this.full_path, this.title].join('/');
    }
}
