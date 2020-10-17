import { Button, makeStyles, Typography } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ipcRenderer } from 'electron';

const useStyles = makeStyles(theme => ({
    dropzone: {
        width: "100%",
        height: "100%",
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

    return (<div {...getRootProps()} className={classes.dropzone}>
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
        <Button onClick={(ev) => {
            if(!isRunning) {
                ipcRenderer.send('start-exec');
            } else {
                ipcRenderer.send('stop-exec');
            }
            setUnknown(true);
            ev.stopPropagation();
        }}
        disabled={isUnknown}
        >{isRunning ? "Stop" : "Execute"}</Button>
    </div>);
}

export default ExecutableFileSelector;