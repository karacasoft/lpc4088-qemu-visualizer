import electron, { ipcMain, app, BrowserWindow } from "electron";
import url from 'url';
import path from 'path';
import { QemuProcessInterface } from "qemu-lpc4088-controller/dist/apprunner/qemu_runner";
import { GPIO } from "qemu-lpc4088-controller/dist/sender";
import QemuConnector from "./src/electron-main/QemuConnector/QemuConnector";
import { toPinType, toPortType } from "qemu-lpc4088-controller/dist/qemu_mq_types";

let mainWindow: BrowserWindow | null;
let optionsWindow: BrowserWindow | null;

let _filename: string | null = null;
let _qemuInterface: QemuProcessInterface | null = null;



function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            enableRemoteModule: true,
        },
    });
    let startURL = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, "build/index.html"),
        protocol: "file:",
        slashes: true,
    });
    mainWindow.loadURL(startURL);

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
        if(optionsWindow !== null) {
            optionsWindow.close();
        }
    });

    optionsWindow = new BrowserWindow({
        width: 1024,
        height: 350,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            enableRemoteModule: true,
        },
    });

    let startURLOptions = startURL + "?options=true";
    optionsWindow.loadURL(startURLOptions);

    optionsWindow.webContents.openDevTools();

    optionsWindow.on('closed', () => {
        optionsWindow = null;
    });

    ipcMain.on('gpio-pin-change', (ev, port, pin, val) => {
        if(_qemuInterface) {
            const port_nr = toPortType(port);
            const pin_nr = toPinType(pin);
            if(port_nr !== undefined && pin_nr !== undefined) {
                if(val === 0) {
                    GPIO.clr_pin(port_nr, pin_nr);
                } else {
                    GPIO.set_pin(port_nr, pin_nr);
                }
            }
        }
    });

    ipcMain.on("message-to-main", (ev, message, ...args) => {
        if(mainWindow) mainWindow.webContents.send(message, ...args);
    });

    ipcMain.on('exec-file-select', (ev, filename) => {
        if(filename) _filename = filename;
    });

    ipcMain.on('start-exec', async (ev) => {
        if(!_qemuInterface && _filename) {
            try {
                _qemuInterface = await QemuConnector.start_qemu(_filename);
                QemuConnector.setOnMachineStateChangeHandler((ev) => {
                    if(mainWindow !== null) {
                        mainWindow.webContents.send("on-machine-state-changed", ev);
                    }
                });
                _qemuInterface.run();
                if(mainWindow !== null && QemuConnector.machineState) {
                    mainWindow.webContents.send("iocon-state", QemuConnector.machineState.getIoconState);
                }
                if(optionsWindow !== null) {
                    optionsWindow.webContents.send("exec-started");
                }
            } catch(err) {
                if(optionsWindow !== null) {
                    optionsWindow.webContents.send("exec-start-failed");
                }
            }
            
        }
    });

    ipcMain.on('stop-exec', async (ev) => {
        if(_qemuInterface !== null) {
            _qemuInterface.kill();
            _qemuInterface = null;
            if(optionsWindow !== null) {
                optionsWindow.webContents.send("exec-stopped");
            }
        }
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if(mainWindow === null) {
        createWindow();
    }
});