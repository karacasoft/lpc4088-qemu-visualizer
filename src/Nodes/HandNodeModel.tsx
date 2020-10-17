import { DiagramModel } from '@projectstorm/react-diagrams';
import PeripheralNodeModel from './PeripheralNodeModel';
import HandPortModel from '../Ports/HandPortModel';

export default class HandNodeModel extends PeripheralNodeModel {

    value: number;

    constructor(value: number, locked: boolean, x: number, y: number, model: DiagramModel) {
        if (value === 0) {
            super({ name: "Select", color: "rgb(192, 128, 64)" });
        }
        else {
            super({ name: "Select", color: "rgb(128, 192, 64)" });
        }
        this.addOutPort(String(value));
        this.setPosition(x, y);
        if (locked === true) {
            this.setLocked();
            this.registerListener(
                {
                    selectionChanged: () => {
                        if (this.isSelected()) {
                            let node = new HandNodeModel(value, false, x, y + 400, model);
                            model.addNode(node);
                            PeripheralNodeModel.all_peripherals.push(node);
                        }
                    }
                }
            );
        }
        this.PERIPHAREL_TYPE = 9;
        this.value = value;
    }

    addInPort(label: string): HandPortModel {
        const port = new HandPortModel(true, label, label);
        this.addPort(port);
        return port;
    }

    addOutPort(label: string): HandPortModel {
        const port = new HandPortModel(false, label, label);
        this.addPort(port);
        return port;
    }
    
} 