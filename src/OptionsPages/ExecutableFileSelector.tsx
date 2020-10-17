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

function ExecutableFileSelector() {
    const classes = useStyles();
    const [isRunning, setRunning] = useState(false);
    const [isUnknown, setUnknown] = useState(false);

    const [ipcInitialized, setIpcInitialized] = useState(false);

    const [file, setFile] = useState<string|null>(null);

    const onDrop = useCallback(acceptedFiles => {
        if(acceptedFiles.length > 1) {
            // TODO error
        } else {
            setFile(acceptedFiles[0].path);
            ipcRenderer.send('exec-file-select', acceptedFiles[0].path);
        }
    }, []); 

    if(!ipcInitialized) {
        ipcRenderer.on('exec-started', () => {
            setRunning(true);
            setUnknown(false);
        });

        ipcRenderer.on('exec-stopped', () => {
            setRunning(false);
            setUnknown(false);
        });

        ipcRenderer.on('exec-start-failed', () => {
            setRunning(false);
            setUnknown(false);
        });
        setIpcInitialized(true);
    }

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
                <Button onClick={(ev) => {
                    if(!isRunning) {
                        ipcRenderer.send('start-exec');
                    } else {
                        ipcRenderer.send('stop-exec');
                    }
                    setUnknown(true);
                    ev.stopPropagation();
                }}
                variant="contained"
                disabled={isUnknown}
                >{isRunning ? "Stop" : "Execute"}</Button>
            </Grid>
        </Grid>);
}

export default ExecutableFileSelector;