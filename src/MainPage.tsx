
import { IconButton, makeStyles, Snackbar } from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import React, { useState } from 'react';
//import logo from './logo.svg';
import './App.css';
import LPC4088VisualizerAppBar from './AppBar';
import CircuitDisplay, { getEngine, getModel } from './Diagram';
import LPC4088VisualizerDrawer from './Drawer';
import { loadModelFromFile } from './ElectronUtil/loadModel';
import { showSaveDialog } from './ElectronUtil/saveFileDialog';
import { remote, BrowserWindow as BrowserWindowType, ipcRenderer } from 'electron';
import { QemuProcessInterface } from 'qemu-lpc4088-controller/dist/apprunner/qemu_runner';
import GroundNodeModel from './Nodes/GroundNodeModel';
import PeripheralNodeModel from './Nodes/PeripheralNodeModel';
import VoltageNodeModel from './Nodes/VoltageNodeModel';
import ResistanceNodeModel from './Nodes/ResistanceNodeModel';
import LEDNodeModel from './Nodes/LEDNodeModel';
import LDRNodeModel from './Nodes/LDRNodeModel';
import UltraSonicNodeModel from './Nodes/UltraSonicNodeModel';
import VoltagePotNodeModel from './Nodes/VoltagePotNodeModel';
import SwitchNodeModel from './Nodes/SwitchNodeModel';
import HandNodeModel from './Nodes/HandNodeModel';

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexFlow: "column",
    height: "100%",
  },
}));

let Y = 5;
let X = 5;

function addItem(id: string) {
  if (id === "gnd") {
    let node = new GroundNodeModel(false, X, Y, getModel());
    getModel().addNode(node);
    PeripheralNodeModel.all_peripherals.push(node);
  }
  else if (id === "3v3") {
    let node = new VoltageNodeModel(false, X, Y, getModel(), 3.3);
    getModel().addNode(node);
    PeripheralNodeModel.all_peripherals.push(node);
  }
  else if (id === "r1000") {
    let node = new ResistanceNodeModel(false, X, Y, getModel(), 1000)
    getModel().addNode(node);
    PeripheralNodeModel.all_peripherals.push(node);
  }
  else if (id === "red1") {
    let node = new LEDNodeModel(true, false, X, Y, getModel(), "R");
    getModel().addNode(node);
    PeripheralNodeModel.all_peripherals.push(node);
  }
  else if (id === "red2") {
    let node = new LEDNodeModel(false, false, X, Y, getModel(), "R");
    getModel().addNode(node);
    PeripheralNodeModel.all_peripherals.push(node);
  }
  else if (id === "green1") {
    let node = new LEDNodeModel(true, false, X, Y, getModel(), "G");
    getModel().addNode(node);
    PeripheralNodeModel.all_peripherals.push(node);
  }
  else if (id === "green2") {
    let node = new LEDNodeModel(false, false, X, Y, getModel(), "G");
    getModel().addNode(node);
    PeripheralNodeModel.all_peripherals.push(node);
  }
  else if (id === "blue1") {
    let node = new LEDNodeModel(true, false, X, Y, getModel(), "B");
    getModel().addNode(node);
    PeripheralNodeModel.all_peripherals.push(node);
  }
  else if (id === "blue2") {
    let node = new LEDNodeModel(false, false, X, Y, getModel(), "B");
    getModel().addNode(node);
    PeripheralNodeModel.all_peripherals.push(node);
  }
  else if (id === "ldr") {
    let node = new LDRNodeModel(false, X, Y, getModel());
    getModel().addNode(node);
    PeripheralNodeModel.all_peripherals.push(node);
  }
  else if (id === "ultrasonic") {
    let node = new UltraSonicNodeModel(false, X, Y, getModel());
    getModel().addNode(node);
    PeripheralNodeModel.all_peripherals.push(node);
  }
  else if (id === "connector") {
    let node = new VoltagePotNodeModel(false, X, Y, getModel());
    getModel().addNode(node);
    PeripheralNodeModel.all_peripherals.push(node);
  }
  else if (id === "switch") {
    let node = new SwitchNodeModel(false, X, Y, getModel());
    getModel().addNode(node);
    PeripheralNodeModel.all_peripherals.push(node);
  }
  else if (id === "in_sel_0") {
    let node = new HandNodeModel(0, false, X, Y, getModel());
    getModel().addNode(node);
    PeripheralNodeModel.all_peripherals.push(node);
  }
  else if (id === "in_sel_1") {
    let node = new HandNodeModel(1, false, X, Y, getModel());
    getModel().addNode(node);
    PeripheralNodeModel.all_peripherals.push(node);
  }
  Y = (Y + 5) % 100;
  Y = Y + 5;
}

let qemuInterface: QemuProcessInterface | null;

function MainPage() {
  const [snackbarText, setSnackbarText] = useState<null | string>(null);
  const [exeFile, setExeFile] = useState<null | string>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const classes = useStyles(); 
  return (
    <div className={classes.root}>
      <LPC4088VisualizerAppBar
        onMenuIconClicked={() => setDrawerOpen(true)}
        onOptionsClicked={() => {
          setSettingsOpen(true);
        }}
        onExportCircuitClicked={() => {
          showSaveDialog(JSON.stringify(getModel().serialize()), () => {
            setSnackbarText("Exported Successfully");
          });
        }}
        onImportCircuitClicked={() => {
          loadModelFromFile((data: string) => {
            getModel().deserializeModel(JSON.parse(data), getEngine());
            setSnackbarText("Imported Successfully");
          });
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
    </div>
  );
}

export default MainPage;
