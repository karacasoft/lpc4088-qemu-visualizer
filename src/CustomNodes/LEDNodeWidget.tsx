import { Button, IconButton, Typography } from '@material-ui/core';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import { DefaultPortModel, DiagramEngine, PortWidget } from '@projectstorm/react-diagrams';
import React from 'react';
import LEDNodeModel from '../Nodes/LEDNodeModel';

interface LEDNodeWidgetProps {
    node: LEDNodeModel;
    engine: DiagramEngine;
}

interface LEDNodeWidgetState {
    direction: boolean;
}

export default class LEDNodeWidget extends React.Component<LEDNodeWidgetProps, LEDNodeWidgetState> {

    constructor(props: LEDNodeWidgetProps) {
        super(props);
        this.state = {
            direction: props.node.direction,
        };
        this.generatePort = this.generatePort.bind(this);
        this.switchDirection = this.switchDirection.bind(this);
    }

    switchDirection() {
        this.props.node.direction = !this.props.node.direction;
        this.setState({
            direction: this.props.node.direction,
        });
    }

    generatePort(isInPort: boolean) {
        return (port: DefaultPortModel) => {
            return <PortWidget
                key={port.getName()}
                port={port}
                engine={this.props.engine}
                style={{
                    position: "absolute",
                    left: isInPort ? -8 : 88,
                    top: 48,
                }}
                >
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
                </PortWidget>
        };
    }

    render() {
        return (
            <div style={{
                margin: 0,
                padding: 0,
                paddingBottom: 8,
                display: "flex",
                width: 92,
                borderStyle: "solid",
                borderRadius: 8,
                borderWidth: 2,
                borderColor: this.props.node.isSelected() ? "#8080FF" : "#333",
                alignContent: "center",
                flexDirection: "column",
                backgroundColor: this.props.node.getOptions().color,
            }}>
                <IconButton onClick={this.switchDirection}>
                    <SwapHorizontalCircleIcon />
                </IconButton>
                <div>
                    <span style={{ float: "left", marginLeft: 8 }}>
                        {this.props.node.direction ? "+" : "-"}
                    </span>
                    <span style={{ float: "right", marginRight: 8 }}>
                        {this.props.node.direction ? "-" : "+"}
                    </span>
                </div>
                {this.props.node.getInPorts().map(this.generatePort(true))}
                {this.props.node.getOutPorts().map(this.generatePort(false))}
            </div>
        );
    }
}