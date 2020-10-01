import { DiagramModel } from '@projectstorm/react-diagrams';
import ChipNodeModel from './ChipNodeModel';
import LEDNodeModel from './LEDNodeModel';
import PeripheralNodeModel from './PeripheralNodeModel';

export default class SimulateNodeModel extends PeripheralNodeModel {

    constructor(x: number, y: number, model: DiagramModel) {
        super({ name: "Simulate", color: "rgb(96, 96, 96)" });
        this.setPosition(x, y);
        this.setLocked();
        this.registerListener(
            {
                selectionChanged: () => {
                    if (this.isSelected()) {
                        // TODO Start simulation
                        console.log("+");
                        
                        // Remove unconnected links
                        let links = model.getLinks();
                        for (let link of links) {
                            let source_port = link.serialize().sourcePort;
                            let target_port = link.serialize().targetPort;
                            if (source_port === null || target_port === null) {
                                link.remove();
                            }
                        }
                        links = model.getLinks();
                        
                        // Gather all chip ports
                        let chip_pins = []
                        for (let chip of PeripheralNodeModel.chips) {
                            let ports = chip.getInPorts();
                            for (let port of ports) {
                                chip_pins.push(port);
                            }
                        }
                        
                        // Save each connected circuits
                        let circuits: string[][][] = [];
                        for (let i = 0; i < chip_pins.length; i ++) {
                            if (chip_pins[i].serialize().links.length > 0) {
                                let current_circuit: string[][] = [];
                                let connect: string[] = [];
                                connect.push((Object.values(chip_pins[i].getLinks())[0].getSourcePort().getParent() as PeripheralNodeModel).getName());
                                connect.push(Object.values(chip_pins[i].getLinks())[0].getSourcePort().getParent().serialize().id);
                                connect.push(Object.values(chip_pins[i].getLinks())[0].getSourcePort().serialize().name);
                                connect.push(Object.values(chip_pins[i].getLinks())[0].getSourcePort().serialize().id);
                                connect.push((chip_pins[i].getParent() as PeripheralNodeModel).getName());
                                connect.push(chip_pins[i].getParent().serialize().id);
                                connect.push(chip_pins[i].serialize().name);
                                connect.push(chip_pins[i].serialize().id);
                                current_circuit.push(connect);
                                this.generateCircuit(current_circuit, connect[1], connect[2]);
                                console.log("Final length: " + current_circuit.length);
                                console.log(current_circuit);
                                console.log(PeripheralNodeModel.all_peripherals);
                            }
                        }

                    }
                    else {
                        // TODO Stop simulation
                        console.log("-");
                    }
                }
            }
        );
    }

    generateCircuit(circuits: string[][], node_id: string, port_name: string) {
        for (let peripheral of PeripheralNodeModel.all_peripherals) {
            /*console.log(peripheral.getID() === node_id);
            console.log(node_id);
            console.log(peripheral.getID());*/
            if (peripheral.getID() === node_id) {
                //console.log(peripheral.getOtherConnections(port_name));
                let connections = peripheral.getOtherConnections(port_name);
                for (let connect of connections) {
                    circuits.push(connect);
                    /*console.log(node_id === connect[1]);
                    console.log(node_id === connect[5]);
                    console.log(node_id);
                    console.log(connect[1]);
                    console.log(connect[5]);*/
                    if (node_id === connect[5]) {
                        this.generateCircuit(circuits, connect[1], connect[2]);
                    }
                    else if (node_id === connect[1]) {
                        this.generateCircuit(circuits, connect[5], connect[6]);
                    }
                    else if (connect[1] === connect[5]) {
                        console.log("ERROR: " + connect[1] + " " + connect[5]);
                    }
                    else {
                        console.log("ERROR: " + node_id + " " + connect[1] + " " + connect[5]);
                    }
                }
            }
        }
    }
    
} 