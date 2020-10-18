import { Grid, makeStyles, Slider, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing(2),
        padding: theme.spacing(2),
    },
}));

interface Props { 
    value: number;

    onValueChange: (new_val: number) => void;
}

function UltrasonicSensor({ value, onValueChange }: Props) {
    const classes = useStyles();
    return (
        <Grid container direction="column" className={classes.root}>
            <Grid item xs>
                <Typography component="span">Object distance</Typography><Typography variant="overline">(cm)</Typography>
            </Grid>
            <Grid item xs>
                <Slider value={value}
                        onChange={(ev, new_val) => onValueChange(new_val as number)}
                        valueLabelDisplay="auto" 
                        />
                
            </Grid>
            <Grid item xs>
                <Typography variant="caption">
                    The simulated ultrasonic sensor behave according to this given object distance.
                </Typography>
            </Grid>
        </Grid>
    );
}

export default UltrasonicSensor;