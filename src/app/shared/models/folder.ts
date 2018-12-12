import { FsStat } from './fs-stat';

export class Folder {
    full_path: Array<string> = [];
    title: string = '';
    type: string = '';
    stat: FsStat;

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
        }
    }
}
