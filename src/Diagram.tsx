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

const engine = createEngine();

const node1 = new DefaultNodeModel({
    name: "wow",
    color: "rgb(0, 255, 0)",

});

node1.registerListener({
    positionChanged: (event: BaseEntityEvent<NodeModel<NodeModelGenerics>>): void => {
        
    },
} as NodeModelListener);

node1.setPosition(100, 100);
let port1 = node1.addOutPort('out of wow');

const node2 = new DefaultNodeModel({
    name: "wow2",
    color: "rgb(255, 0, 0)",
});

node2.setPosition(100, 200);
let port2 = node2.addInPort("In of wow2");

const link = port1.link<DefaultLinkModel>(port2);

const model = new DiagramModel();
model.addAll(node1, node2, link);
engine.setModel(model);

export default class CircuitDisplay extends React.Component {

    render() {
        return (<CanvasWidget
            engine={engine}
            className="diagram"
        />);
    }

}