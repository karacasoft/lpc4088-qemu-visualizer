import { DiagramModel } from '@projectstorm/react-diagrams';
import ChipNodeModel from './ChipNodeModel';
import GroundNodeModel from './GroundNodeModel';
import LEDNodeModel from './LEDNodeModel';
import PeripheralNodeModel from './PeripheralNodeModel';
import ResistanceNodeModel from './ResistanceNodeModel';
import VoltageNodeModel from './VoltageNodeModel';

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
                                circuits.push(current_circuit);
                                /*console.log("Final length: " + current_circuit.length);
                                console.log(current_circuit);
                                console.log(PeripheralNodeModel.all_peripherals);*/
                            }
                        }

                        // Call simulation
                        this.Simulate(circuits);
                    }
                    else {
                        // TODO Stop simulation
                        console.log("-");
                    }
                }
            }
        );
    }

    generateCircuit(circuit: string[][], node_id: string, port_name: string) {
        for (let peripheral of PeripheralNodeModel.all_peripherals) {
            /*console.log(peripheral.getID() === node_id);
            console.log(node_id);
            console.log(peripheral.getID());*/
            if (peripheral.getID() === node_id) {
                //console.log(peripheral.getOtherConnections(port_name));
                let connections = peripheral.getOtherConnections(port_name);
                for (let connect of connections) {
                    circuit.push(connect);
                    /*console.log(node_id === connect[1]);
                    console.log(node_id === connect[5]);
                    console.log(node_id);
                    console.log(connect[1]);
                    console.log(connect[5]);*/
                    if (node_id === connect[5]) {
                        this.generateCircuit(circuit, connect[1], connect[2]);
                    }
                    else if (node_id === connect[1]) {
                        this.generateCircuit(circuit, connect[5], connect[6]);
                    }
                    else if (connect[1] === connect[5]) {
                        console.log("ERROR in connections: " + connect[1] + " " + connect[5]);
                    }
                    else {
                        console.log("ERROR: in connections" + node_id + " " + connect[1] + " " + connect[5]);
                    }
                }
            }
        }
    }

    Simulate(circuits: string[][][]) {
        console.log("Simulate");
        for (let circuit of circuits) {

            // Check for series circuit
            let circuit1 = circuit.length - 1;
            let circuit0 = circuit.length;
            let single = true;
            for (let i = 0; i < circuit1; i ++) {
                for (let j = i + 1; j < circuit0; j ++) {
                    if (circuit[i][1] === circuit[j][1] || circuit[i][5] === circuit[j][5]) {
                        single = false;
                        break;
                    }
                }
                if (single === false) {
                    break;
                }
            }

            // A series circuit has confirmed
            if (single === true) {

                // Check for LED circuit
                let chip_node = PeripheralNodeModel.getChip(circuit[0][5]);
                if (chip_node instanceof ChipNodeModel) {
                    let pin_value = chip_node.pin_values[0];
                    // From voltage source to pin
                    if (pin_value === 0) {
                        let voltage_node = PeripheralNodeModel.getPeripheral(circuit[circuit.length - 1][1]);
                        console.log(voltage_node);
                        if (voltage_node instanceof VoltageNodeModel) {
                            let voltage = voltage_node.voltage;
                            let total_resistance = 0.00001;
                            let isValid = true;
                            if (circuit.length > 1) {
                                for (let i = 1; i < circuit.length; i ++) {
                                    let node = PeripheralNodeModel.getPeripheral(circuit[i][5]);
                                    if (node instanceof LEDNodeModel) {
                                        if (node.direction === 1) {
                                            isValid = false;
                                            break;
                                        }
                                    }
                                    else if (node instanceof ResistanceNodeModel) {
                                        total_resistance = total_resistance + node.resistance;
                                    }
                                    else {
                                        isValid = false;
                                        break;
                                    }
                                }
                            }
                            else {
                                isValid = false;
                            }

                            // Update LEDs if circuit is valid
                            if (isValid === true) {
                                let current = voltage / total_resistance;
                                console.log("Current: " + current);
                                let colour = 255 * current / LEDNodeModel.MAX_CURRENT;
                                console.log("Colour: " + colour);
                                for (let i = 1; i < circuit.length; i ++) {
                                    let node = PeripheralNodeModel.getPeripheral(circuit[i][5]);
                                    if (node instanceof LEDNodeModel) {
                                        if (node.colour === "R") {
                                            if (colour > 255) {
                                                node.getOptions().color = "rgb(255, 255, 255)";
                                            }
                                            else {
                                                node.getOptions().color = "rgb(" + colour + ", 0, 0)";
                                            }
                                        }
                                        else if (node.colour === "G") {
                                            if (colour > 255) {
                                                node.getOptions().color = "rgb(255, 255, 255)";
                                            }
                                            else {
                                                node.getOptions().color = "rgb(0, " + colour + ", 0)";
                                            }
                                        }
                                        else if (node.colour === "B") {
                                            if (colour > 255) {
                                                node.getOptions().color = "rgb(255, 255, 255)";
                                            }
                                            else {
                                                node.getOptions().color = "rgb(0, 0, " + colour + ")";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // From pin to ground
                    else {
                        let ground_node = PeripheralNodeModel.getPeripheral(circuit[circuit.length - 1][1]);
                        if (ground_node instanceof GroundNodeModel) {
                            let voltage = pin_value;
                            let total_resistance = 0.00001;
                            let isValid = true;
                            if (circuit.length > 1) {
                                for (let i = 1; i < circuit.length; i ++) {
                                    let node = PeripheralNodeModel.getPeripheral(circuit[i][5]);
                                    if (node instanceof LEDNodeModel) {
                                        if (node.direction === 0) {
                                            isValid = false;
                                            break;
                                        }
                                    }
                                    else if (node instanceof ResistanceNodeModel) {
                                        total_resistance = total_resistance + node.resistance;
                                    }
                                    else {
                                        isValid = false;
                                        break;
                                    }
                                }
                            }
                            else {
                                isValid = false;
                            }

                            // Update LEDs if circuit is valid
                            if (isValid === true) {
                                let current = voltage / total_resistance;
                                console.log("Current: " + current);
                                let colour = 255 * current / LEDNodeModel.MAX_CURRENT;
                                console.log("Colour: " + colour);
                                for (let i = 1; i < circuit.length; i ++) {
                                    let node = PeripheralNodeModel.getPeripheral(circuit[i][5]);
                                    if (node instanceof LEDNodeModel) {
                                        if (node.colour === "R") {
                                            if (colour > 255) {
                                                node.getOptions().color = "rgb(255, 255, 255)";
                                            }
                                            else {
                                                node.getOptions().color = "rgb(" + colour + ", 0, 0)";
                                            }
                                        }
                                        else if (node.colour === "G") {
                                            if (colour > 255) {
                                                node.getOptions().color = "rgb(255, 255, 255)";
                                            }
                                            else {
                                                node.getOptions().color = "rgb(0, " + colour + ", 0)";
                                            }
                                        }
                                        else if (node.colour === "B") {
                                            if (colour > 255) {
                                                node.getOptions().color = "rgb(255, 255, 255)";
                                            }
                                            else {
                                                node.getOptions().color = "rgb(0, 0, " + colour + ")";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // A parallel circuit has confirmed
            else {

            }

        }
    }

    configurationLED(circuit: string[][][]) {

    }
    
} 