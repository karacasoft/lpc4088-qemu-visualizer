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
var QemuConnector_1 = __importDefault(require("./src/electron-main/QemuConnector/QemuConnector"));
var mainWindow;
var optionsWindow;
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
    mainWindow.loadURL(startURL);
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', function () {
        mainWindow = null;
        if (optionsWindow !== null) {
            optionsWindow.close();
        }
    });
    optionsWindow = new electron_1.BrowserWindow({
        width: 1024,
        height: 350,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            enableRemoteModule: true,
        },
    });
    var startURLOptions = startURL + "?options=true";
    optionsWindow.loadURL(startURLOptions);
    optionsWindow.webContents.openDevTools();
    optionsWindow.on('closed', function () {
        optionsWindow = null;
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
                    _qemuInterface.run();
                    if (mainWindow !== null && QemuConnector_1.default.machineState) {
                        mainWindow.webContents.send("iocon-state", QemuConnector_1.default.machineState.getIoconState);
                    }
                    if (optionsWindow !== null) {
                        optionsWindow.webContents.send("exec-started");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
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
