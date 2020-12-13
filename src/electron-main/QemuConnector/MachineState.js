"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var MachineState = /** @class */ (function () {
    function MachineState() {
        this.gpioState = {
            PORTS: [
                { DIR: 0, PIN: 0, MASK: 0, },
                { DIR: 0, PIN: 0, MASK: 0, },
                { DIR: 0, PIN: 0, MASK: 0, },
                { DIR: 0, PIN: 0, MASK: 0, },
                { DIR: 0, PIN: 0, MASK: 0, },
                { DIR: 0, PIN: 0, MASK: 0, }
            ]
        };
        this.ioconState = {
            PORTS: [
                { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0, 24: 0, 25: 0, 26: 0, 27: 0, 28: 0, 29: 0, 30: 0, 31: 0 },
                { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0, 24: 0, 25: 0, 26: 0, 27: 0, 28: 0, 29: 0, 30: 0, 31: 0 },
                { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0, 24: 0, 25: 0, 26: 0, 27: 0, 28: 0, 29: 0, 30: 0, 31: 0 },
                { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0, 24: 0, 25: 0, 26: 0, 27: 0, 28: 0, 29: 0, 30: 0, 31: 0 },
                { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0, 24: 0, 25: 0, 26: 0, 27: 0, 28: 0, 29: 0, 30: 0, 31: 0 },
                { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0, 24: 0, 25: 0, 26: 0, 27: 0, 28: 0, 29: 0, 30: 0, 31: 0 }
            ]
        };
        this.timerState = {};
        this.pwmState = {};
    }
    Object.defineProperty(MachineState.prototype, "getGpioState", {
        get: function () {
            return {
                PORTS: [
                    __assign({}, this.gpioState.PORTS[0]),
                    __assign({}, this.gpioState.PORTS[1]),
                    __assign({}, this.gpioState.PORTS[2]),
                    __assign({}, this.gpioState.PORTS[3]),
                    __assign({}, this.gpioState.PORTS[4]),
                    __assign({}, this.gpioState.PORTS[5]),
                ]
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MachineState.prototype, "getIoconState", {
        get: function () {
            return {
                PORTS: [
                    __assign({}, this.ioconState.PORTS[0]),
                    __assign({}, this.ioconState.PORTS[1]),
                    __assign({}, this.ioconState.PORTS[2]),
                    __assign({}, this.ioconState.PORTS[3]),
                    __assign({}, this.ioconState.PORTS[4]),
                    __assign({}, this.ioconState.PORTS[5])
                ]
            };
        },
        enumerable: false,
        configurable: true
    });
    return MachineState;
}());
exports.default = MachineState;
