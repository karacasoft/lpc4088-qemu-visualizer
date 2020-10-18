import { DiagramModel } from '@projectstorm/react-diagrams';
import { getModel } from './Diagram';
import ChipNodeModel from './Nodes/ChipNodeModel';
import HandNodeModel from './Nodes/HandNodeModel';
import LDRNodeModel from './Nodes/LDRNodeModel';
import LEDNodeModel from './Nodes/LEDNodeModel';
import PeripheralNodeModel, { Peripheral_Type } from './Nodes/PeripheralNodeModel';
import ResistanceNodeModel from './Nodes/ResistanceNodeModel';   
import UltraSonicNodeModel from './Nodes/UltraSonicNodeModel';
import VoltageNodeModel from './Nodes/VoltageNodeModel';

export default class CircuitSimulator {

    static initializeSimulation() {
        PeripheralNodeModel.chips.forEach((p) => {
            const chip = p as ChipNodeModel;
            chip.pin_directions = [];
            for(let i = 0; i < 32; i++) {
                chip.pin_directions.push(true);
            }
            chip.pin_voltages_initial = [];
            for(let i = 0; i < 32; i++) {
                chip.pin_voltages_initial.push(0);
            }
        });
    }

    static startSimulation() {
        this.removeUnconnectedLinks(getModel());
        this.clearLEDS(getModel());
        
        // Gather all chip ports
        let chip_pins = [];
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
                        this.checkCircuitTypeAndSimulate(PeripheralNodeModel.linkSourceTarget(link));
                    }
                    else {
                        this.checkCircuitTypeAndSimulate(PeripheralNodeModel.linkTargetSource(link));
                    }
                }
            }
        }
    }

    static removeUnconnectedLinks(model: DiagramModel) {

        let links = model.getLinks();
        for (let link of links) {
            let source_port = link.serialize().sourcePort;
            let target_port = link.serialize().targetPort;
            if (source_port === null || target_port === null) {
                link.remove();
            }
        }

    }

    static clearLEDS(model: DiagramModel) {

        for (let node of PeripheralNodeModel.all_peripherals) {
            if (node.PERIPHAREL_TYPE === Peripheral_Type.LED) {
                (node as LEDNodeModel).depaint();
            }
        }

    }

    static checkCircuitTypeAndSimulate(start_link: string[]) {

        let node = PeripheralNodeModel.getPeripheral(start_link[5]);
        if (node === null) {
            return;
        }

        if (this.circuitLEDGround(start_link, node) === true) {
            return;
        }

        if (this.circuitLEDVoltage(start_link, node) === true) {
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

    static circuitLEDGround(start_link: string[], node: PeripheralNodeModel): boolean {

        if (node.PERIPHAREL_TYPE === Peripheral_Type.Resistance || node.PERIPHAREL_TYPE === Peripheral_Type.LED || node.PERIPHAREL_TYPE === Peripheral_Type.LDR) {

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
            let voltage = chip.getPinVoltageValue(start_link[2]);

            if (node.PERIPHAREL_TYPE === Peripheral_Type.Resistance) {
                total_resistance = total_resistance + (node as ResistanceNodeModel).resistance;
            }
            else if (node.PERIPHAREL_TYPE === Peripheral_Type.LDR) {
                total_resistance = total_resistance + LDRNodeModel.calculateResistance();
            }

            let next_node = PeripheralNodeModel.getPeripheral(line[1][5]);
            while (next_node !== null) {
                if (next_node.PERIPHAREL_TYPE === Peripheral_Type.Ground) {
                    break;
                }
                if (next_node.PERIPHAREL_TYPE === Peripheral_Type.Resistance) {
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
                else if (next_node.PERIPHAREL_TYPE === Peripheral_Type.LDR) {
                    total_resistance = total_resistance + LDRNodeModel.calculateResistance();

                    let next_link = next_node.getOtherConnections(line[line.length - 1][7]);

                    if (next_link.length === 1) {
                        next_node = PeripheralNodeModel.getPeripheral(next_link[0][5]);
                        line.push(next_link[0]);
                    }
                    else {
                        return false;
                    }
                }
                else if (next_node.PERIPHAREL_TYPE === Peripheral_Type.LED) {
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
                if (current_node !== null && current_node.PERIPHAREL_TYPE === Peripheral_Type.LED) {
                    (current_node as LEDNodeModel).paint(current);        
                }
            }

            return true;

        }

        return false;
    }

    static circuitLEDVoltage(start_link: string[], node: PeripheralNodeModel): boolean {

        if (node.PERIPHAREL_TYPE === Peripheral_Type.Resistance || node.PERIPHAREL_TYPE === Peripheral_Type.LED || node.PERIPHAREL_TYPE === Peripheral_Type.LDR) {

            let chip = PeripheralNodeModel.getChip(start_link[1]) as ChipNodeModel;
            if (chip.getPinDirection(start_link[2]) === true || chip.getPinVoltageValue(start_link[2]) !== 0) {
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
            let voltage = 0;

            if (node.PERIPHAREL_TYPE === Peripheral_Type.Resistance) {
                total_resistance = total_resistance + (node as ResistanceNodeModel).resistance;
            }
            else if (node.PERIPHAREL_TYPE === Peripheral_Type.LDR) {
                total_resistance = total_resistance + LDRNodeModel.calculateResistance();
            }

            let next_node = PeripheralNodeModel.getPeripheral(line[1][5]);
            while (next_node !== null) {
                if (next_node.PERIPHAREL_TYPE === Peripheral_Type.Voltage) {
                    voltage = (node as VoltageNodeModel).voltage;
                    break;
                }
                if (next_node.PERIPHAREL_TYPE === Peripheral_Type.Resistance) {
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
                else if (next_node.PERIPHAREL_TYPE === Peripheral_Type.LDR) {
                    total_resistance = total_resistance + LDRNodeModel.calculateResistance();

                    let next_link = next_node.getOtherConnections(line[line.length - 1][7]);

                    if (next_link.length === 1) {
                        next_node = PeripheralNodeModel.getPeripheral(next_link[0][5]);
                        line.push(next_link[0]);
                    }
                    else {
                        return false;
                    }
                }
                else if (next_node.PERIPHAREL_TYPE === Peripheral_Type.LED) {
                    if ((next_node as LEDNodeModel).direction === false) {
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
                if (current_node !== null && current_node.PERIPHAREL_TYPE === Peripheral_Type.LED) {
                    (current_node as LEDNodeModel).paint(current);        
                }
            }

            return true;

        }

        return false;
    }

    static circuitUltraSonic(start_link: string[], node: PeripheralNodeModel): boolean {
        
        if (node.PERIPHAREL_TYPE === Peripheral_Type.UltraSonic && start_link[6] === "Trig") {
            let chip = PeripheralNodeModel.getChip(start_link[1]) as ChipNodeModel;
            let links = node.getOtherConnections(start_link[6]);

            if (links.length !== 3) {
                return false;
            }

            if (chip.getPinDirection(start_link[2]) === true) {
                return false;
            }

            let node_voltage = PeripheralNodeModel.getPeripheral(links[0][5]);
            if (node_voltage === null || node_voltage.PERIPHAREL_TYPE !== Peripheral_Type.Voltage) {
                return false;
            }

            let node_chip = PeripheralNodeModel.getChip(links[1][5]);
            if (node_chip === null || node_chip.PERIPHAREL_TYPE !== Peripheral_Type.Chip) {
                return false;
            }

            if (chip.getPinDirection(links[1][6]) === false) {
                return false;
            }

            let node_ground = PeripheralNodeModel.getPeripheral(links[2][5]);
            if (node_ground === null || node_ground.PERIPHAREL_TYPE !== Peripheral_Type.Ground) {
                return false;
            }

            // TODO QEMU
            console.log(UltraSonicNodeModel.ObstacleDistance);
            return true;
        }

        return false;
    }

    static circuitLDR(start_link: string[], node: PeripheralNodeModel): boolean {

        if (node.PERIPHAREL_TYPE === Peripheral_Type.VoltagePot && start_link[6] === "Chip") {

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
                if (next_node.PERIPHAREL_TYPE === Peripheral_Type.Voltage) {
                    voltage = (next_node as VoltageNodeModel).voltage;
                    break;
                }
                if (next_node.PERIPHAREL_TYPE === Peripheral_Type.Resistance) {
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
                else if (next_node.PERIPHAREL_TYPE === Peripheral_Type.LDR) {
                    left_resistance = left_resistance + LDRNodeModel.calculateResistance();
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
                if (next_node.PERIPHAREL_TYPE === Peripheral_Type.Ground) {
                    break;
                }
                if (next_node.PERIPHAREL_TYPE === Peripheral_Type.Resistance) {
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
                else if (next_node.PERIPHAREL_TYPE === Peripheral_Type.LDR) {
                    right_resistance = right_resistance + LDRNodeModel.calculateResistance();
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

    static circuitSwitch(start_link: string[], node: PeripheralNodeModel): boolean {

        if (node.PERIPHAREL_TYPE === Peripheral_Type.Switch && start_link[6] === "Chip") {

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
            if (node_voltage === null || node_voltage.PERIPHAREL_TYPE !== Peripheral_Type.Voltage) {
                return false;
            }
            
            let node_hand = PeripheralNodeModel.getPeripheral(links[1][5]);
            if (node_hand === null || node_hand.PERIPHAREL_TYPE !== Peripheral_Type.Hand) {
                return false;
            }
            else {
                value = (node_hand as HandNodeModel).value;
            }
            
            let node_ground = PeripheralNodeModel.getPeripheral(links[2][5]);
            if (node_ground === null || node_ground.PERIPHAREL_TYPE !== Peripheral_Type.Ground) {
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