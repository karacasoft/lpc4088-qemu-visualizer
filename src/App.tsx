
import { IconButton, makeStyles, Snackbar } from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import React, { useState } from 'react';
//import logo from './logo.svg';
import './App.css';
import LPC4088VisualizerAppBar from './AppBar';
import CircuitDisplay, { getEngine, getModel } from './Diagram';
import LPC4088VisualizerDrawer from './Drawer';
import MainPage from './MainPage';
import { loadModelFromFile } from './ElectronUtil/loadModel';
import { showSaveDialog } from './ElectronUtil/saveFileDialog';
import OptionsPage from './OptionsPage';

function App() {
  if(window.location.href.endsWith("?options=true")) {
    return <OptionsPage />;
  } else {
    return (
      <MainPage />
    );
  }
}

export default App;
