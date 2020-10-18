import { Button, Grid, IconButton } from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import React from 'react';

export type ButtonDirection = "up" | "down" | "left" | "right" | "center";

interface Props {
  onPressButton: (btn: ButtonDirection) => void;
  onReleaseButton: (btn: ButtonDirection) => void;
}

function Joystick({ onPressButton, onReleaseButton }: Props) {

  return (
    <Grid direction="column" alignItems="center" container>
      <Grid item xs>
        <IconButton onMouseDown={() => onPressButton("up")}
            onMouseUp={() => onReleaseButton("up")}>
          <ArrowUpwardIcon />
        </IconButton>
      </Grid>
      <Grid item>
        <Grid container>
          <Grid item>
            <IconButton onMouseDown={() => onPressButton("left")}
                onMouseUp={() => onReleaseButton("left")}>
              <ArrowBackIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton onMouseDown={() => onPressButton("center")}
                onMouseUp={() => onReleaseButton("center")}>
              <FiberManualRecordIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton onMouseDown={() => onPressButton("right")}
                onMouseUp={() => onReleaseButton("right")}>
              <ArrowForwardIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <IconButton onMouseDown={() => onPressButton("down")}
            onMouseUp={() => onReleaseButton("down")}>
          <ArrowDownwardIcon />
        </IconButton>
      </Grid>
    </Grid>
  )

}

export default Joystick;