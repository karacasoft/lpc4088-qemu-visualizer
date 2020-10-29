export type MachineStateEventData = GPIOStateEventData | IOCONStateEventData | TIMERStateEventData | UARTStateEventData;

type GPIOStateEventData = GPIOStateDIRChangeEventData |
                          GPIOStateMASKChangeEventData |
                          GPIOStatePINChangeEventData;

interface GPIOStateDIRChangeEventData {
    module: "GPIO";
    event: "dir_change";
    port: number;
    old_dir: number;
    new_dir: number;
}

interface GPIOStateMASKChangeEventData {
    module: "GPIO";
    event: "mask_change";
    port: number;
    old_mask: number;
    new_mask: number;
}

interface GPIOStatePINChangeEventData {
    module: "GPIO";
    event: "pin_change";
    port: number;
    old_pin: number;
    new_pin: number;
}

type IOCONStateEventData = IOCONStateFuncChangeEventData;

interface IOCONStateFuncChangeEventData {
    module: "IOCON";
    event: "func_change";
    port: number;
    pin: number;
    old_func: number;
    new_func: number;
}

type TIMERStateEventData = TIMERStateRegChangeEventData | TIMERStateEMRChangeEventData;

interface TIMERStateRegChangeEventData {
    module: "TIMER";
    event: "reg_change";
    timer_nr: number;
    offset: number;
    old_val: number;
    new_val: number;
}

interface TIMERStateEMRChangeEventData {
    module: "TIMER";
    event: "emr_change";
    timer_nr: number;
    old_emr: number;
    new_emr: number;
}

type UARTStateEventData = UARTStateCharReceiveEventData | UARTStateRegChangeEventData;

interface UARTStateRegChangeEventData {
    module: "UART";
    event: "reg_change";
    uart_nr: number;
    offset: number;
    old_val: number;
    new_val: number;
}

interface UARTStateCharReceiveEventData {
    module: "UART";
    event: "char_receive";
    uart_nr: number;
    received_char: string;
}

interface GPIOPortState {
    DIR: number;
    MASK: number;
    PIN: number;
}

export interface GPIOState {
    PORTS: GPIOPortState[];
}

type IOCONPinState = number;

interface IOCONPortState {
    [k: number]: IOCONPinState;
}

export interface IOCONState {
    PORTS: IOCONPortState[];
}

export interface TIMERState {
    [k: string]: number,
}

export function timerOffsetToRegName(offset: number) {
    switch(offset) {
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
