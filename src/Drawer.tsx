import { Divider, Drawer, List, ListItem, ListItemText, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(theme => ({
    title: {
        margin: 16,
    }
}));

interface LPC4088VisualizerDrawerProps {
    open: boolean;
    onClickItem: (id: string) => void;
    onClose: () => void;
}

const list_options = [
    {
        id: "v_gnd_r",
        options: [
            { id: "gnd", text: "Ground (GND)" },
            { id: "3v3", text: "Voltage (3.3V)" },
            { id: "r1000", text: "Resistor (1000 Ω)"}
        ]
    },
    {
        id: "leds",
        options: [
            { id: "red1", text: "Red LED" },
            { id: "green1", text: "Green LED"},
            { id: "blue1", text: "Blue LED"},
        ]
    },
    {
        id: "misc",
        options: [
            { id: "ldr", text: "LDR" },
            { id: "ultrasonic", text: "Ultrasonic Sensor" },
            { id: "connector", text: "Connector" },
            { id: "switch", text: "Switch" },
            { id: "in_sel_0", text: "Select Input 0" },
            { id: "in_sel_1", text: "Select Input 1" },
        ]
    }
]

function LPC4088VisualizerDrawer({ open, onClickItem, onClose }: LPC4088VisualizerDrawerProps) {
    const classes = useStyles();
    return (
        <React.Fragment>
        <Drawer open={open} onClose={onClose}>
            <Typography variant="h5" className={classes.title}>
                Add a Component
            </Typography>
            <List>
                {
                    list_options.map(category => [
                        <Divider key={category.id + "-div"} />,
                        category.options.map((meta, index) => (
                            <ListItem button key={meta.id} onClick={() => onClickItem(meta.id)}>
                                <ListItemText primary={meta.text} /> 
                            </ListItem>
                        ))
                    ])
                }
            </List>
        </Drawer>
      </React.Fragment>
    );
}

export default LPC4088VisualizerDrawer;