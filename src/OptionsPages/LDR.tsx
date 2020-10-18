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

function LDR({ value, onValueChange }: Props) {
    const classes = useStyles();
    return (
        <Grid container direction="column" className={classes.root}>
            <Grid item xs>
                <Typography component="span">Light Intensity</Typography>
            </Grid>
            <Grid item xs>
                <Slider value={value}
                        onChange={(ev, new_val) => onValueChange(new_val as number)}
                        valueLabelDisplay="auto" 
                        />
                
            </Grid>
            <Grid item xs>
                <Typography variant="caption">
                    All simulated light detecting resistors(LDRs) will much light. Slide left for low, right for high light intensity.
                </Typography>
            </Grid>
        </Grid>
    );
}

export default LDR;