import { DefaultPortModel, DiagramEngine, PortWidget } from '@projectstorm/react-diagrams';
import React from 'react';
import SwitchNodeModel from '../Nodes/SwitchNodeModel';
import { Switch } from '@material-ui/core';

interface SwitchNodeWidgetProps {
    node: SwitchNodeModel;
    engine: DiagramEngine;
}

interface SwitchNodeWidgetState {
    switchOn: boolean;
}

export default class SwitchNodeWidget extends React.Component<SwitchNodeWidgetProps, SwitchNodeWidgetState> {

    constructor(props: SwitchNodeWidgetProps) {
        super(props);
        this.state = {
            switchOn: this.props.node.selectedInput === 1,
        };
        this.generateInPort = this.generateInPort.bind(this);
        this.generateOutPort = this.generateOutPort.bind(this);
    }

    generateInPort(port: DefaultPortModel, idx: number) {
        return <PortWidget
                key={port.getName()}
                port={port}
                engine={this.props.engine}
                style={{
                    position: "absolute",
                    display: "flex",
                    left: -8,
                    top: 56 + 24 * idx,
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
            }}/>
            <span>{port.getName()}</span>
        </PortWidget>;
    }

    generateOutPort(port: DefaultPortModel) {
        return <PortWidget
                key={port.getName()}
                port={port}
                engine={this.props.engine}
                style={{
                    position: "absolute",
                    display: "flex",
                    right: -8,
                    top: 72,
                }}>
            <span>{port.getName()}</span>
            <div style={{
                margin: 0,
                padding: 0,
                width: 16,
                height: 16,
                borderRadius: 8,
                cursor: "pointer",
                backgroundColor: "#666666",
                zIndex: 10,
            }}/>
        </PortWidget>;
    }

    render() {
        const { node } = this.props;
        return (
            <div style={{
                margin: 0,
                padding: 8,
                display: "flex",
                width: 124,
                height: 96,
                borderStyle: "solid",
                borderRadius: 8,
                borderWidth: 2,
                borderColor: node.isSelected() ? "#8080FF" : "#333",
                alignContent: "center",
                justifyContent: "space-evenly",
                flexDirection: "row",
                backgroundColor: node.getOptions().color,
            }}>
                <span style={{
                    color: this.state.switchOn ? undefined : "#00DD33",
                }}>1</span>
                <Switch
                    checked={this.state.switchOn}
                    onChange={(ev, checked) => {
                        node.selectedInput = (checked) ? 1 : 0;
                        this.setState({ switchOn: checked });
                    }}/>
                <span style={{
                    color: this.state.switchOn ? "#00DD33" : undefined,
                }}>2</span>
                {node.getInPorts().map(this.generateInPort)}
                {node.getOutPorts().map(this.generateOutPort)}
            </div>
        );
    }
}