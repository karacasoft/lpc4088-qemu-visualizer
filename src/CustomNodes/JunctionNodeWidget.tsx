import { DefaultPortModel, DiagramEngine, PortModelAlignment, PortWidget } from '@projectstorm/react-diagrams';
import React from 'react';
import JunctionNodeModel from '../Nodes/JunctionNodeModel';

interface JunctionNodeWidgetProps {
    node: JunctionNodeModel;
    engine: DiagramEngine;
}

interface JunctionNodeWidgetState {

}

export default class JunctionNodeWidget extends React.Component<JunctionNodeWidgetProps, JunctionNodeWidgetState> {
    constructor(props: JunctionNodeWidgetProps) {
        super(props);
        this.state = {};
        this.generatePort = this.generatePort.bind(this);
        this.getPositionForAlignment = this.getPositionForAlignment.bind(this);
    }

    getPositionForAlignment(alignment: PortModelAlignment | undefined) {
        switch(alignment) {
            case PortModelAlignment.LEFT:
                return {
                    left: -4,
                    top: 20,
                }
            case PortModelAlignment.RIGHT:
                return {
                    right: -4,
                    top: 20,
                }
            case PortModelAlignment.TOP:
                return {
                    left: 12,
                    top: -5,
                }
            default:
                return {
                    left: 0,
                    top: 0,
                }
        }
    }

    generatePort(port: DefaultPortModel) {
        const alignment = port.getOptions().alignment;
        return <PortWidget
                key={port.getName()}
                port={port}
                engine={this.props.engine}
                style={{
                    position: "absolute",
                    ...this.getPositionForAlignment(alignment)
                }}>
            <div style={{
                margin: 0,
                padding: 0,
                width: 8,
                height: 8,
                borderRadius: 8,
                cursor: "pointer",
                backgroundColor: "#333333",
                zIndex: 10,
            }}/>
        </PortWidget>
    }

    render() {
        const { node } = this.props;
        return (
            <div style={{
                width: 0,
                height: 0,
                borderLeft: "16px solid transparent",
                borderRight: "16px solid transparent",
                borderBottom: "24px solid #9643AE",
            }}>
                {Object.values(node.getPorts())
                        .map(p => p as DefaultPortModel)
                        .map(this.generatePort)}
            </div>
        );
    }
}