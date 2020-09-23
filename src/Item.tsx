import createEngine, {
    DefaultNodeModel, NodeModel
} from '@projectstorm/react-diagrams';

import { DiamondNodeModel } from './DiamondNodeModel';
import { DiamondNodeFactory } from './DiamondNodeFactory';
import { SimplePortFactory } from './SimplePortFactory';
import { DiamondPortModel } from './DiamondPortModel';

class Item {

    name: string;
    isLocked: boolean;
    place: number[];
    colour: number[];
    ports: number[];
    pins: string[];
    type: number;
    model: NodeModel; 
    ID: string;

    constructor(name: string, isLocked: boolean, place: number[], colour: number[], ports: number[], pins: string[], type: number) {
        // Set information
        this.name = name;
        this.isLocked = isLocked;
        this.place = place;
        this.colour = colour;
        this.ports = ports;
        this.pins = pins;
        this.type = type;
        // Construct item box
        if (type == 0) {
            let peripheral = new DefaultNodeModel(this.name, "rgb(" + this.colour[0] + ", " + this.colour[1] + ", " + this.colour[2] + ")");
            peripheral.setPosition(place[0], place[1]);
            if (isLocked) {
                peripheral.setLocked();
            }
            for (let i = 0; i < ports.length; i ++) {
                ports[i] < 1 ? peripheral.addInPort(pins[i]) : peripheral.addOutPort(pins[i]);
            }
            this.model = peripheral;
            this.ID = this.model.getID();
            this.model.updateDimensions({height: 100, width: 100})
        }
        else {
            let peripheral = new DiamondNodeModel();
            peripheral.setPosition(place[0], place[1]);
            if (isLocked) {
                peripheral.setLocked();
            }
            this.model = peripheral;
            this.ID = this.model.getID();
        }
    }
/*
    draw(): void {

    }
*/
}

export default Item;