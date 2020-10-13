import React from 'react';

import createEngine, {
    DiagramEngine,
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
import UltraSonicNodeModel from './Nodes/UltraSonicNodeModel';
import SwitchNodeModel from './Nodes/SwitchNodeModel';
import LDRNodeModel from './Nodes/LDRNodeModel';
import VoltagePotNodeModel from './Nodes/VoltagePotNodeModel';
import HandNodeModel from './Nodes/HandNodeModel';

interface MyProps {
    
}
  
interface MyState {
    ultraSonic: number
    light: number
}

export default class CircuitDisplay extends React.Component<MyProps, MyState> {

    engine: DiagramEngine;

    constructor(props: any) {
        // React preparation \\
        super(props);
        this.state = {ultraSonic: 1, light: 1};
        this.handleSubmitUltraSonic = this.handleSubmitUltraSonic.bind(this);
        this.handleChangeUltraSonic = this.handleChangeUltraSonic.bind(this);
        this.handleSubmitLight = this.handleSubmitLight.bind(this);
        this.handleChangeLight = this.handleChangeLight.bind(this);

        // Canvas Preparation \\
        let engine = createEngine({ registerDefaultZoomCanvasAction: false });
        const model = new DiagramModel();

        const LINES = [10, 80, 150];

        // Set peripherals
        model.addNode(new GroundNodeModel(true, 10, LINES[0], model));
        model.addNode(new VoltageNodeModel(true, 110, LINES[0], model, 3.3));
        model.addNode(new ResistanceNodeModel(true, 210, LINES[0], model, 1000));

        model.addNode(new LEDNodeModel(true, true, 10, LINES[1], model, "R"));
        model.addNode(new LEDNodeModel(false, true, 95, LINES[1], model, "R"));
        model.addNode(new LEDNodeModel(true, true, 180, LINES[1], model, "G"));
        model.addNode(new LEDNodeModel(false, true, 265, LINES[1], model, "G"));
        model.addNode(new LEDNodeModel(true, true, 350, LINES[1], model, "B"));
        model.addNode(new LEDNodeModel(false, true, 435, LINES[1], model, "B"));
        model.addNode(new LDRNodeModel(true, true, 520, LINES[1], model));
        model.addNode(new LDRNodeModel(false, true, 605, LINES[1], model));

        model.addNode(new UltraSonicNodeModel(true, 10, LINES[2], model));
        model.addNode(new VoltagePotNodeModel(true, 85, LINES[2], model));
        model.addNode(new SwitchNodeModel(true, 235, LINES[2], model));
        model.addNode(new HandNodeModel(0, true, 380, LINES[2], model));
        model.addNode(new HandNodeModel(1, true, 435, LINES[2], model));

        // Set chip
        model.addNode(new ChipNodeModel(true, 1000, LINES[0], model, 0));
        model.addNode(new ChipNodeModel(true, 1100, LINES[0], model, 1));
        model.addNode(new ChipNodeModel(true, 1200, LINES[0], model, 2));
        model.addNode(new ChipNodeModel(true, 1300, LINES[0], model, 3));
        model.addNode(new ChipNodeModel(true, 1400, LINES[0], model, 4));
        model.addNode(new ChipNodeModel(true, 1500, LINES[0], model, 5));

        // Set buttons
        model.addNode(new SimulateNodeModel(1300, LINES[1], model));

        engine.setModel(model);
        this.engine = engine;
    }

    handleChangeUltraSonic(event: any) {
        this.setState({ultraSonic: event.target.value});
    }

    handleSubmitUltraSonic(event: any) {
        UltraSonicNodeModel.ObstacleDistance = this.state.ultraSonic;
        event.preventDefault();
    }

    handleChangeLight(event: any) {
        this.setState({light: event.target.value});
    }

    handleSubmitLight(event: any) {
        LDRNodeModel.Light = this.state.light;
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <CanvasWidget
                engine={this.engine}
                className={"diagram"}
                />
                <form onSubmit={this.handleSubmitUltraSonic}>
                    <label>
                        Obstacle Distance (mm):&nbsp;
                        <input type="number" name="name" min="1" max="10000" value={this.state.ultraSonic} onChange={this.handleChangeUltraSonic} />
                    </label>
                    <input type="submit" value="Set For Ultrasonic Sensor" />
                </form>
                <form onSubmit={this.handleSubmitLight}>
                    <label>
                        Light (lm):&nbsp;
                        <input type="number" name="name" min="1" max="100000" value={this.state.light} onChange={this.handleChangeLight} />
                    </label>
                    <input type="submit" value="Set For Light" />
                </form>
            </div>
        );
    }

}