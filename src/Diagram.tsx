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
import SevenSegmentNodeModel from './Nodes/SevenSegmentNodeModel';
import { ipcRenderer } from 'electron';

import { MachineStateEventData } from '../common/QemuConnectorTypes';

interface MyProps {
}
  
interface MyState {
    initialized: boolean;

    ultraSonic: number;
    light: number;
    message: string;
    info: string;
}

let model = new DiagramModel();
let engine: DiagramEngine = createEngine({ registerDefaultZoomCanvasAction: false });

export function getModel() { return model; }
export function getEngine() { return engine; }

export default class CircuitDisplay extends React.Component<MyProps, MyState> {

    

    constructor(props: any) {
        // React preparation \\
        super(props);
        this.state = {
            initialized: false,

            ultraSonic: 1,
            light: 1,
            message: "",
            info: "All information will be displayed here."
        };
        this.handleSubmitUltraSonic = this.handleSubmitUltraSonic.bind(this);
        this.handleChangeUltraSonic = this.handleChangeUltraSonic.bind(this);
        this.handleSubmitLight = this.handleSubmitLight.bind(this);
        this.handleChangeLight = this.handleChangeLight.bind(this);
        this.handleSubmitMessage = this.handleSubmitMessage.bind(this);
        this.handleChangeMessage = this.handleChangeMessage.bind(this);
        this.handleSubmitJoystickLeft = this.handleSubmitJoystickLeft.bind(this);
        this.handleSubmitJoystickUp = this.handleSubmitJoystickUp.bind(this);
        this.handleSubmitJoystickRight = this.handleSubmitJoystickRight.bind(this);
        this.handleSubmitJoystickDown = this.handleSubmitJoystickDown.bind(this);
        this.handleSubmitJoystickCenter = this.handleSubmitJoystickCenter.bind(this);

        
    }

    componentDidMount() {
        // Canvas Preparation \\
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
        model.addNode(new SevenSegmentNodeModel(true, 600, LINES[0], model));
        model.addNode(new SevenSegmentNodeModel(false, 730, LINES[0], model));

        engine.setModel(model);
        this.setState({
            initialized: true,
        });

        ipcRenderer.on('on-machine-state-changed', (ev, state_change_ev) => {
            const m_state_change_ev = state_change_ev as MachineStateEventData;

            switch(m_state_change_ev.module) {
                case "GPIO":
                    if(m_state_change_ev.event === "dir_change") {
                        
                    } else if(m_state_change_ev.event === "mask_change") {

                    } else if(m_state_change_ev.event === "pin_change") {

                    }
                    break;
                case "IOCON":
                    if(m_state_change_ev.event === "func_change") {

                    }
                    break;
                default:
                    
                    break;
            }
        });
    }

    componentDidUpdate(prevProps: MyProps, prevState: MyState) {

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

    handleChangeMessage(event: any) {
        this.setState({message: event.target.value});
    }

    handleSubmitMessage(event: any) {
        event.preventDefault();
    }

    handleSubmitJoystickLeft(event: any) {
        event.preventDefault();
    }

    handleSubmitJoystickUp(event: any) {
        event.preventDefault();
    }

    handleSubmitJoystickRight(event: any) {
        event.preventDefault();
    }

    handleSubmitJoystickDown(event: any) {
        event.preventDefault();
    }

    handleSubmitJoystickCenter(event: any) {
        event.preventDefault();
    }

    render() {
        //console.log(this.engine.getModel());
        if(engine.getModel() !== null) {
            return (<CanvasWidget
                engine={engine}
                className={"diagram"}/>);
        }
        return null;
        /*return (
            <div className="diagram-container">
                
                <div className={"info"}>
                    <p>
                        {this.state.info}
                    </p>
                </div>
                <div className={"message"}>
                    <form onSubmit={this.handleSubmitMessage}>
                    <label>
                            UART Message:&nbsp;
                            <input type="text" name="name" size={40} maxLength={128} value={this.state.message} onChange={this.handleChangeMessage} />
                        </label>
                        <input type="submit" value="Send To UART" />
                    </form>
                    <br />
                    <button onClick={this.handleSubmitJoystickLeft}>
                        Joystick Left
                    </button>
                    <button onClick={this.handleSubmitJoystickUp}>
                        Joystick Up
                    </button>
                    <button onClick={this.handleSubmitJoystickRight}>
                        Joystick Right
                    </button>
                    <button onClick={this.handleSubmitJoystickDown}>
                        Joystick Down
                    </button>
                    <button onClick={this.handleSubmitJoystickCenter}>
                        Joystick Center
                    </button>
                </div>
                <div className={"bottom"}>
                    <form onSubmit={this.handleSubmitUltraSonic}>
                        <label>
                            Obstacle Distance (mm):&nbsp;
                            <input type="number" name="name" min="1" max="10000" value={this.state.ultraSonic} onChange={this.handleChangeUltraSonic} />
                        </label>
                        <input type="submit" value="Set For Ultrasonic Sensor" />
                    </form>
                    <br />
                    <form onSubmit={this.handleSubmitLight}>
                        <label>
                            Light (lm):&nbsp;
                            <input type="number" name="name" min="1" max="100000" value={this.state.light} onChange={this.handleChangeLight} />
                        </label>
                        <input type="submit" value="Set For Light" />
                    </form>
                </div>
            </div>
        );*/
    }

}