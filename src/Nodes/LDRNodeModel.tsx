import { DiagramModel } from '@projectstorm/react-diagrams';
import PeripheralNodeModel from './PeripheralNodeModel';
import LDRPortModel from '../Ports/LDRPortModel';

export default class LDRNodeModel extends PeripheralNodeModel {

    direction: number;
    static MAX_CURRENT = 0.005;
    static Light = 1;

    constructor(direction: number, locked: boolean, x: number, y: number, model: DiagramModel) {
        super({ name: "LDR", color: "rgb(255, 128, 0)" });
        if (direction === 0) {
            this.addInPort("+");
            this.addOutPort("-");
        }
        else {
            this.addInPort("-");
            this.addOutPort("+");
        }
        this.setPosition(x, y);
        if (locked === true) {
            this.setLocked();
            this.registerListener(
                {
                    selectionChanged: () => {
                        if (this.isSelected()) {
                            let node = new LDRNodeModel(direction, false, x, y + 400, model);
                            model.addNode(node);
                            PeripheralNodeModel.all_peripherals.push(node);
                        }
                    }
                }
            );
        }
        this.PERIPHAREL_TYPE = 7;
        this.direction = direction;
    }

    addInPort(label: string): LDRPortModel {
        const port = new LDRPortModel(true, label, label);
        this.addPort(port);
        return port;
    }

    addOutPort(label: string): LDRPortModel {
        const port = new LDRPortModel(false, label, label);
        this.addPort(port);
        return port;
    }

    getOtherConnections(port_id: string): string[][] {
        let connections: string[][] = [];

        let links_voltage = this.getInPorts()[0].getLinks();
        PeripheralNodeModel.linkConnect(links_voltage, this.getID(), port_id, connections);

        let links_ground = this.getOutPorts()[0].getLinks();
        PeripheralNodeModel.linkConnect(links_ground, this.getID(), port_id, connections);

        return connections;
    }

    static calculateResistance(direction: number): number {
        if (direction === 0) {
            return 20000000 / LDRNodeModel.Light * (-199 * LDRNodeModel.Light / 19999800 + 19999999 / 19999800);
        }
        else {
            return 20000000 / (100000 - LDRNodeModel.Light + 1) * (-199 * (100000 - LDRNodeModel.Light + 1) / 19999800 + 19999999 / 19999800);
        }
    }

} 