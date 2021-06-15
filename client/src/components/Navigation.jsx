import React from 'react';
import { makeStyles } from '@material-ui/core';

import Sidebar from './Sidebar';
import Navbar from './Navbar';

const useStyles = makeStyles(() => ({
  root: {
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 100,
  },
}));

export default function Navigation() {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Sidebar />
            <Navbar />
        </div>
    );
}
