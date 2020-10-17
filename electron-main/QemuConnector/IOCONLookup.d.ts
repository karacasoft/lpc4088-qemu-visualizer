export declare type PinFunction = GPIOPinFunction | UARTPinFunction | undefined;
export interface GPIOPinFunction {
    module: "GPIO";
    port: number;
    pin: number;
}
export interface UARTPinFunction {
    module: "UART";
    uart_name: number;
}
export declare const IOCON_LOOKUP_TABLE: {
    [k: number]: PinFunction | undefined;
}[][];
