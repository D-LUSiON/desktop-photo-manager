export class FsStat {
    atime: string;
    birthtime: string;
    ctime: string;
    dev: number;
    gid: number;
    ino: number;
    mode: number;
    mtime: string;
    nlink: number;
    rdev: number;
    size: number;
    uid: number;

    constructor(data?) {
        if (data) {
            if (data.hasOwnProperty('atime')) this.atime = data.atime;
            if (data.hasOwnProperty('birthtime')) this.birthtime = data.birthtime;
            if (data.hasOwnProperty('ctime')) this.ctime = data.ctime;
            if (data.hasOwnProperty('dev')) this.dev = data.dev;
            if (data.hasOwnProperty('gid')) this.gid = data.gid;
            if (data.hasOwnProperty('ino')) this.ino = data.ino;
            if (data.hasOwnProperty('mode')) this.mode = data.mode;
            if (data.hasOwnProperty('mtime')) this.mtime = data.mtime;
            if (data.hasOwnProperty('nlink')) this.nlink = data.nlink;
            if (data.hasOwnProperty('rdev')) this.rdev = data.rdev;
            if (data.hasOwnProperty('size')) this.size = data.size;
            if (data.hasOwnProperty('uid')) this.uid = data.uid;
        }
    }
}
