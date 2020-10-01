import { DiagramModel } from '@projectstorm/react-diagrams';
import PeripheralNodeModel from './PeripheralNodeModel';
import ResistancePortModel from '../Ports/ResistancePortModel';

export default class ResistanceNodeModel extends PeripheralNodeModel {

    value = 0;

    constructor(locked: boolean, x: number, y: number, model: DiagramModel, value: number) {
        super({ name: value + " Ω", color: "rgb(64, 64, 64)" });
        this.addInPort("<=");
        this.addOutPort("=>");
        this.setPosition(x, y);
        if (locked === true) {
            this.setLocked();
            this.registerListener(
                {
                    selectionChanged: () => {
                        if (this.isSelected()) {
                            let node = new ResistanceNodeModel(false, x, y + 400, model, value)
                            model.addNode(node);
                            PeripheralNodeModel.all_peripherals.push(node);
                        }
                    }
                }
            );
        }
        this.PERIPHAREL_TYPE = 3;
        this.value = value;
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

    getOtherConnections(port_name: string): string[][] {
        let connections: string[][] = [];

        if (Object.values(this.getInPorts()[0].getLinks()).length > 0){
            if (port_name !== this.getInPorts()[0].getName()) {
                let source_port = Object.values(this.getInPorts()[0].getLinks())[0].serialize().sourcePort;
                if (source_port !== null) {
                    let connect: string[] = [];
                    connect.push((Object.values(this.getInPorts()[0].getLinks())[0].getSourcePort().getParent() as PeripheralNodeModel).getName());
                    connect.push(Object.values(this.getInPorts()[0].getLinks())[0].serialize().source);
                    connect.push(Object.values(this.getInPorts()[0].getLinks())[0].getSourcePort().serialize().name);
                    connect.push(Object.values(this.getInPorts()[0].getLinks())[0].serialize().sourcePort);
                    connect.push(this.getName());
                    connect.push(this.getID());
                    connect.push(this.getInPorts()[0].getName());
                    connect.push(this.getInPorts()[0].getID());
                    connections.push(connect);
                }
            }
        }

        if (Object.values(this.getOutPorts()[0].getLinks()).length > 0){
            if (port_name !== this.getOutPorts()[0].getName()) {
                let target_port = Object.values(this.getOutPorts()[0].getLinks())[0].serialize().targetPort;
                if (target_port !== null) {
                    let connect: string[] = [];
                    connect.push(this.getName());
                    connect.push(this.getID());
                    connect.push(this.getOutPorts()[0].getName());
                    connect.push(this.getOutPorts()[0].getID());
                    connect.push((Object.values(this.getOutPorts()[0].getLinks())[0].getTargetPort().getParent() as PeripheralNodeModel).getName());
                    connect.push(Object.values(this.getOutPorts()[0].getLinks())[0].serialize().target);
                    connect.push(Object.values(this.getOutPorts()[0].getLinks())[0].getTargetPort().serialize().name);
                    connect.push(Object.values(this.getOutPorts()[0].getLinks())[0].serialize().targetPort);
                    connections.push(connect);
                }
            }
        }

        return connections;
    }
    
} 