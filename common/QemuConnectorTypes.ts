export type MachineStateEventData = GPIOStateEventData | IOCONStateEventData;

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