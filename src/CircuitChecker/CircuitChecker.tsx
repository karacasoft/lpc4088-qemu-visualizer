import { Button, Grid, TextField } from '@material-ui/core';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { getEngine, getModel } from '../Diagram';
import PeripheralNodeModel from '../Nodes/PeripheralNodeModel';
import CircuitCheckerRuleset from './CircuitCheckerRuleset';
import CircuitSimulator from '../CircuitSimulator';
import { DiagramListener } from '@projectstorm/react-diagrams';

interface CircuitCheckerProps {

}

interface CircuitCheckerState {
    rulesFile: string;
    studentListFile: string;
    diagramDirectory: string;
}

type FileDropProps = React.PropsWithChildren<{ onDrop: (acceptedFiles: File[]) => void }>

function FileDrop({ children, onDrop }: FileDropProps) {
    const onDropFile = useCallback(acceptedFiles => {
        onDrop(acceptedFiles);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: onDropFile, noClick: true });

    return <div {...getRootProps()}>
        <input {...getInputProps()} />
        {children}
    </div>;
}

export default class CircuitChecker extends React.Component<CircuitCheckerProps, CircuitCheckerState> {

    constructor(props: CircuitCheckerProps) {
        super(props);
        this.state = {
            rulesFile: "",
            studentListFile: "",
            diagramDirectory: "",
        };
        this.onDropRulesFile = this.onDropRulesFile.bind(this);
        this.onDropStudentListFile = this.onDropStudentListFile.bind(this);
        this.onDropDiagramDirectory = this.onDropDiagramDirectory.bind(this);

        this.checkAllCircuits = this.checkAllCircuits.bind(this);
    }

    onDropRulesFile(files: File[]) {
        if(files.length > 0) {
            this.setState({
                rulesFile: resolve(files[0].path, ".."),
            });
        }
    }

    onDropStudentListFile(files: File[]) {
        if(files.length === 1) {
            this.setState({
                studentListFile: files[0].path,
            });
        }
    }

    onDropDiagramDirectory(files: File[]) {
        if(files.length > 0) {
            this.setState({
                diagramDirectory: resolve(files[0].path, ".."),
            });
        }
    }

    async checkAllCircuits() {
        const st_list_file_contents = readFileSync(this.state.studentListFile);
        const st_list = st_list_file_contents.toString("utf8").trim().split("\n");

        const process_st = async (st: string) => {
            return new Promise((r, reject) => {
                PeripheralNodeModel.chips = [];
                PeripheralNodeModel.all_peripherals = [];
                const rule_file = resolve(this.state.rulesFile, `${st}.txt`);
                const circuit_file = resolve(this.state.diagramDirectory, `${st}.lpc-vcf`);
    
                const ruleset = CircuitCheckerRuleset.fromFile(rule_file);
                const cf_contents = readFileSync(circuit_file);
                getModel().deserializeModel(JSON.parse(cf_contents.toString("utf8")), getEngine());
                
                setTimeout(() => {
                    // Gather all chip ports
                    let chip_pins = [];
                    for (let chip of PeripheralNodeModel.chips) {
                        let ports = chip.getInPorts();
                        for (let port of ports) {
                            chip_pins.push(port);
                        }
                    }
    
                    for (let i = 0; i < chip_pins.length; i++) {
                        let links = chip_pins[i].getLinks();
                        for (let link of Object.values(links)) {
                            if (link.getSourcePort() !== null && link.getTargetPort() !== null) {
                                ruleset.checkPin(link, chip_pins[i].getNode() as PeripheralNodeModel);
                            }
                        }
                    }
    
                    console.log(ruleset.results);
                    r();
                }, 1000);
                
            });
        }
        for(const st of st_list) {
            await process_st(st);
        }
    }

    render() {
        return <Grid container direction="column" alignItems="stretch">
            <FileDrop onDrop={this.onDropRulesFile}>
                <Grid item>
                    <TextField label="Rules Directory" value={this.state.rulesFile} />
                </Grid>
            </FileDrop>
            <FileDrop onDrop={this.onDropStudentListFile}>
                <Grid item>
                    <TextField label="Student List File" value={this.state.studentListFile} />
                </Grid>
            </FileDrop>
            <FileDrop onDrop={this.onDropDiagramDirectory}>
                <Grid item>
                    <TextField label="Circuit File Directory" value={this.state.diagramDirectory} />
                </Grid>
            </FileDrop>
            <Button variant="contained"
                    color="primary"
                    onClick={this.checkAllCircuits}>
                Check
            </Button>
        </Grid>;
    }
}