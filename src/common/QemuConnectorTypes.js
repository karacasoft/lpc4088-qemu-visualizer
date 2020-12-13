"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pwmOffsetToRegName = exports.timerOffsetToRegName = void 0;
function timerOffsetToRegName(offset) {
    switch (offset) {
        case 0x00: return "IR";
        case 0x04: return "TCR";
        case 0x08: return "TC";
        case 0x0C: return "PR";
        case 0x10: return "PC";
        case 0x14: return "MCR";
        case 0x18: return "MR0";
        case 0x1C: return "MR1";
        case 0x20: return "MR2";
        case 0x24: return "MR3";
        case 0x28: return "CCR";
        case 0x2C: return "CR0";
        case 0x30: return "CR1";
        case 0x3C: return "EMR";
        case 0x70: return "CTCR";
        default: return "[?]";
    }
}
exports.timerOffsetToRegName = timerOffsetToRegName;
function pwmOffsetToRegName(offset) {
    switch (offset) {
        case 0x00: return "IR";
        case 0x04: return "TCR";
        case 0x08: return "TC";
        case 0x0C: return "PR";
        case 0x10: return "PC";
        case 0x14: return "MCR";
        case 0x18: return "MR0";
        case 0x1C: return "MR1";
        case 0x20: return "MR2";
        case 0x24: return "MR3";
        case 0x28: return "CCR";
        case 0x2C: return "CR0";
        case 0x30: return "CR1";
        case 0x40: return "MR4";
        case 0x44: return "MR5";
        case 0x48: return "MR6";
        case 0x4C: return "PCR";
        case 0x50: return "LER";
        case 0x70: return "CTCR";
        default: return "[?]";
    }
}
exports.pwmOffsetToRegName = pwmOffsetToRegName;
