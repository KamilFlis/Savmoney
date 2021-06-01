import React from 'react';
import { Link, useHistory } from 'react-router-dom'
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import { ListItem, ListItemText } from '@material-ui/core';
import logo from '../logo.png';

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

export default function Sidebar() {

    const classes = useStyles();
    const history = useHistory();

    const data = ["Groups", "Reports", "Summary"];
    const endpoints = ["/groups", "/reports", "/summary"];
    
    const logoClick = () => {
        history.push("/");
    }

    return (
        <div>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.logo}>
                    <img src={logo} onClick={logoClick}/>
                </div>
                <div className={classes.drawerContainer}>
                    <List>
                        {data.map((text, index) => (
                            <ListItem component={Link} to={endpoints[index]} button key={text}>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>
        </div>
    );
}