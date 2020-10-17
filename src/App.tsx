
import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
//import logo from './logo.svg';
import './App.css';
import LPC4088VisualizerAppBar from './AppBar';
import CircuitDisplay from './Diagram';
import LPC4088VisualizerDrawer from './Drawer';
import { showSaveDialog } from './SaveFileDialog/saveFileDialog';

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexFlow: "column",
    height: "100%",
  },
}));

function App() { 
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <LPC4088VisualizerAppBar
        onMenuIconClicked={() => setDrawerOpen(true)}
        onOptionsClicked={() => {
          setSettingsOpen(true);
          showSaveDialog("wow", () => {});
        }}
      />
      <CircuitDisplay />
      <LPC4088VisualizerDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}

export default App;
