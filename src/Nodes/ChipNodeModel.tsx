import { DeserializeEvent } from '@projectstorm/react-canvas-core';
import { DiagramModel } from '@projectstorm/react-diagrams';
import PeripheralNodeModel, { Peripheral_Type } from './PeripheralNodeModel';
import ChipPortModel from '../Ports/ChipPortModel';

export default class ChipNodeModel extends PeripheralNodeModel {

    GPIO_pin_directions: boolean[] = [];
    GPIO_pin_voltages: number[] = [];
    GPIO_pin_voltages_initial: number[] = [];

    pin_directions: boolean[] = [];  // True: In, False: Out
    pin_voltages: number[] = [];
    pin_voltages_initial: number[] = [];

    lpc_4088_port: number;

    constructor(locked: boolean, x: number, y: number, part: number) {
        super({ name: "LPC4088 Port " + part, color: "rgb(255, 0, 64)", type: "chip" });
        this.lpc_4088_port = part;
        this.setPosition(x, y);
        for (let i = 0; i <= 31; i ++) { 
            this.addInPort(String(i));
        }
        this.setLocked(locked);
        PeripheralNodeModel.chips.push(this);
        this.PERIPHAREL_TYPE = Peripheral_Type.Chip;
    }

    serialize() {
        const serialized = super.serialize();
        serialized["lpc_4088_port"] = this.lpc_4088_port;
        return serialized;
    }

    deserialize(ev: DeserializeEvent<this>) {
        super.deserialize(ev);
        this.lpc_4088_port = ev.data["lpc_4088_port"];
    }

    addInPort(label: string): ChipPortModel {
        const port = new ChipPortModel(true, label, label);
        this.addPort(port);
        return port;
    }

    addOutPort(label: string): ChipPortModel {
        const port = new ChipPortModel(false, label, label);
        this.addPort(port);
        return port;
    }

    getPinDirection(port_name: string): boolean {
        return this.pin_directions[Number(port_name)];
    }

    getPinVoltageValue(port_name: string): number {
        return this.pin_voltages_initial[Number(port_name)];
    }

    setPinVoltageValue(port_name: string, value: number) {
        this.pin_voltages[Number(port_name)] = value;
    }
    
} 