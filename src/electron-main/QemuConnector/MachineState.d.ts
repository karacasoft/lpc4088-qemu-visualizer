import { GPIOState, IOCONState } from "../../common/QemuConnectorTypes";
declare class MachineState {
    gpioState: GPIOState;
    ioconState: IOCONState;
    constructor();
    get getGpioState(): GPIOState;
    get getIoconState(): IOCONState;
}
export default MachineState;
