import React from 'react';
import { Link } from 'react-router-dom'
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import { ListItem, ListItemText } from '@material-ui/core';
import logo from '../logo.jpg';

const drawerWidth = 240;

const useStyles = makeStyles(() => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    backgroundColor: '#3F51B5',
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
    color: 'white',
  },
  logo: {
      marginTop: 10,
      marginLeft: 20,
  },
}));

export default function Navbar() {

    const classes = useStyles();

    const data = ['Add expense', 'Reports', 'Summary'];
    // const logo = require('');

    return (
        <div>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                {/*<Toolbar/>*/}
                <div className={classes.logo}>
                    <img src={logo}/>
                </div>
                {/*<Toolbar/>*/}
                <div className={classes.drawerContainer}>
                    <List>
                        {data.map((text, index) => (
                            <ListItem component={Link} to={"/add-expense"} button key={text}>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>
        </div>
    );
}