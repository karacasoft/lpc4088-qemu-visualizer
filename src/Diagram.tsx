import React from 'react';

import createEngine, {
    DiagramModel,
} from '@projectstorm/react-diagrams';

import {
    CanvasWidget,
} from '@projectstorm/react-canvas-core';

import ChipNodeModel from './Nodes/ChipNodeModel';
import GroundNodeModel from './Nodes/GroundNodeModel';
import VoltageNodeModel from './Nodes/VoltageNodeModel';
import LEDNodeModel from './Nodes/LEDNodeModel';
import ResistanceNodeModel from './Nodes/ResistanceNodeModel';
import SimulateNodeModel from './Nodes/SimulateNodeModel';

let engine = createEngine({ registerDefaultZoomCanvasAction: false });
const model = new DiagramModel();

const LINES = [10, 80];

// Set peripherals
model.addNode(new GroundNodeModel(true, 10, LINES[0], model));
model.addNode(new VoltageNodeModel(true, 110, LINES[0], model, 3.3));
model.addNode(new ResistanceNodeModel(true, 270, LINES[0], model, 1000));
model.addNode(new LEDNodeModel(0, true, 10, LINES[1], model, "R"));
model.addNode(new LEDNodeModel(1, true, 95, LINES[1], model, "R"));
model.addNode(new LEDNodeModel(0, true, 180, LINES[1], model, "G"));
model.addNode(new LEDNodeModel(1, true, 265, LINES[1], model, "G"));
model.addNode(new LEDNodeModel(0, true, 350, LINES[1], model, "B"));
model.addNode(new LEDNodeModel(1, true, 435, LINES[1], model, "B"));

// Set chip
/*let chips: ChipNodeModel[] = [];
chips.push(new ChipNodeModel(1300, 150, model, 0));
chips.push(new ChipNodeModel(1300, 425, model, 1));
chips.push(new ChipNodeModel(1300, 650, model, 2));
chips.push(new ChipNodeModel(1300, 700, model, 3));
chips.forEach(element => {
    model.addNode(element);
});*/
model.addNode(new ChipNodeModel(true, 1000, LINES[0], model, 0));
model.addNode(new ChipNodeModel(true, 1100, LINES[0], model, 1));
model.addNode(new ChipNodeModel(true, 1200, LINES[0], model, 2));
model.addNode(new ChipNodeModel(true, 1300, LINES[0], model, 3));
model.addNode(new ChipNodeModel(true, 1400, LINES[0], model, 4));
model.addNode(new ChipNodeModel(true, 1500, LINES[0], model, 5));
// Set buttons
model.addNode(new SimulateNodeModel(1300, LINES[1], model));

engine.setModel(model);

export default class CircuitDisplay extends React.Component {

    render() {
        return (<CanvasWidget
            engine={engine}
            className={"diagram"}
        />);
    }

}