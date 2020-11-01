import { DefaultPortModel, DiagramEngine, PortWidget } from '@projectstorm/react-diagrams';
import React from 'react';
import JoystickNodeModel from '../Nodes/JoystickNodeModel';
import Joystick from './Joystick';

interface JoystickNodeWidgetProps {
    node: JoystickNodeModel;
    engine: DiagramEngine;
}

interface JoystickNodeWidgetState {

}

export default class JoystickNodeWidget extends React.Component<JoystickNodeWidgetProps, JoystickNodeWidgetState> {
    constructor(props: JoystickNodeWidgetProps) {
        super(props);
        this.generateCommonPort = this.generateCommonPort.bind(this);
        this.generateOutPort = this.generateOutPort.bind(this);
    }

    generateOutPort(port: DefaultPortModel, idx: number) {
        return <PortWidget
                key={port.getName()}
                port={port}
                engine={this.props.engine}
                style={{
                    position: "absolute",
                    display: "flex",
                    right: -8,
                    top: 24 + 24 * idx,
                }}>
            <span>{port.getName()}</span>
            <div style={{
                margin: 0,
                padding: 0,
                width: 16,
                height: 16,
                borderRadius: 8,
                cursor: "pointer",
                backgroundColor: "#333333",
                zIndex: 10,
            }}/>
        </PortWidget>;
    }

    generateCommonPort(port: DefaultPortModel) {
        return <PortWidget
                port={port}
                engine={this.props.engine}
                style={{
                    position: "absolute",
                    display: "flex",
                    left: -8,
                    top: 72,
                }}>
            <div style={{
                margin: 0,
                padding: 0,
                width: 16,
                height: 16,
                borderRadius: 8,
                cursor: "pointer",
                backgroundColor: "#333333",
                zIndex: 10,
            }} />
            <span>Common</span>
        </PortWidget>
    }

    render() {
        const { node } = this.props;
        if(node.getInPorts().length !== 1) {
            console.log("Invalid # of in ports for a joystick node");
        }
        const common_in_port = node.getInPorts()[0];
        return (
            <div style={{
                margin: 0,
                padding: 8,
                paddingLeft: 64,
                paddingRight: 64,
                borderStyle: "solid",
                borderRadius: 8,
                borderWidth: 2,
                borderColor: node.isSelected() ? "#8080FF" : "#333",
                backgroundColor: "#DDDDDD",
            }}>
                <Joystick onPressButton={(which) => {}}
                        onReleaseButton={(which) => {}} />
                {this.generateCommonPort(common_in_port)}
                {node.getOutPorts().map(this.generateOutPort)}
            </div>
        );
    }
}