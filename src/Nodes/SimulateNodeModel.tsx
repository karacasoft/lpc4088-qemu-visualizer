import { DiagramModel } from '@projectstorm/react-diagrams';
import ChipNodeModel from './ChipNodeModel';
import HandNodeModel from './HandNodeModel';
import LDRNodeModel from './LDRNodeModel';
import LEDNodeModel from './LEDNodeModel';
import PeripheralNodeModel from './PeripheralNodeModel';
import ResistanceNodeModel from './ResistanceNodeModel';   
import UltraSonicNodeModel from './UltraSonicNodeModel';
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
                        
                        this.removeUnconnectedLinks(model);
                        this.clearLEDS(model);
                        
                        // Gather all chip ports
                        let chip_pins = []
                        for (let chip of PeripheralNodeModel.chips) {
                            let ports = chip.getInPorts();
                            for (let port of ports) {
                                chip_pins.push(port);
                            }
                        }

                        // Process each chip pins
                        for (let i = 0; i < chip_pins.length; i ++) {
                            let links = chip_pins[i].getLinks();
                            for (let link of Object.values(links)) {
                                if (link.getSourcePort() !== null && link.getTargetPort() !== null) {
                                    if ((link.getSourcePort().getNode() as PeripheralNodeModel).getName().substring(0, 3) === "LPC") {
                                        this.selectCircuitType(PeripheralNodeModel.linkSourceTarget(link));
                                    }
                                    else {
                                        this.selectCircuitType(PeripheralNodeModel.linkTargetSource(link));
                                    }
                                }
                            }
                        }

                        // Call simulation
                        //this.Simulate(circuits);*/
                    }
                    else {
                        // TODO Stop simulation
                        console.log("-");
                    }
                }
            }
        );
    }

    removeUnconnectedLinks(model: DiagramModel) {

        let links = model.getLinks();
        for (let link of links) {
            let source_port = link.serialize().sourcePort;
            let target_port = link.serialize().targetPort;
            if (source_port === null || target_port === null) {
                link.remove();
            }
        }

    }

    clearLEDS(model: DiagramModel) {
        for (let node of PeripheralNodeModel.all_peripherals) {
            if (node.PERIPHAREL_TYPE === 4) {
                (node as LEDNodeModel).depaint();
            }
        }
    }

    selectCircuitType(start_link: string[]) {

        let node = PeripheralNodeModel.getPeripheral(start_link[5]);
        if (node === null) {
            return;
        }

        if (this.circuitLED(start_link, node) === true) {
            return;
        }

        if (this.circuitUltraSonic(start_link, node) === true) {
            return;
        }

        if (this.circuitLDR(start_link, node) === true) {
            return;
        }

        if (this.circuitSwitch(start_link, node) === true) {
            return;
        }

    }

    circuitLED(start_link: string[], node: PeripheralNodeModel): boolean {

        if (node.PERIPHAREL_TYPE === 3 || node.PERIPHAREL_TYPE === 4) {

            let chip = PeripheralNodeModel.getChip(start_link[1]) as ChipNodeModel;
            if (chip.getPinDirection(start_link[2]) === true) {
                return false;
            }

            // Extract LED line
            let linee = node.getOtherConnections(start_link[7]);

            if (linee.length === 0) {
                return false;
            }

            linee.push(start_link);
            let line = [];
            line.push(linee[1]);
            line.push(linee[0]);
            let total_resistance = 0.001;
            let voltage = chip.getPinVoltageValue(start_link[2])

            if (node.PERIPHAREL_TYPE === 3) {
                total_resistance = total_resistance + (node as ResistanceNodeModel).resistance;
            }

            let next_node = PeripheralNodeModel.getPeripheral(line[1][5]);
            while (next_node !== null) {

                if (next_node.PERIPHAREL_TYPE === 1) {
                    break;
                }
                if (next_node.PERIPHAREL_TYPE === 3) {
                    total_resistance = total_resistance + (next_node as ResistanceNodeModel).resistance;

                    let next_link = next_node.getOtherConnections(line[line.length - 1][7]);

                    if (next_link.length === 1) {
                        next_node = PeripheralNodeModel.getPeripheral(next_link[0][5]);
                        line.push(next_link[0]);
                    }
                    else {
                        return false;
                    }
                }
                else if (next_node.PERIPHAREL_TYPE === 4) {
                    if ((next_node as LEDNodeModel).direction === true) {
                        return false;
                    }

                    let next_link = next_node.getOtherConnections(line[line.length - 1][7]);

                    if (next_link.length === 1) {
                        next_node = PeripheralNodeModel.getPeripheral(next_link[0][5]);
                        line.push(next_link[0]);
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }

            // Process LED line
            let current = voltage / total_resistance;
            for (let i = 0; i < line.length; i ++) {
                let current_node = PeripheralNodeModel.getPeripheral(line[i][5]);
                if (current_node !== null && current_node.PERIPHAREL_TYPE === 4) {
                    (current_node as LEDNodeModel).paint(current);        
                }
            }

            return true;

        }

        return false;
    }

    circuitUltraSonic(start_link: string[], node: PeripheralNodeModel): boolean {
        
        if (node.PERIPHAREL_TYPE === 5 && start_link[6] === "Trig") {
            // let chip = PeripheralNodeModel.getChip(start_link[1]) as ChipNodeModel;
            let links = node.getOtherConnections(start_link[6]);

            if (links.length !== 3) {
                return false;
            }

            let node_voltage = PeripheralNodeModel.getPeripheral(links[0][5]);
            if (node_voltage === null || node_voltage.PERIPHAREL_TYPE !== 2) {
                return false;
            }

            let node_chip = PeripheralNodeModel.getChip(links[1][5]);
            if (node_chip === null || node_chip.PERIPHAREL_TYPE !== 0) {
                return false;
            }

            let node_ground = PeripheralNodeModel.getPeripheral(links[2][5]);
            if (node_ground === null || node_ground.PERIPHAREL_TYPE !== 1) {
                return false;
            }

            // TODO QEMU
            console.log(UltraSonicNodeModel.ObstacleDistance);
            return true;
        }

        return false;
    }

    circuitLDR(start_link: string[], node: PeripheralNodeModel): boolean {

        if (node.PERIPHAREL_TYPE === 8 && start_link[6] === "Chip") {

            let chip = PeripheralNodeModel.getChip(start_link[1]) as ChipNodeModel;
            if (chip.getPinDirection(start_link[2]) === false) {
                return false;
            }

            let links = node.getOtherConnections(start_link[7]);
            let left_resistance = 0.001;
            let right_resistance = 0.001;
            let voltage = 0;
            console.log(links);
            if (links.length !== 2) {
                return false;
            }

            // Voltage line
            let line_voltage = [];
            line_voltage.push(links[0]);
            let next_node = PeripheralNodeModel.getPeripheral(line_voltage[0][5]);

            while(next_node !== null) {
                if (next_node.PERIPHAREL_TYPE === 2) {
                    voltage = (next_node as VoltageNodeModel).voltage;
                    break;
                }
                if (next_node.PERIPHAREL_TYPE === 3) {
                    left_resistance = left_resistance + (next_node as ResistanceNodeModel).resistance;
                    let next_link = next_node.getOtherConnections(line_voltage[line_voltage.length - 1][7]);
                    if (next_link.length === 1) {
                        next_node = PeripheralNodeModel.getPeripheral(next_link[0][5]);
                        line_voltage.push(next_link[0]);
                    }
                    else {
                        return false;
                    }
                }
                else if (next_node.PERIPHAREL_TYPE === 7) {
                    left_resistance = left_resistance + LDRNodeModel.calculateResistance((next_node as LDRNodeModel).direction);
                    let next_link = next_node.getOtherConnections(line_voltage[line_voltage.length - 1][7]);
                    if (next_link.length === 1) {
                        next_node = PeripheralNodeModel.getPeripheral(next_link[0][5]);
                        line_voltage.push(next_link[0]);
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }

            // Ground line
            let line_ground = [];
            line_ground.push(links[1]);
            next_node = PeripheralNodeModel.getPeripheral(line_ground[0][5]);

            while(next_node !== null) {
                if (next_node.PERIPHAREL_TYPE === 1) {
                    break;
                }
                if (next_node.PERIPHAREL_TYPE === 3) {
                    right_resistance = right_resistance + (next_node as ResistanceNodeModel).resistance;
                    let next_link = next_node.getOtherConnections(line_ground[line_ground.length - 1][7]);
                    if (next_link.length === 1) {
                        next_node = PeripheralNodeModel.getPeripheral(next_link[0][5]);
                        line_ground.push(next_link[0]);
                    }
                    else {
                        return false;
                    }
                }
                else if (next_node.PERIPHAREL_TYPE === 7) {
                    right_resistance = right_resistance + LDRNodeModel.calculateResistance((next_node as LDRNodeModel).direction);
                    let next_link = next_node.getOtherConnections(line_ground[line_ground.length - 1][7]);
                    if (next_link.length === 1) {
                        next_node = PeripheralNodeModel.getPeripheral(next_link[0][5]);
                        line_ground.push(next_link[0]);
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }

            let total_resistance = left_resistance + right_resistance;
            let pot_voltage = voltage / total_resistance * right_resistance;

            chip.setPinVoltageValue(start_link[2], pot_voltage);

            return true;
            
        }

        return false;

    }

    circuitSwitch(start_link: string[], node: PeripheralNodeModel): boolean {

        if (node.PERIPHAREL_TYPE === 6 && start_link[6] === "Chip") {

            let chip = PeripheralNodeModel.getChip(start_link[1]) as ChipNodeModel;
            if (chip.getPinDirection(start_link[2]) === false) {
                return false;
            }

            let links = node.getOtherConnections(start_link[6]);
            let value = 0;

            if (links.length !== 3) {
                return false;
            }
            
            let node_voltage = PeripheralNodeModel.getPeripheral(links[0][5]);
            if (node_voltage === null || node_voltage.PERIPHAREL_TYPE !== 2) {
                return false;
            }
            
            let node_hand = PeripheralNodeModel.getPeripheral(links[1][5]);
            if (node_hand === null || node_hand.PERIPHAREL_TYPE !== 9) {
                return false;
            }
            else {
                value = (node_hand as HandNodeModel).value;
            }
            
            let node_ground = PeripheralNodeModel.getPeripheral(links[2][5]);
            if (node_ground === null || node_ground.PERIPHAREL_TYPE !== 1) {
                return false;
            }
            
            // Update value
            if (value === 1) {
                value = (node_voltage as VoltageNodeModel).voltage;
            }
            (PeripheralNodeModel.getChip(start_link[1]) as ChipNodeModel).setPinVoltageValue(start_link[2], value);
            return true;
        }

        return false;
    }

} 