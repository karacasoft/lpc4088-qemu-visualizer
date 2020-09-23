import * as React from 'react';
import { DiamondNodeModel } from './DiamondNodeModel';
import { DiagramEngine, PortModelAlignment, PortWidget } from '@projectstorm/react-diagrams';
import styled from '@emotion/styled';
import { css, jsx } from '@emotion/core'
import * as CSS from 'csstype';

export interface DiamondNodeWidgetProps {
	node: DiamondNodeModel;
	engine: DiagramEngine;
	size?: number;
}
/*
export declare namespace S {
	export const Port = styled.div`
		width: 16px;
		height: 16px;
		z-index: 10;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 8px;
		cursor: pointer;

		&:hover {
			background: rgba(0, 0, 0, 1);
		}
	`;
}
*/
/**
 * @author Dylan Vorster
 */
export class DiamondNodeWidget extends React.Component<DiamondNodeWidgetProps> {
	render() {
		return (
			<div
				className={'diamond-node'}
				style={{
					position: 'relative',
					width: 50,
					height: 50
				}}>
				<svg
					width={50}
					height={50}
					dangerouslySetInnerHTML={{
						__html:
							`
          <g id="Layer_1">
          </g>
          <g id="Layer_2">
            <polygon fill="mediumpurple" stroke="${
							this.props.node.isSelected() ? 'white' : '#000000'
						}" stroke-width="3" stroke-miterlimit="10" points="10,` +
							50 / 2 +
							` ` +
							50 / 2 +
							`,10 ` +
							(50 - 10) +
							`,` +
							50 / 2 +
							` ` +
							50 / 2 +
							`,` +
							(50 - 10) +
							` "/>
          </g>
        `
					}}
				/>
				<PortWidget
					style={{
						top: 50 / 2 - 8,
						left: -8,
						position: 'absolute'
					}}
					port={this.props.node.getPort(PortModelAlignment.LEFT)}
					engine={this.props.engine}>
					<div className={"DiamondPort"} />
				</PortWidget>
				<PortWidget
					style={{
						left: 50 / 2 - 8,
						top: -8,
						position: 'absolute'
					}}
					port={this.props.node.getPort(PortModelAlignment.TOP)}
					engine={this.props.engine}>
					<div className={"DiamondPort"} />
				</PortWidget>
				<PortWidget
					style={{
						left: 50 - 8,
						top: 50 / 2 - 8,
						position: 'absolute'
					}}
					port={this.props.node.getPort(PortModelAlignment.RIGHT)}
					engine={this.props.engine}>
					<div className={"DiamondPort"} />
				</PortWidget>

			</div>
		);
	}
}

/*
				<PortWidget
					style={{
						left: 50 / 2 - 8,
						top: 50 - 8,
						position: 'absolute'
					}}
					port={this.props.node.getPort(PortModelAlignment.BOTTOM)}
					engine={this.props.engine}>
					<div className={"DiamondPort"} />
				</PortWidget>
*/