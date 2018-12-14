const env = require('./environment.js');
const {
    app,
    BrowserWindow,
    ipcMain,
    Menu,
    MenuItem,
    Tray,
    globalShortcut
} = require('electron');

const path = require('path');
const url = require('url');
const fs = require('fs');

const windowStateKeeper = require('electron-window-state');

let mainWindow;

function createWindow() {
    // Initialize window state keeper
    let winState = windowStateKeeper({
        defaultWidth: env.default_width,
        defaultHeight: env.default_height
    });

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: winState.width,
        height: winState.height,
        minWidth: env.min_width,
        minHeight: env.min_height,
        x: winState.x,
        y: winState.y,
        resizable: env.resizable,
        frame: env.frame,
        show: false,
        backgroundColor: '#ffffff',
        icon: `file://${path.join(__dirname, '..', env.html_src, 'assets', 'app-icon-l.jpg')}`
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '..', env.html_src, 'index.html'),
        protocol: 'file:',
        slashes: true,
        webPreferences: {
            webSecurity: false
        }
    }));

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // open the DevTools if not in production mode
    if (!env.production)
        mainWindow.webContents.openDevTools();

    // open the DevTools with Ctrl-F12
    globalShortcut.register('CommandOrControl+F12', () => {
        mainWindow.webContents.openDevTools();
    });

    // Event when the window is closed.
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Enable Electron reload if not in production mode
if (!env.production)
    require('electron-reload')(
        path.join(__dirname, '..'), {
            ignored: /node_modules|[\/\\]\./,
            electron: path.join(__dirname, '..', 'node_modules', 'electron', 'dist', 'electron.exe')
        }
    );

// Create window on electron intialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS specific close process
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // macOS specific close process
    if (win === null) {
        createWindow();
    }
});


/******************************/
/******* EXAMPLE EVENTS *******/
/******************************/

// Event handler for asynchronous incoming messages
ipcMain.on('asynchronous-message', (event, arg) => {
    console.log(arg);

    // Event emitter for sending asynchronous messages
    event.sender.send('asynchronous-reply', 'async pong')
});

// Event handler for synchronous incoming messages
ipcMain.on('synchronous-message', (event, arg) => {
    console.log(arg);

    // Synchronous event emmision
    event.returnValue = 'sync pong'
});

/******************************/
/******* DATA RETRIEVAL *******/
/******************************/
// This one works:
const exec = require('child_process').exec;

const diskinfo = require('diskinfo');

ipcMain.on('get-drives', (event) => {
    const getDrives = new Promise((resolve, reject) => {
        diskinfo.getDrives((err, aDrives) => {
            aDrives.forEach((drive, i) => {
                exec(`vol ${drive.mounted}`, (err, stdout, stderr) => {
                    if (stdout.replace('\r\n', '') === 'The device is not ready.') {
                        drive.volume_label = '';
                        drive.serial_number = '';
                    } else {
                        const data = stdout.split('\r\n');
                        data[0] = data[0].replace(` Volume in drive ${drive.mounted.replace(':', '')} is`, '').replace(`Volume in drive ${drive.mounted.replace(':', '')} has no label.`, '');
                        if (data[0] === ' ') data[0] = '';
                        data[1] = data[1].replace('Volume Serial Number is', '');
                        drive.volume_label = data[0];
                        drive.serial_number = data[1];
                    }
                    if (i === aDrives.length - 1)
                        resolve(aDrives);
                });
            });
        });
    });

    getDrives.then(drives => {
        const distinct = [];
        drives.forEach(drive => {

            const found = !!distinct.filter(d => d.mounted === drive.mounted).length;
            if (!found)
                distinct.push(drive);
        });
        event.sender.send('get-drives:response', distinct);
    }).catch((stderr) => {
        console.error(stderr);
        event.sender.send('get-drives:response', []);
    });
});

ipcMain.on('get-path-content', (event, dir_array) => {
    console.log(dir_array);
    if (dir_array[dir_array.length - 1] === '') dir_array[dir_array.length - 1] = '/';
    const dir_path = path.join(...dir_array);
    console.log(dir_path);
    fs.readdir(dir_path, (err, files) => {

        const files_list = [];
        files.forEach(file => {
            const file_path = path.resolve(dir_path, file);
            let stat;
            try {
                // ...because there might be locked files
                stat = fs.statSync(file_path);
            } catch (error) {}
            if (stat && stat.isDirectory()) {
                files_list.push({
                    full_path: file_path,
                    title: file,
                    type: 'folder',
                    stat: stat
                });
            } else if (stat) {
                let ext = (file.lastIndexOf('.') < 0) ? '' : file.substr(file.lastIndexOf('.'));
                if (['.jpg', '.jpeg', '.gif', '.png', '.gif', '.webm'].indexOf(ext.toLowerCase()) > -1) {
                    files_list.push({
                        full_path: file_path,
                        title: file,
                        type: 'file',
                        stat: stat
                    });
                }
            }
        });
        let sorted_list = [];
        sorted_list = files_list.filter((x) => {
            return x.type === 'folder';
        });

        files_list.filter((x) => {
            return x.type === 'file';
        }).forEach(x => {
            sorted_list.push(x);
        });

        event.sender.send('get-path-content:response', sorted_list);
    });
    // event.sender.send('get-path-content:response', []);
});
