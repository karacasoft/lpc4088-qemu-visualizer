import { DiagramModel } from '@projectstorm/react-diagrams';
import PeripheralNodeModel from './PeripheralNodeModel';
import ResistancePortModel from '../Ports/ResistancePortModel';

export default class ResistanceNodeModel extends PeripheralNodeModel {

    resistance = 0;

    constructor(locked: boolean, x: number, y: number, model: DiagramModel, resistance: number) {
        super({ name: resistance + " Ω", color: "rgb(64, 64, 64)" });
        this.addInPort("<=");
        this.addOutPort("=>");
        this.setPosition(x, y);
        if (locked === true) {
            this.setLocked();
            this.registerListener(
                {
                    selectionChanged: () => {
                        if (this.isSelected()) {
                            let node = new ResistanceNodeModel(false, x, y + 400, model, resistance)
                            model.addNode(node);
                            PeripheralNodeModel.all_peripherals.push(node);
                        }
                    }
                }
            );
        }
        this.PERIPHAREL_TYPE = 3;
        this.resistance = resistance;
    }

    addInPort(label: string): ResistancePortModel {
        const port = new ResistancePortModel(true, label, label);
        this.addPort(port);
        return port;
    }

    addOutPort(label: string): ResistancePortModel {
        const port = new ResistancePortModel(false, label, label);
        this.addPort(port);
        return port;
    }

    getOtherConnections(port_ID: string): string[][] {
        let connections: string[][] = [];

        let links_left = this.getInPorts()[0].getLinks();
        for (let link of Object.values(links_left)) {
            if (link.getSourcePort() !== null && link.getTargetPort() !== null && link.getSourcePort().getID() !== port_ID && link.getTargetPort().getID() !== port_ID) {
                if (link.getSourcePort().getNode().getID() === this.getID()) {
                    connections.push(PeripheralNodeModel.linkSourceTarget(link));
                }
                else {
                    connections.push(PeripheralNodeModel.linkTargetSource(link));
                }
            }
        }

        let links_right = this.getOutPorts()[0].getLinks();
        for (let link of Object.values(links_right)) {
            if (link.getSourcePort() !== null && link.getTargetPort() !== null && link.getSourcePort().getID() !== port_ID && link.getTargetPort().getID() !== port_ID) {
                if (link.getSourcePort().getNode().getID() === this.getID()) {
                    connections.push(PeripheralNodeModel.linkSourceTarget(link));
                }
                else {
                    connections.push(PeripheralNodeModel.linkTargetSource(link));
                }
            }
        }
        
        return connections;
    }
    
} 