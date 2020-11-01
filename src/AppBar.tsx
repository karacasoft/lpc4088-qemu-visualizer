import React, { useState } from 'react';

import { AppBar, Button, IconButton, makeStyles, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import MoreVert from '@material-ui/icons/MoreVert';

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    optionsButton: {
        marginLeft: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));

interface LPC4088VisualizerAppBarProps {
    onMenuIconClicked: () => void;
    onOptionsClicked: () => void;
    onExportCircuitClicked: () => void;
    onImportCircuitClicked: () => void;
};

function LPC4088VisualizerAppBar({ onMenuIconClicked, onOptionsClicked, onExportCircuitClicked, onImportCircuitClicked }: LPC4088VisualizerAppBarProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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
            <IconButton edge="end" className={classes.optionsButton} color="inherit" aria-label="options"
                    onClick={(event) => setAnchorEl(event.currentTarget)}>
                <MoreVert />
            </IconButton>
            <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}>
                <MenuItem onClick={() => { onExportCircuitClicked(); setAnchorEl(null); }}>Export Circuit</MenuItem>
                <MenuItem onClick={() => { onImportCircuitClicked(); setAnchorEl(null); }}>Import Circuit</MenuItem>
            </Menu>
                
          </Toolbar>
        </AppBar>
      </div>);
}

export default LPC4088VisualizerAppBar;