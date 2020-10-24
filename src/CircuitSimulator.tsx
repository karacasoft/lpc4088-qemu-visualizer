import { DiagramModel, LinkModel, PortModel } from '@projectstorm/react-diagrams';
import { IOCON_LOOKUP_TABLE } from './common/IOCONLookup';
import { IOCONState } from './common/QemuConnectorTypes';
import { getModel } from './Diagram';
import ChipNodeModel from './Nodes/ChipNodeModel';
import HandNodeModel from './Nodes/HandNodeModel';
import LDRNodeModel from './Nodes/LDRNodeModel';
import LEDNodeModel from './Nodes/LEDNodeModel';
import PeripheralNodeModel, { Peripheral_Type } from './Nodes/PeripheralNodeModel';
import ResistanceNodeModel from './Nodes/ResistanceNodeModel';   
import UltraSonicNodeModel from './Nodes/UltraSonicNodeModel';
import VoltageNodeModel from './Nodes/VoltageNodeModel';

type CircuitNodeRule = ChipNodeRule | LEDNodeRule | LogicalCombinationRule
    | ZeroOrMoreRule | ResistanceNodeRule | LDRNodeRule | VoltageNodeRule | GroundNodeRule;

interface ZeroOrMoreRule {
    peripheral: "zeroormore";
    rule: CircuitNodeRule;
    min?: number;
    max?: number;
}

interface LogicalCombinationRule {
    peripheral: "combination";
    combination: "or" | "and";
    rules: CircuitNodeRule[];
}

interface ChipNodeRule {
    peripheral: "chip";
    pin_dir: "output" | "input";
    pin_func: "GPIO" | "TIMER" | "UART";
    pin_voltage?: number;
    check_v_diff?: "higher" | "lower"; // checks if pin voltage is higher (or lower) than ending node
}

interface LEDNodeRule {
    peripheral: "led";
    direction: "+-" | "-+";
}

interface ResistanceNodeRule {
    peripheral: "resistance";
}

interface LDRNodeRule {
    peripheral: "ldr";
}

interface VoltageNodeRule {
    peripheral: "voltage";
}

interface GroundNodeRule {
    peripheral: "ground";
}

function zeroOrMore(rule: CircuitNodeRule, min?: number, max?: number): ZeroOrMoreRule {
    return {
        peripheral: "zeroormore",
        rule,
        min,
        max
    };
}

function and(rules: CircuitNodeRule[]): LogicalCombinationRule {
    return {
        peripheral: "combination",
        combination: "and",
        rules
    };
}

function or(rules: CircuitNodeRule[]): LogicalCombinationRule {
    return {
        peripheral: "combination",
        combination: "or",
        rules
    };
}

function chip({
    pin_dir, pin_func, pin_voltage, check_v_diff
}: Pick<ChipNodeRule, "pin_dir" | "pin_func" | "pin_voltage" | "check_v_diff">): ChipNodeRule {
    return {
        peripheral: "chip",
        pin_dir,
        pin_func,
        pin_voltage,
        check_v_diff
    }
}

function led(direction: "+-" | "-+"): LEDNodeRule {
    return {
        peripheral: "led",
        direction
    };
}

function resistance(): ResistanceNodeRule { return { peripheral: "resistance" }; }

function ldr(): LDRNodeRule { return { peripheral: "ldr" }; }

function voltage(): VoltageNodeRule { return { peripheral: "voltage" }; }

function ground(): GroundNodeRule { return { peripheral: "ground" }; }

interface Ruleset {
    rules: CircuitNodeRule[];
    simulate?: (ruleset_name: string, node_chain: PeripheralNodeModel[], port_chain: PortModel[]) => void;
}

export type OnInputChangeListener = (port: number, pin: number, value: number) => void;
export type OnTimerEMRChangeListener = (timer: number, emr_val: number) => void;


export default class CircuitSimulator {
    static iocon_state: IOCONState | null = null;
    static timer0_emr: number = 0;
    static timer1_emr: number = 0;
    static timer2_emr: number = 0;
    static timer3_emr: number = 0;

    private static _onInputChangeListener?: OnInputChangeListener;
    private static _onTimerEMRChangeListener?: OnTimerEMRChangeListener;

    public static set onInputChangeListener(l: OnInputChangeListener) {
        CircuitSimulator._onInputChangeListener = l;
    }

    public static set onTimerEMRChangeListener(l: OnTimerEMRChangeListener) {
        CircuitSimulator._onTimerEMRChangeListener = l;
    }

    private static circuit_rules: { [r_name: string]: Ruleset } = {
        // names of the rulesets are being used for simulation. Do not change...
        "led1": {
            rules: [
                chip({ pin_dir: "output", pin_func: "GPIO" }),
                zeroOrMore(or([resistance(), ldr()])),
                zeroOrMore(led("+-")),
                zeroOrMore(or([resistance(), ldr()])),
                ground(),
            ],
            simulate: CircuitSimulator.simulateLED,
        },
        "led2": {
            rules: [
                chip({ pin_dir: "output", pin_func: "GPIO" }),
                zeroOrMore(or([resistance(), ldr()])),
                zeroOrMore(led("-+")),
                zeroOrMore(or([resistance(), ldr()])),
                voltage(),
            ],
            simulate: CircuitSimulator.simulateLED,
        },
        "input": {
            rules: [
                chip({ pin_dir: "input", pin_func: "GPIO" }),
                zeroOrMore(or([resistance(), ldr()])),
                or([voltage(), ground()]),
            ],
            simulate: CircuitSimulator.simulateInput,
        }
    };

    

    static simulateLED(ruleset_name: string, node_chain: PeripheralNodeModel[], port_chain: PortModel[]) {
        const chip = port_chain[0].getNode() as ChipNodeModel;
        const chip_port = port_chain[0];
        const port_nr = chip.lpc_4088_port;
        const pin_nr = parseInt(chip_port.getName());

        const v_top = (ChipNodeModel.chips[port_nr] as ChipNodeModel).pin_voltages_initial[pin_nr];
        
        let totalRes = 0;
        port_chain.filter(p => p !== null).forEach(p => {
            const node = p.getNode() as PeripheralNodeModel;
            if(node.PERIPHAREL_TYPE === Peripheral_Type.Resistance) {
                const r_node = node as ResistanceNodeModel;
                totalRes += r_node.resistance;
            } else if(node.PERIPHAREL_TYPE === Peripheral_Type.LDR) {
                totalRes += LDRNodeModel.calculateResistance();
            }
        });
        let current: number;
        if(ruleset_name === "led1") {
            current = v_top / (totalRes + 0.001);
        } else if(ruleset_name === "led2") {
            current = (3.3 - v_top) / (totalRes + 0.001);
        }
        port_chain.filter(p => p !== null).forEach(p => {
            const node = p.getNode() as PeripheralNodeModel;
            if(node.PERIPHAREL_TYPE === Peripheral_Type.LED) {
                const l_node = node as LEDNodeModel;
                l_node.paint(current);
            }
        });
    }

    static simulateInput(ruleset_name: string, node_chain: PeripheralNodeModel[], port_chain: PortModel[]) {
        const chip = node_chain[0] as ChipNodeModel;
        const chip_port = port_chain[0];

        const port_nr = chip.lpc_4088_port;
        const pin_nr = parseInt(chip_port.getName());

        const last_node = node_chain[node_chain.length - 1];
        
        if(last_node.PERIPHAREL_TYPE === Peripheral_Type.Voltage) {
            chip.pin_voltages[pin_nr] = 3.3;
        } else if(last_node.PERIPHAREL_TYPE === Peripheral_Type.Ground) {
            chip.pin_voltages[pin_nr] = 0;
        }
        CircuitSimulator._onInputChangeListener
            && CircuitSimulator._onInputChangeListener(port_nr, pin_nr, chip.pin_voltages[pin_nr]);
    }

    static applyRule(rule: CircuitNodeRule, port: PortModel, node?: PeripheralNodeModel): boolean {
        if (node === undefined) {
            node = port.getNode() as PeripheralNodeModel;
        }
        switch (rule.peripheral) {
            case "chip":
                if(node.PERIPHAREL_TYPE !== Peripheral_Type.Chip) return false;
                const chipNode = node as ChipNodeModel;
    
                const port_nr = chipNode.lpc_4088_port;
                const pin_nr = parseInt(port.getName());
                if((rule.pin_dir === "input" && !chipNode.pin_directions[pin_nr]) ||
                        (rule.pin_dir === "output" && chipNode.pin_directions[pin_nr])) {
                    return false;
                }
                if(this.iocon_state !== null) {
                    const iocon_val = IOCON_LOOKUP_TABLE[port_nr][pin_nr][this.iocon_state.PORTS[port_nr][pin_nr]];
                    if(iocon_val !== undefined) {
                        if(iocon_val.module !== rule.pin_func) {
                            return false;
                        }
                    }
                }
                    
    
                return true;
            case "resistance":
                if(node.PERIPHAREL_TYPE !== Peripheral_Type.Resistance) return false;
                return true;
            case "led":
                if(node.PERIPHAREL_TYPE !== Peripheral_Type.LED) return false;
                const led_node = node as LEDNodeModel;
                if(rule.direction === "+-" && led_node.direction) {
                    return false;
                } else if(rule.direction === "-+" && !led_node.direction) {
                    return false;
                }
                return true;
            case "ground":
                if(node.PERIPHAREL_TYPE !== Peripheral_Type.Ground) return false;
                return true;
            case "voltage":
                if(node.PERIPHAREL_TYPE !== Peripheral_Type.Voltage) return false;
                return true;
            case "combination":
                if(rule.combination === "or") {
                    return rule.rules.map(x => this.applyRule(x, port, node))
                            .reduce((a, b) => a || b, false);
                } else if(rule.combination === "and") {
                    return rule.rules.map(x => this.applyRule(x, port, node))
                            .reduce((a, b) => a && b, true);
                }
                return false;
            default:
                break;
        }
        return false;
    }

    static initializeSimulation() {
        PeripheralNodeModel.chips.forEach((p) => {
            const chip = p as ChipNodeModel;
            chip.pin_directions = [];
            chip.GPIO_pin_directions = [];
            for(let i = 0; i < 32; i++) {
                chip.pin_directions.push(true);
                chip.GPIO_pin_directions.push(true);
            }
            chip.pin_voltages = [];
            chip.GPIO_pin_voltages = [];
            chip.pin_voltages_initial = [];
            chip.GPIO_pin_voltages_initial = [];
            for(let i = 0; i < 32; i++) {
                chip.pin_voltages.push(0);
                chip.GPIO_pin_voltages.push(0);

                chip.pin_voltages_initial.push(0);
                chip.GPIO_pin_voltages_initial.push(0);
            }
        });
    }

    static startSimulation() {
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
            if(Object.keys(links).length !== 0) console.log(links);
            for (let link of Object.values(links)) {
                if (link.getSourcePort() !== null && link.getTargetPort() !== null) {
                    /*if ((link.getSourcePort().getNode() as PeripheralNodeModel).getName().substring(0, 3) === "LPC") {
                        this.checkCircuitTypeAndSimulate(PeripheralNodeModel.linkSourceTarget(link));
                    }
                    else {
                        this.checkCircuitTypeAndSimulate(PeripheralNodeModel.linkTargetSource(link));
                    }*/
                    
                    this.checkCircuitTypeAndSimulate2(link, chip_pins[i].getNode() as PeripheralNodeModel);
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

    static checkCircuitTypeAndSimulate2(start_link: LinkModel, start_node: PeripheralNodeModel) {
        let start_node_is: "source" | "target" = start_link.getSourcePort().getNode() === start_node ? "source" : "target";
        let start_port = start_node_is === "source" ? start_link.getSourcePort() : start_link.getTargetPort();
        if(start_node === null) {
            return;
        }

        Object.values(CircuitSimulator.circuit_rules).forEach((ruleset, idx) => {
            let current_node_is: "source" | "target" = start_node_is;
            let current_link: LinkModel | null = start_link;
            let current_port: PortModel | null = start_port;
            let current_node = start_node as PeripheralNodeModel;

            let next_exists: boolean = true;
            function follow() {
                if(!next_exists) return false;
                if(current_link === null) return false;
                const target_port = current_node_is === "source" ? current_link.getTargetPort() : current_link.getSourcePort();
                const next_node = target_port.getNode() as PeripheralNodeModel;
                const next_ports = next_node.followConnection(target_port.getID());
                if(next_ports.length === 1 && Object.keys(next_ports[0].getLinks()).length === 1) {
                    current_port = next_ports[0];
                    current_link = Object.values(current_port.getLinks())[0];
                    current_node_is = current_link.getTargetPort().getNode() === next_node ? "target" : "source";
                    current_node = next_node;

                } else if(next_ports.length === 1) {
                    current_node = next_node;
                    current_port = next_ports[0];
                    current_link = null;
                    next_exists = false;

                } else {
                    current_node = next_node;
                    current_port = null;
                    current_link = null;
                    next_exists = false;
                }
                // we do not support branching circuits for now
                return true;
            }

            const node_chain: PeripheralNodeModel[] = [];
            const port_chain: PortModel[] = [];

            for(let rule of ruleset.rules) {
                if(rule.peripheral === "zeroormore") {
                    while(this.applyRule(rule.rule, current_port, current_node)) {
                        port_chain.push(current_port);
                        node_chain.push(current_node);
                        if(!follow()) {
                            break;
                        }
                        if(!next_exists) break;
                    }
                } else {
                    if(this.applyRule(rule, current_port, current_node)) {
                        port_chain.push(current_port);
                        node_chain.push(current_node);
                        if(!follow()) {
                            break;
                        }
                        
                    } else {
                        return;
                    }
                }
            }
            if(!next_exists) {
                //port_chain.push(current_port);
                // this is a valid circuit
                // simulate accordingly
                const rule_name = Object.keys(CircuitSimulator.circuit_rules)[idx];
                if(ruleset.simulate) ruleset.simulate(rule_name, node_chain, port_chain);
            }
        });

    }

    static checkCircuitTypeAndSimulate(start_link: string[]) {

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

    static circuitLED(start_link: string[], node: PeripheralNodeModel): boolean {

        if (node.PERIPHAREL_TYPE === Peripheral_Type.Resistance || node.PERIPHAREL_TYPE === Peripheral_Type.LED || node.PERIPHAREL_TYPE === Peripheral_Type.LDR) {

            let chip = PeripheralNodeModel.getChip(start_link[1]) as ChipNodeModel;
            if (chip.getPinDirection(start_link[2]) === true) {
                //return false;
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