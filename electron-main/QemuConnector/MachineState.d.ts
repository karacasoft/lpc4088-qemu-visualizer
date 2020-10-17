interface GPIOPortState {
    DIR: number;
    MASK: number;
    PIN: number;
}
interface GPIOState {
    PORTS: GPIOPortState[];
}
declare type IOCONPinState = number;
interface IOCONPortState {
    [k: number]: IOCONPinState;
}
interface IOCONState {
    PORTS: IOCONPortState[];
}
declare class MachineState {
    gpioState: GPIOState;
    ioconState: IOCONState;
    constructor();
    get getGpioState(): GPIOState;
    get getIoconState(): IOCONState;
}
export default MachineState;
