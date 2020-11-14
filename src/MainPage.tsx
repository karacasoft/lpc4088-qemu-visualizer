
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, Snackbar } from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import React, { useState } from 'react';
//import logo from './logo.svg';
import './App.css';
import LPC4088VisualizerAppBar from './AppBar';
import CircuitDisplay, { getEngine, getModel } from './Diagram';
import LPC4088VisualizerDrawer from './Drawer';
import { loadModelFromFile } from './ElectronUtil/loadModel';
import { showSaveDialog } from './ElectronUtil/saveFileDialog';
import GroundNodeModel from './Nodes/GroundNodeModel';
import VoltageNodeModel from './Nodes/VoltageNodeModel';
import ResistanceNodeModel from './Nodes/ResistanceNodeModel';
import LEDNodeModel from './Nodes/LEDNodeModel';
import LDRNodeModel from './Nodes/LDRNodeModel';
import UltraSonicNodeModel from './Nodes/UltraSonicNodeModel';
import SwitchNodeModel from './Nodes/SwitchNodeModel';
import JoystickNodeModel from './Nodes/JoystickNodeModel';
import JunctionNodeModel from './Nodes/JunctionNodeModel';
import CircuitChecker from './CircuitChecker/CircuitChecker';
import PeripheralNodeModel from './Nodes/PeripheralNodeModel';

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexFlow: "column",
    height: "100%",
  },
}));

let _y = 15;
let _x = 150;

function addItem(id: string) {
  const X = _x - getModel().getOffsetX();
  const Y = _y - getModel().getOffsetY();
  if (id === "gnd") {
    let node = new GroundNodeModel(false, X, Y, getModel());
    getModel().addNode(node);
  }
  else if (id === "3v3") {
    let node = new VoltageNodeModel(false, X, Y, getModel(), 3.3);
    getModel().addNode(node);
  }
  else if (id === "r1000") {
    let node = new ResistanceNodeModel(false, X, Y, getModel(), 1000)
    getModel().addNode(node);
  }
  else if (id === "red1") {
    let node = new LEDNodeModel(true, false, X, Y, "R");
    getModel().addNode(node);
  }
  else if (id === "green1") {
    let node = new LEDNodeModel(true, false, X, Y, "G");
    getModel().addNode(node);
  }
  else if (id === "blue1") {
    let node = new LEDNodeModel(true, false, X, Y, "B");
    getModel().addNode(node);
  }
  else if (id === "ldr") {
    let node = new LDRNodeModel(false, X, Y, getModel());
    getModel().addNode(node);
  }
  else if (id === "ultrasonic") {
    let node = new UltraSonicNodeModel(false, X, Y, getModel());
    getModel().addNode(node);
  }
  else if (id === "joystick") {
    let node = new JoystickNodeModel(X, Y);
    getModel().addNode(node);
  }
  else if (id === "junction") {
    let node = new JunctionNodeModel(X, Y);
    getModel().addNode(node);
  }
  else if (id === "switch") {
    let node = new SwitchNodeModel(false, X, Y);
    getModel().addNode(node);
  }
  getEngine().repaintCanvas();
  _y = _y + 15;
  _x = _x + 15;
  if (_y > 600) {
    _y = 15;
  }
  if (_x > 600) {
    _x = 150;
  }
}

interface MainPageProps {
  enable_circuit_checker: boolean;
}

function MainPage({ enable_circuit_checker }: MainPageProps) {
  const [snackbarText, setSnackbarText] = useState<null | string>(null);
  const [exeFile, setExeFile] = useState<null | string>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [circuitCheckerOpen, setCircuitCheckerOpen] = useState(false);

  const classes = useStyles(); 

  const additionalMenuOptions = [];
  if(enable_circuit_checker) additionalMenuOptions.push("Circuit Checker");

  return (
    <div className={classes.root}>
      <LPC4088VisualizerAppBar
        onMenuIconClicked={() => setDrawerOpen(true)}
        onOptionsClicked={() => {}}
        onExportCircuitClicked={() => {
          showSaveDialog(JSON.stringify(getModel().serialize()), () => {
            setSnackbarText("Exported Successfully");
          });
        }}
        onImportCircuitClicked={() => {
          loadModelFromFile((data: string) => {
            PeripheralNodeModel.chips = [];
            PeripheralNodeModel.all_peripherals = [];
            getModel().deserializeModel(JSON.parse(data), getEngine());
            setSnackbarText("Imported Successfully");
          });
        }}
        additionalMenuOptions={additionalMenuOptions}
        onAdditionalMenuOptionClicked={(opt) => {
          if(opt === "Circuit Checker") setCircuitCheckerOpen(true);
        }}
      />
      <CircuitDisplay />
      <LPC4088VisualizerDrawer
        open={drawerOpen}
        onClickItem={(id) => {
            addItem(id);
        }}
        onClose={() => setDrawerOpen(false)}
      />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={Boolean(snackbarText)}
        autoHideDuration={5000}
        onClose={(ev, reason) => {
          if(reason === "clickaway") {
            return;
          }

          setSnackbarText(null);
        }}
        message={snackbarText}
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackbarText(null)}>
              <Close />
            </IconButton>
          </React.Fragment>
        }
        />
      <Dialog
        open={circuitCheckerOpen}>
          <DialogTitle>Circuit Checker</DialogTitle>
          <DialogContent>
            <CircuitChecker />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCircuitCheckerOpen(false)}>
              Close
            </Button>
          </DialogActions>
      </Dialog>
    </div>
  );
}

export default MainPage;
