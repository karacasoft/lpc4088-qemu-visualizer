import React from 'react';
import './App.css';
import MainPage from './MainPage';
import OptionsPage from './OptionsPage';
import AppConfig from './app.config';

const enable_circuit_checker = AppConfig.enable_circuit_checker;

function App() {
  if(window.location.href.endsWith("?options=true")) {
    return <OptionsPage />;
  } else {
    return (
      <MainPage enable_circuit_checker={enable_circuit_checker} />
    );
  }
}

export default App;
