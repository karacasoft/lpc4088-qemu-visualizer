import { DiagramModel } from '@projectstorm/react-diagrams';
import PeripheralNodeModel, { Peripheral_Type } from './PeripheralNodeModel';
import ChipPortModel from '../Ports/ChipPortModel';

export default class ChipNodeModel extends PeripheralNodeModel {

    pin_directions: boolean[] = [];  // True: In, False: Out
    pin_voltages: number[] = [];
    pin_voltages_initial: number[] = [];

    constructor(locked: boolean, x: number, y: number, model: DiagramModel, part: number) {
        super({ name: "LPC4088 Port " + part, color: "rgb(255, 0, 64)" });
        this.setPosition(x, y);
        if (locked === true) {
            this.setLocked();
            this.registerListener(
                {
                    selectionChanged: () => {
                        if (this.isSelected()) {
                            let node = new ChipNodeModel(false, x, y + 200, model, part);
                            // TODO Update
                            for (let i = 0; i <= 31; i ++) { 
                                node.addInPort(String(i));
                            }
                            for (let i = 0; i <= 15; i ++) { 
                                node.pin_directions.push(true);
                                node.pin_directions.push(false);
                            }
                            for (let i = 0; i <= 15; i ++) {
                                node.pin_voltages.push(0);
                                node.pin_voltages_initial.push(0);
                            }
                            for (let i = 16; i <= 31; i ++) {
                                node.pin_voltages.push(5);
                                node.pin_voltages_initial.push(5);
                            }
                            model.addNode(node);
                            PeripheralNodeModel.chips.push(node);
                        }
                    }
                }
            );
        }
        this.PERIPHAREL_TYPE = Peripheral_Type.Chip;
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