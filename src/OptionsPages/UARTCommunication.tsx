import { Button, FormControl, Grid, InputLabel, makeStyles, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    height: "100%",
  },
  messageBox: {
    flexGrow: 1,
    color: "#EEE",
    backgroundColor: "#333",
    whiteSpace: "pre-wrap",
    fontFamily: '"Courier New", Courier, monospace',
  },
  textFieldContainer: {
    padding: 6,
  },
  textField: {
    flexGrow: 1,
  },
}));

interface Props {
  messages: string;
  selectedUART: number;
  onSelectUART: (uart: number) => void;
  onSendMessage: (msg: string) => void;
}

function UARTCommunication({ messages, selectedUART, onSelectUART, onSendMessage }: Props) {
  const classes = useStyles();
  return (<Grid direction="column" container className={classes.root}>
    <Grid item className={classes.messageBox}>
      <Typography>
        {messages}
      </Typography>
    </Grid>
    <Grid item>
      <Grid container alignItems="flex-end" className={classes.textFieldContainer}>
        <Grid item>
          <FormControl>
            <InputLabel>UART</InputLabel>
            <Select
                value={selectedUART}
                onChange={(val) => {
                  onSelectUART(val.target.value as number);
                }}>
              <MenuItem value={0}>UART0</MenuItem>
              <MenuItem value={1}>UART1</MenuItem>
              <MenuItem value={2}>UART2</MenuItem>
              <MenuItem value={3}>UART3</MenuItem>
              <MenuItem value={4}>UART4</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item className={classes.textField}>
          <TextField label="Type text here" fullWidth />
        </Grid>
        <Grid item>
          <Button>Send</Button>
        </Grid>
      </Grid>
    </Grid>
  </Grid>)
}

export default UARTCommunication;