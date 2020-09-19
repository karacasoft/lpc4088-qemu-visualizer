import createEngine, {
    DefaultNodeModel
} from '@projectstorm/react-diagrams';

class Item {

    name: string;
    isLocked: boolean;
    place: number[];
    colour: number[];
    ports: number[];
    pins: string[];
    model: DefaultNodeModel;
    ID: string;

    constructor(name: string, isLocked: boolean, place: number[], colour: number[], ports: number[], pins: string[]) {
        // Set information
        this.name = name;
        this.isLocked = isLocked;
        this.place = place;
        this.colour = colour;
        this.ports = ports;
        this.pins = pins;
        // Construct item box
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
/*
    draw(): void {

    }
*/
}

export default Item;