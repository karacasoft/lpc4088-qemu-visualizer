import { DiagramModel } from '@projectstorm/react-diagrams';
import PeripheralNodeModel from './PeripheralNodeModel';
import UltraSonicPortModel from '../Ports/UltraSonicPortModel';

export default class UltraSonicNodeModel extends PeripheralNodeModel {

    static ObstacleDistance: number = 1;

    constructor(locked: boolean, x: number, y: number, model: DiagramModel) {
        super({ name: "UltraSonic", color: "rgb(64, 128, 255)" });
        this.addOutPort("Vcc");
        this.addOutPort("Trig");
        this.addOutPort("Echo");
        this.addOutPort("GND");
        this.setPosition(x, y);
        if (locked === true) {
            this.setLocked();
            this.registerListener(
                {
                    selectionChanged: () => {
                        if (this.isSelected()) {
                            let node = new UltraSonicNodeModel(false, x, y + 400, model);
                            model.addNode(node);
                            PeripheralNodeModel.all_peripherals.push(node);
                        }
                    }
                }
            );
        }
        this.PERIPHAREL_TYPE = 5;
    }

    addInPort(label: string): UltraSonicPortModel {
        const port = new UltraSonicPortModel(true, label, label);
        this.addPort(port);
        return port;
    }

    addOutPort(label: string): UltraSonicPortModel {
        const port = new UltraSonicPortModel(false, label, label);
        this.addPort(port);
        return port;
    }

    getOtherConnections(port_id: string): string[][] {
        let connections: string[][] = [];

        let links_Vcc = this.getOutPorts()[0].getLinks();
        PeripheralNodeModel.linkConnect(links_Vcc, this.getID(), port_id, connections);

        /*let links_Trig = this.getOutPorts()[1].getLinks();
        PeripheralNodeModel.linkConnect(links_Trig, this.getID(), port_id, connections);*/

        let links_Echo = this.getOutPorts()[2].getLinks();
        PeripheralNodeModel.linkConnect(links_Echo, this.getID(), port_id, connections);

        let links_GND = this.getOutPorts()[3].getLinks();
        PeripheralNodeModel.linkConnect(links_GND, this.getID(), port_id, connections);

        return connections;
    }
 
} 