"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var url_1 = __importDefault(require("url"));
var path_1 = __importDefault(require("path"));
var sender_1 = require("qemu-lpc4088-controller/dist/sender");
var QemuConnector_1 = __importDefault(require("./src/electron-main/QemuConnector/QemuConnector"));
var qemu_mq_types_1 = require("qemu-lpc4088-controller/dist/qemu_mq_types");
var mainWindow = null;
var optionsWindow = null;
var _filename = null;
var _qemuInterface = null;
function createWindow() {
    var _this = this;
    mainWindow = new electron_1.BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            enableRemoteModule: true,
        },
    });
    var startURL = process.env.ELECTRON_START_URL || url_1.default.format({
        pathname: path_1.default.join(__dirname, "build/index.html"),
        protocol: "file:",
        slashes: true,
    });
    mainWindow.setMenu(null);
    mainWindow.loadURL(startURL);
    mainWindow.on('closed', function () {
        mainWindow = null;
        if (optionsWindow !== null) {
            optionsWindow.close();
        }
    });
    /*optionsWindow = new BrowserWindow({
        width: 1024,
        height: 350,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            enableRemoteModule: true,
        },
    });

    let startURLOptions = startURL + "?options=true";
    optionsWindow.setMenu(null);
    optionsWindow.loadURL(startURLOptions);

    

    optionsWindow.on('closed', () => {
        optionsWindow = null;
    });*/
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === "development") {
        mainWindow.webContents.openDevTools();
        //optionsWindow.webContents.openDevTools();
    }
    electron_1.ipcMain.on('gpio-pin-change', function (ev, port, pin, val) {
        if (_qemuInterface) {
            var port_nr = qemu_mq_types_1.toPortType(port);
            var pin_nr = qemu_mq_types_1.toPinType(pin);
            if (port_nr !== undefined && pin_nr !== undefined) {
                if (val === 0) {
                    sender_1.GPIO.clr_pin(port_nr, pin_nr);
                }
                else {
                    sender_1.GPIO.set_pin(port_nr, pin_nr);
                }
            }
        }
    });
    electron_1.ipcMain.on('timer-capture', function (ev, timer, pin, val) {
        if (_qemuInterface) {
            // val = 1 sends a rising edge
            // val = 0 sends a falling edge
            var t_nr = qemu_mq_types_1.toTimerType(timer);
            if (t_nr !== undefined) {
                sender_1.TIMER.send_capture(t_nr, pin, val === 1);
            }
        }
    });
    electron_1.ipcMain.on("message-to-main", function (ev, message) {
        var _a;
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (mainWindow)
            (_a = mainWindow.webContents).send.apply(_a, __spreadArrays([message], args));
    });
    electron_1.ipcMain.on('exec-file-select', function (ev, filename) {
        if (filename)
            _filename = filename;
    });
    electron_1.ipcMain.on('start-exec', function (ev) { return __awaiter(_this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(!_qemuInterface && _filename)) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, QemuConnector_1.default.start_qemu(_filename)];
                case 2:
                    _qemuInterface = _a.sent();
                    QemuConnector_1.default.setOnMachineStateChangeHandler(function (ev) {
                        if (mainWindow !== null) {
                            mainWindow.webContents.send("on-machine-state-changed", ev);
                        }
                    });
                    console.log(_qemuInterface);
                    _qemuInterface.run();
                    if (mainWindow !== null && QemuConnector_1.default.machineState) {
                        mainWindow.webContents.send("exec-started", QemuConnector_1.default.machineState.getIoconState);
                    }
                    if (optionsWindow !== null) {
                        optionsWindow.webContents.send("exec-started");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.log(err_1);
                    if (optionsWindow !== null) {
                        optionsWindow.webContents.send("exec-start-failed");
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    electron_1.ipcMain.on('stop-exec', function (ev) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (_qemuInterface !== null) {
                _qemuInterface.kill();
                _qemuInterface = null;
                if (optionsWindow !== null) {
                    optionsWindow.webContents.send("exec-stopped");
                }
            }
            return [2 /*return*/];
        });
    }); });
    electron_1.app.on('before-quit', function () {
        if (_qemuInterface !== null) {
            _qemuInterface.kill();
            _qemuInterface = null;
            if (optionsWindow !== null) {
                optionsWindow.webContents.send("exec-stopped");
            }
        }
    });
}
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
