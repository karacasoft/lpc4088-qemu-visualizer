export enum CircuitPortType {
    INPUT,
    OUTPUT
}

export enum CircuitPortLogicValue {
    LOW,
    HIGH,
    Z
}

export interface CircuitPortState {
    voltage?: number;
    current: boolean;
}

export default class CircuitPort {
    protected type: CircuitPortType
    protected connected_ports: CircuitPort[];
    protected state: CircuitPortState;

    constructor(type: CircuitPortType) {
        this.type = type;
        this.connected_ports = [];

        // initial state
        this.state = {
            current: false,
        };
    }

    updateState(state: CircuitPortState) {
        this.state = state;
        if(this.type === CircuitPortType.OUTPUT) {
            this.connected_ports.forEach(p => {
                p.updateState(state); 
            });
        }
    }

    addConnection(port: CircuitPort) {
        this.connected_ports.push(port);
    }
}