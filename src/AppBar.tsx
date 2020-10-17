import React from 'react';

import { AppBar, Button, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu'

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));

interface LPC4088VisualizerAppBarProps {
    onMenuIconClicked: () => void;
    onOptionsClicked: () => void;
};

function LPC4088VisualizerAppBar({ onMenuIconClicked, onOptionsClicked }: LPC4088VisualizerAppBarProps) {
    const classes = useStyles();

    return (<div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={onMenuIconClicked}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              LPC4088 Visualizer
            </Typography>
            <Button color="inherit" onClick={onOptionsClicked}>Options</Button>
          </Toolbar>
        </AppBar>
      </div>);
}

export default LPC4088VisualizerAppBar;