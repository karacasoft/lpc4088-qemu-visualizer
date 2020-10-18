import { Button, Container, Grid, makeStyles, Typography } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ipcRenderer } from 'electron';

const useStyles = makeStyles(theme => ({
    dropzone: {
        height: 150,
        margin: theme.spacing(2),
        padding: theme.spacing(2),
        borderStyle: "dashed",
        borderWidth: 5,
        borderColor: "black",
    },
    dropzoneActive: {
        backgroundColor: theme.palette.primary.light,
    }
}));

interface Props {
    qemuRunning: boolean;
    qemuStateUnknown: boolean;
    file?: string;

    onFileSelect: (filePath: string) => void;
    onClickExecute: () => void;
}

function ExecutableFileSelector({ qemuRunning, qemuStateUnknown, file, onFileSelect, onClickExecute } : Props) {
    const classes = useStyles();
    
    const onDrop = useCallback(acceptedFiles => {
        if(acceptedFiles.length > 1) {
            // TODO error
        } else {
            onFileSelect(acceptedFiles[0].path);
        }
    }, []); 

    

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const dropzoneClasses = classes.dropzone + " " + (isDragActive ? classes.dropzoneActive : "");

    return (
        <Grid container>
            <Grid item xs={12}>
                <div {...getRootProps()} className={dropzoneClasses}>
                    <input {...getInputProps()} />
                    {
                        isDragActive ?
                            <Typography>Drop your executable file here...</Typography> :
                            <Typography>Drag and drop an executable file here...</Typography>
                    }
                    {
                        file ?
                            <Typography>Current file: {file}</Typography> :
                            null
                    }
                    
                </div>
            </Grid>
            <Grid item xs={12}>
                <Button onClick={onClickExecute}
                variant="contained"
                color="primary"
                disabled={qemuStateUnknown}
                >{qemuRunning ? "Stop" : "Execute"}</Button>
            </Grid>
        </Grid>);
}

export default ExecutableFileSelector;