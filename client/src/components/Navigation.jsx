import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
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
