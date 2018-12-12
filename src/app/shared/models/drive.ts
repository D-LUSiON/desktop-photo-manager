export class Drive {
    serial_number: string;
    filesystem: string;
    mounted: string;
    volume_label: string;
    blocks: number;
    used: number;
    available: number;
    capacity: string;

    constructor(data?) {
        if (data) {
            if (data.hasOwnProperty('serial_number')) this.serial_number = data.serial_number;
            if (data.hasOwnProperty('filesystem')) this.filesystem = data.filesystem;
            if (data.hasOwnProperty('mounted')) this.mounted = data.mounted;
            if (data.hasOwnProperty('volume_label')) this.volume_label = data.volume_label;
            if (data.hasOwnProperty('blocks')) this.blocks = data.blocks;
            if (data.hasOwnProperty('used')) this.used = data.used;
            if (data.hasOwnProperty('available')) this.available = data.available;
            if (data.hasOwnProperty('capacity')) this.capacity = data.capacity;
        }
    }
}
