import { LinkModel, PortModel, DefaultLinkModel, PortModelAlignment, DefaultNodeModel, PortModelListener, NodeModelListener, DefaultPortModel, DefaultPortModelOptions } from '@projectstorm/react-diagrams';

class GNDPortModel extends DefaultPortModel {
    // TODO: add options parameter constructor, too, if possible
    constructor(isIn: boolean, name?: string, label?: string) {
        super(isIn, name, label);
    }

    canLinkToPort(port: PortModel): boolean {
        return true;
    }
}

export default class GNDNodeModel extends DefaultNodeModel {

    constructor() {
        super({ name: "GND", color: "rgb(128, 128, 128)" });
        const in_port = this.addInPort("<=");
        const out_port = this.addOutPort("=>");
    }

    addInPort(label: string): GNDPortModel {
        const p = new GNDPortModel(true, label, label);
        this.addPort(p);
        return p;
    }

    addOutPort(label: string): GNDPortModel {
        const p = new GNDPortModel(false, label, label);
        this.addPort(p);
        return p;
    }
    

} 