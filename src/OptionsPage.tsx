import { AppBar, makeStyles, Tab, Tabs } from '@material-ui/core';
import { ipcRenderer } from 'electron';
import React, { useState } from 'react';
import ExecutableFileSelector from './OptionsPages/ExecutableFileSelector';
import Joystick from './OptionsPages/Joystick';
import LDR from './OptionsPages/LDR';
import UARTCommunication from './OptionsPages/UARTCommunication';
import UltrasonicSensor from './OptionsPages/UltrasonicSensor';

const useStyles = makeStyles(theme => ({
    root: {
      display: "flex",
      flexFlow: "column",
      justifyContent: "stretch",
      alignItems: "stretch",
      height: "100%",
    },
    tab: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
    }
  }));

function OptionsPage() {
    const classes = useStyles();
    const [ currentTab, setCurrentTab ] = useState(0);

    // TAB 0
    const [isRunning, setRunning] = useState(false);
    const [isUnknown, setUnknown] = useState(false);
    const [ipcInitialized, setIpcInitialized] = useState(false);
    const [file, setFile] = useState<string|undefined>(undefined);
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


    // TAB 1
    const [objectDistance, setObjectDistance] = useState(20);

    // TAB 2
    const [lightIntensity, setLightIntensity] = useState(20);

    // TAB 3


    // TAB 4
    const [messages, setMessages] = useState<string>("");
    const [selectedUART, setSelectedUART] = useState(0);


    return (<div className={classes.root}>
        <AppBar position="static" color="default">
            <Tabs value={currentTab}
                    onChange={(event, idx) => { setCurrentTab(idx); }}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                >
                <Tab label="Executable file" />
                <Tab label="Ultrasonic Sensor" />
                <Tab label="LDR" />
                <Tab label="Joystick" />
                <Tab label="UART Communication" />
            </Tabs>
        </AppBar>
        <div className={classes.tab}>
            {
                currentTab === 0 ?
                    <ExecutableFileSelector
                        qemuRunning={isRunning}
                        qemuStateUnknown={isUnknown}
                        file={file}
                        onFileSelect={(filePath) => {
                            setFile(filePath);
                            ipcRenderer.send('exec-file-select', filePath);
                        }}
                        onClickExecute={() => {
                            if(!isRunning) {
                                ipcRenderer.send('start-exec');
                            } else {
                                ipcRenderer.send('stop-exec');
                            }
                            setUnknown(true);
                        }}
                    /> :
                currentTab === 1 ?
                    <UltrasonicSensor value={objectDistance}
                            onValueChange={(new_val) => setObjectDistance(new_val)} /> :
                currentTab === 2 ?
                    <LDR value={lightIntensity}
                        onValueChange={(new_val) => setLightIntensity(new_val)} /> :
                currentTab === 3 ?
                    <Joystick onPressButton={(b) => {}}
                            onReleaseButton={(b) => {}} /> :
                currentTab === 4 ?
                    <UARTCommunication messages={messages}
                            selectedUART={selectedUART}
                            onSendMessage={(msg) => {}}
                            onSelectUART={(uart) => setSelectedUART(uart)} /> :
                    null

                        
            }
        </div>
    </div>);
}

export default OptionsPage;