export declare type MachineStateEventData = GPIOStateEventData | IOCONStateEventData | TIMERStateEventData | UARTStateEventData;
declare type GPIOStateEventData = GPIOStateDIRChangeEventData | GPIOStateMASKChangeEventData | GPIOStatePINChangeEventData;
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
declare type IOCONStateEventData = IOCONStateFuncChangeEventData;
interface IOCONStateFuncChangeEventData {
    module: "IOCON";
    event: "func_change";
    port: number;
    pin: number;
    old_func: number;
    new_func: number;
}
declare type TIMERStateEventData = TIMERStateRegChangeEventData | TIMERStateEMRChangeEventData;
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
declare type UARTStateEventData = UARTStateCharReceiveEventData | UARTStateRegChangeEventData;
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
declare type IOCONPinState = number;
interface IOCONPortState {
    [k: number]: IOCONPinState;
}
export interface IOCONState {
    PORTS: IOCONPortState[];
}
export interface TIMERState {
    [k: string]: number;
}
export declare function timerOffsetToRegName(offset: number): "IR" | "TCR" | "TC" | "PR" | "PC" | "MCR" | "MR0" | "MR1" | "MR2" | "MR3" | "CCR" | "CR0" | "CR1" | "EMR" | "CTCR" | "[?]";
export {};
