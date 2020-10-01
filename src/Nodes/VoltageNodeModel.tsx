import { DiagramModel } from '@projectstorm/react-diagrams';
import PeripheralNodeModel from './PeripheralNodeModel';
import VoltagePortModel from '../Ports/VoltagePortModel';

export default class VoltageNodeModel extends PeripheralNodeModel {

    voltage = 0;

    constructor(locked: boolean, x: number, y: number, model: DiagramModel, voltage: number) {
        super({ name: "Voltage", color: "rgb(192, 0, 0)" });
        this.addInPort("<= " + voltage + " V");
        this.addOutPort(voltage + " V =>");
        this.setPosition(x, y);
        if (locked === true) {
            this.setLocked();
            this.registerListener(
                {
                    selectionChanged: () => {
                        if (this.isSelected()) {
                            let node = new VoltageNodeModel(false, x, y + 400, model, voltage);
                            model.addNode(node);
                            PeripheralNodeModel.all_peripherals.push(node);
                        }
                    }
                }
            );
        }
        this.PERIPHAREL_TYPE = 2;
        this.voltage = voltage;
    }

    addInPort(label: string): VoltagePortModel {
        const port = new VoltagePortModel(true, label, label);
        this.addPort(port);
        return port;
    }

    addOutPort(label: string): VoltagePortModel {
        const port = new VoltagePortModel(false, label, label);
        this.addPort(port);
        return port;
    }

    getOtherConnections(port_name: string): string[][] {
        let connections: string[][] = [];
        return connections;
    }

} 