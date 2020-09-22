import React from 'react';

import createEngine, {
    DefaultLinkModel,
    DefaultNodeModel,
    DiagramModel,
    NodeModelListener,
    NodeModel,
    NodeModelGenerics
} from '@projectstorm/react-diagrams';

import {
    CanvasWidget,
    BaseEntityEvent
} from '@projectstorm/react-canvas-core';

import Item from './Item';

let engine = createEngine();




// Build peripheral buttons
const PERIPHERAL_SIZE = 16;

const PERIPHERAL_NAMES: string[] = ["3.3 Voltage", "3.3 Voltage", "Ground", "Ground", "1K Ω R", "- LED Red +", "+ LED Red -", "- LED Green +", "+ LED Green -", "- LED Blue +", "+ LED Blue -", "- LDR +", "+ LDR -", "Potentiometer", "Ultrasound", "Motor Controller"];
const PERIPHERAL_COLOURS: number[][] = [[192, 64, 0], [192, 64, 0], [128, 128, 128], [128, 128, 128], [64, 64, 64], [255, 0, 0], [255, 0, 0], [0, 255, 0], [0, 255, 0], [0, 0, 255], [0, 0, 255], [255, 127, 0], [255, 127, 0], [192, 0, 64], [64, 128, 192], [128, 192, 64]];
const PERIPHERAL_PORTS: number[][] = [[0], [1], [0], [1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1]];   // 0: In, 1: Out
const PERIPHERAL_PINS: string[][] = [["+ Left"], ["Right +"], ["- Left"], ["Right -"], ["<=", "=>"], ["-", "+"], ["+", "-"], ["-", "+"], ["+", "-"], ["-", "+"], ["+", "-"], ["-", "+"], ["+", "-"], ["+", "Out", "-"], ["VCC", "Trig", "Echo", "GND"], ["6-12V", "GND", "5V", "ENA", "IN1", "IN2", "ENB", "IN3", "IN4"]];
const PERIPHERAL_PLACE: number = 10;

let peripherals: Item[] = [];

let x: number = PERIPHERAL_PLACE;

for (let i = 0; i < Math.ceil(PERIPHERAL_SIZE / 2); i ++) {
    peripherals.push(new Item(PERIPHERAL_NAMES[i], true, [x, 10], PERIPHERAL_COLOURS[i],  PERIPHERAL_PORTS[i], PERIPHERAL_PINS[i]));
    x = x + 90;
}

x = PERIPHERAL_PLACE;

for (let i = Math.ceil(PERIPHERAL_SIZE / 2); i < PERIPHERAL_SIZE; i ++) {
    peripherals.push(new Item(PERIPHERAL_NAMES[i], true, [x, 100], PERIPHERAL_COLOURS[i],  PERIPHERAL_PORTS[i], PERIPHERAL_PINS[i]));
    x = x + 90;
}

// Bulid chip
const CHIP_SIZE = 4;

const CHIP_NAMES: string[] = ["LPC4088 Pins 0", "LPC4088 Pins 1", "LPC4088 Pins 2", "LPC4088 Pins 5"];
const CHIP_COLOUR: number[] = [240, 60, 60];
const CHIP_PORTS: number[][] = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0], [0, 0, 0, 0, 0]];  // 0: In, 1: Out
const CHIP_PINS: string[][] = [["P0.0", "P0.1", "P0.2", "P0.3", "P0.4", "P0.5", "P0.6", "P0.7", "P0.8", "P0.9", "P0.21", "P0.23", "P0.24", "P0.25", "P0.26"], ["P1.2", "P1.3", "P1.5", "P1.6", "P1.7", "P1.11", "P.12", "P1.20", "P1.23", "P1.24", "P1.30", "P1.31"], ["P2.20"], ["P5.0", "P5.1", "P5.2", "P5.3", "P5.4"]];
const CHIP_X: number[] = [150, 275, 225, 50];

let chips: Item[] = [];

let y: number = 0;

for (let i = 0; i < CHIP_SIZE; i ++) {
    y = y + CHIP_X[i];
    chips.push(new Item(CHIP_NAMES[i], true, [1200, y], CHIP_COLOUR,  CHIP_PORTS[i], CHIP_PINS[i]));
}

// Build circuit peripherals
let connectors: Item[] = [];
for (let chip of chips) {
    connectors.push(chip);
}

for (let i = 0; i < PERIPHERAL_SIZE; i ++) {
    peripherals[i].model.registerListener({
        selectionChanged: () => {
            if (peripherals[i].model.isSelected()) {
                let connector = new Item(peripherals[i].name, false, [peripherals[i].place[0], peripherals[i].place[1] + 300], peripherals[i].colour, peripherals[i].ports, peripherals[i].pins);
                connectors.push(connector);
                engine.getModel().addNode(connector.model);
                connector.model.registerListener({
                    entityRemoved: () => {
                        for (let i = 0; i < connectors.length; i ++) {
                            if (connectors[i].ID == connector.ID) {
                                connectors.splice(i, 1);
                                break;
                            }
                        }
                    }
                });
            }
        }
    });
}

// Build functional button
let circuit = new DefaultNodeModel({name: "Extract Circuit", color: "rgb(64, 128, 96)"});
circuit.setLocked();
circuit.setPosition(1400, 75);
circuit.registerListener({
    selectionChanged: () => {
        if (circuit.isSelected()) {
            let valid_links: string[][] = [];
            let links = engine.getModel().getLinks();
            for (let link of links) {
                let source_port = link.serialize().sourcePort;
                let target_port = link.serialize().targetPort;
                if (source_port != null && target_port != null) {
                    let source_id = link.serialize().source;
                    let target_id = link.serialize().target;
                    let link_string: string[] = [];
                    for (let connector of connectors) {
                        if (connector.ID == source_id) {
                            link_string.push(connector.ID);
                            link_string.push(connector.name);
                            link_string.push(engine.getModel().getNode(link.serialize().source).getPortFromID(source_port)?.serialize().name as string);
                            break;
                        }
                    }
                    for (let connector of connectors) {
                        if (connector.ID == target_id) {
                            link_string.push(connector.ID);
                            link_string.push(connector.name);
                            link_string.push(engine.getModel().getNode(link.serialize().target).getPortFromID(target_port)?.serialize().name as string);
                            break;
                        }
                    }
                    valid_links.push(link_string);
                }
            }
            console.log(valid_links);
        }
    }
});

// Set canvas model, add nodes and work the engine.
const model = new DiagramModel();

for (let i = 0; i < PERIPHERAL_SIZE; i ++) {
    model.addNode(peripherals[i].model);
}

for (let i = 0; i < CHIP_SIZE; i ++) {
    model.addNode(chips[i].model);
}

model.addNode(circuit);

engine.setModel(model);

export default class CircuitDisplay extends React.Component {

    render() {
        return (<CanvasWidget
            engine={engine}
            className={"diagram"}
        />);
    }

}