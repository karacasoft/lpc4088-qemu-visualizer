export declare type PinFunction = GPIOPinFunction | UARTPinFunction | TIMERPinFunction | undefined;
export interface GPIOPinFunction {
    module: "GPIO";
    port: number;
    pin: number;
}
export interface UARTPinFunction {
    module: "UART";
    uart_name: number;
}
export interface TIMERPinFunction {
    module: "TIMER";
    timer_name: number;
    type: "match" | "capture";
    pin_nr: number;
}
export declare const IOCON_LOOKUP_TABLE: {
    [k: number]: PinFunction | undefined;
}[][];
