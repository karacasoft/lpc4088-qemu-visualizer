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
                            for (let i = 0; i <= 31; i ++) {
                                node.addInPort("P" + part + "." + i);
                                node.pin_values.push(0);
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


    /*constructor(x: number, y: number, model: DiagramModel, part: number) {
        switch (part) {
            case 0:
                super({ name: "LPC4088 Pins 0", color: "rgb(255, 0, 64)" });
                this.addInPort("P0.0");
                this.addInPort("P0.1");
                this.addInPort("P0.2");
                this.addInPort("P0.3");
                this.addInPort("P0.4");
                this.addInPort("P0.5");
                this.addInPort("P0.6");
                this.addInPort("P0.7");
                this.addInPort("P0.8");
                this.addInPort("P0.9");
                this.addInPort("P0.21");
                this.addInPort("P0.23");
                this.addInPort("P0.24");
                this.addInPort("P0.25");
                this.addInPort("P0.26");
                break;
            case 1:
                super({ name: "LPC4088 Pins 1", color: "rgb(255, 0, 64)" });
                this.addInPort("P1.2");
                this.addInPort("P1.3");
                this.addInPort("P1.5");
                this.addInPort("P1.6");
                this.addInPort("P1.7");
                this.addInPort("P1.11");
                this.addInPort("P1.12");
                this.addInPort("P1.20");
                this.addInPort("P1.23");
                this.addInPort("P1.24");
                this.addInPort("P1.30");
                this.addInPort("P1.31");
                break;
            case 2:
                super({ name: "LPC4088 Pins 2", color: "rgb(255, 0, 64)" });
                this.addInPort("P2.10");
                break;
            default:
                super({ name: "LPC4088 Pins 5", color: "rgb(255, 0, 64)" });
                this.addInPort("P5.0");
                this.addInPort("P5.1");
                this.addInPort("P5.2");
                this.addInPort("P5.3");
                this.addInPort("P5.4");
                break;
        }
        this.setPosition(x, y);
        this.setLocked();
    }*/

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
    
} 