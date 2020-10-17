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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var qemu_lpc4088_controller_1 = __importDefault(require("qemu-lpc4088-controller"));
var MachineState_1 = __importDefault(require("./MachineState"));
var QemuConnector = /** @class */ (function () {
    function QemuConnector() {
    }
    QemuConnector.updateMachineState = function (msg) {
        if (this.machineState) {
            if (msg.module === "GPIO") {
                if (msg.event === "reg_change") {
                    if (QemuConnector.onMachineStateChangeHandler) {
                        if (this.machineState.gpioState.PORTS[msg.port].DIR !== msg.DIR) {
                            QemuConnector.onMachineStateChangeHandler({
                                module: "GPIO",
                                event: "dir_change",
                                port: msg.port,
                                old_dir: this.machineState.gpioState.PORTS[msg.port].DIR,
                                new_dir: msg.DIR,
                            });
                        }
                        if (this.machineState.gpioState.PORTS[msg.port].MASK !== msg.MASK) {
                            QemuConnector.onMachineStateChangeHandler({
                                module: "GPIO",
                                event: "mask_change",
                                port: msg.port,
                                old_mask: this.machineState.gpioState.PORTS[msg.port].MASK,
                                new_mask: msg.MASK,
                            });
                        }
                        if (this.machineState.gpioState.PORTS[msg.port].PIN !== msg.PIN) {
                            QemuConnector.onMachineStateChangeHandler({
                                module: "GPIO",
                                event: "pin_change",
                                port: msg.port,
                                old_pin: this.machineState.gpioState.PORTS[msg.port].PIN,
                                new_pin: msg.PIN,
                            });
                        }
                    }
                    this.machineState.gpioState.PORTS[msg.port].DIR = msg.DIR;
                    this.machineState.gpioState.PORTS[msg.port].MASK = msg.MASK;
                    this.machineState.gpioState.PORTS[msg.port].PIN = msg.PIN;
                }
            }
            else if (msg.module === "IOCON") {
                if (msg.event === "reg_change") {
                    var new_func = (msg.value & 0x7);
                    if (QemuConnector.onMachineStateChangeHandler) {
                        if (this.machineState.ioconState.PORTS[msg.port][msg.pin] !== new_func) {
                            QemuConnector.onMachineStateChangeHandler({
                                module: "IOCON",
                                event: "func_change",
                                port: msg.port,
                                pin: msg.pin,
                                old_func: this.machineState.ioconState.PORTS[msg.port][msg.pin],
                                new_func: new_func,
                            });
                        }
                    }
                    this.machineState.ioconState.PORTS[msg.port][msg.pin] = (msg.value & 0x7);
                }
            }
        }
    };
    QemuConnector.start_qemu = function (exe_file) {
        return __awaiter(this, void 0, void 0, function () {
            var qemu;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.machineState = new MachineState_1.default();
                        return [4 /*yield*/, qemu_lpc4088_controller_1.default.start_qemu(exe_file)];
                    case 1:
                        qemu = _a.sent();
                        qemu_lpc4088_controller_1.default.SenderMQ.open();
                        qemu_lpc4088_controller_1.default.ReceiverMQ.open();
                        qemu_lpc4088_controller_1.default.ReceiverMQ.set_receive_handler(function (msg) {
                            _this.updateMachineState(msg);
                            if (QemuConnector.eventHandler !== undefined) {
                                QemuConnector.eventHandler(msg);
                            }
                        });
                        return [2 /*return*/, qemu];
                }
            });
        });
    };
    QemuConnector.setEventHandler = function (handler) {
        QemuConnector.eventHandler = handler;
    };
    QemuConnector.setOnMachineStateChangeHandler = function (handler) {
        QemuConnector.onMachineStateChangeHandler = handler;
    };
    QemuConnector.clearEventHandler = function () {
        QemuConnector.eventHandler = undefined;
    };
    QemuConnector.clearOnMachineStateChangeHandler = function () {
        QemuConnector.onMachineStateChangeHandler = undefined;
    };
    return QemuConnector;
}());
exports.default = QemuConnector;
