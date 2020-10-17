
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



const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexFlow: "column",
    height: "100%",
  },
}));

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
            // TODO add item "id" into model
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
