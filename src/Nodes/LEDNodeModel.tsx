import { DiagramModel } from '@projectstorm/react-diagrams';
import PeripheralNodeModel from './PeripheralNodeModel';
import LEDPortModel from '../Ports/LEDPortModel';

export default class LEDNodeModel extends PeripheralNodeModel {

    colour: string;
    direction: number;
    static MAX_CURRENT = 0.005;

    constructor(direction: number, locked: boolean, x: number, y: number, model: DiagramModel, colour: string) {
        if (locked === true) {
            if (colour === "R") {
                super({ name: "LED", color: "rgb(192, 0, 0)" });
            }
            else if (colour === "G") {
                super({ name: "LED", color: "rgb(0, 192, 0)" });
            }
            else  {
                super({ name: "LED", color: "rgb(0, 0, 192)" });
            }
        }
        else  {
            super({ name: "LED", color: "rgb(192, 192, 192)" });
        }
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
                            let node = new LEDNodeModel(direction, false, x, y + 400, model, colour);
                            model.addNode(node);
                            PeripheralNodeModel.all_peripherals.push(node);
                        }
                    }
                }
            );
        }
        this.PERIPHAREL_TYPE = 4;
        this.colour = colour;
        this.direction = direction;
    }

    addInPort(label: string): LEDPortModel {
        const port = new LEDPortModel(true, label, label);
        this.addPort(port);
        return port;
    }

    addOutPort(label: string): LEDPortModel {
        const port = new LEDPortModel(false, label, label);
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

    paint(current: number) {
        let value = (current / 0.005) * 255;
        if (value > 255) {
            value = 255;
        }

        if (this.colour === "R") {
            this.options.color = "rgb(" + value + ", 0, 0)";
        }
        else if (this.colour === "G") {
            this.options.color = "rgb(0, " + value + ", 0)";
        }
        else {
            this.options.color = "rgb(0, 0, " + value + ")";
        }
    }

    depaint() {
        this.options.color = "rgb(192, 192, 192)";
    }
} 