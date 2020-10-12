import { DiagramModel } from '@projectstorm/react-diagrams';
import PeripheralNodeModel from './PeripheralNodeModel';
import ChipPortModel from '../Ports/ChipPortModel';

export default class ChipNodeModel extends PeripheralNodeModel {

    pin_values: number[] = [];


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
                            for (let i = 0; i <= 15; i ++) {
                                node.addInPort(String(i));
                                node.pin_values.push(0);
                            }
                            for (let i = 16; i <= 31; i ++) {
                                node.addInPort(String(i));
                                node.pin_values.push(5);
                            }
                            model.addNode(node);
                            PeripheralNodeModel.chips.push(node);
                        }
                    }
                }
            );
        }
        this.PERIPHAREL_TYPE = 0;
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

    getLogicValue(port_name: string): number {
        return this.pin_values[Number(port_name)];
    }

    setLogicValue(port_name: string, value: number) {
        this.pin_values[Number(port_name)] = value;
    }
    
} 