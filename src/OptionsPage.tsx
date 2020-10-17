import { AppBar, makeStyles, Tab, Tabs } from '@material-ui/core';
import React, { useState } from 'react';
import ExecutableFileSelector from './OptionsPages/ExecutableFileSelector';

const useStyles = makeStyles(theme => ({
    root: {
      display: "flex",
      flexFlow: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    },
    tab: {
        display: "flex",
        alignItems: "center",
        flexGrow: 1,
    }
  }));

function OptionsPage() {
    window.onbeforeunload = (e: BeforeUnloadEvent) => { 
        e.returnValue = false;
    };
    
    const classes = useStyles();
    const [ currentTab, setCurrentTab ] = useState(0);

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
                    <ExecutableFileSelector /> :
                    null
            }
        </div>
    </div>);
}

export default OptionsPage;