import React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams';
import { GenerateWidgetEvent, GenerateModelEvent } from '@projectstorm/react-canvas-core';
import LEDNodeModel from '../Nodes/LEDNodeModel';
import LEDNodeWidget from './LEDNodeWidget';

export default class LEDNodeFactory extends AbstractReactFactory<LEDNodeModel, DiagramEngine> {
    constructor() {
        super('led');
    }

    generateReactWidget(event: GenerateWidgetEvent<LEDNodeModel>): JSX.Element {
        return <LEDNodeWidget node={event.model} engine={this.engine} />
    }

    generateModel(event: GenerateModelEvent) {
        return new LEDNodeModel(true, false, 0, 0, "red");
    }
}