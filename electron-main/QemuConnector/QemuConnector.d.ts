import { QemuEventData } from 'qemu-lpc4088-controller';
import MachineState from './MachineState';
export declare type QemuEventHandler = (qemuEvent: QemuEventData) => void;
export declare type MachineStateEventData = GPIOStateEventData | IOCONStateEventData;
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
export declare type OnMachineStateChangeHandler = (event: MachineStateEventData) => void;
declare class QemuConnector {
    static eventHandler?: QemuEventHandler;
    static onMachineStateChangeHandler?: OnMachineStateChangeHandler;
    static machineState?: MachineState;
    static updateMachineState(msg: QemuEventData): void;
    static start_qemu(exe_file: string): Promise<import("qemu-lpc4088-controller/dist/apprunner/qemu_runner").QemuProcessInterface>;
    static setEventHandler(handler: QemuEventHandler): void;
    static setOnMachineStateChangeHandler(handler: OnMachineStateChangeHandler): void;
    static clearEventHandler(): void;
    static clearOnMachineStateChangeHandler(): void;
}
export default QemuConnector;
