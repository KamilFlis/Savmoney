import React from 'react';
import { Link, useHistory } from 'react-router-dom'
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import { ListItem, ListItemText } from '@material-ui/core';
import logo from '../assets/logo.png';
import logoMobile from '../assets/logoMobile.png';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        backgroundColor: '#3F51B5',
        width: drawerWidth,
        [theme.breakpoints.down('md')]: {
            width: '7ch',
        },
    },
    drawerContainer: {
        overflow: 'auto',
        color: 'white',
        [theme.breakpoints.down('md')]: {
            display: 'none',
        },
    },
    drawerContainerMobile: {
        overflow: 'auto',
        color: 'white',
        display: 'none',
        [theme.breakpoints.down('md')]: {
            display: 'block',
            margin: theme.spacing(1),
        },
    },
    logo: {
        marginTop: 10,
        marginLeft: 20,
        [theme.breakpoints.down('md')]: { 
            display: 'none'
        },
    },
    logoMobile: {
        marginTop: 7,
        marginLeft: 7,
        display: 'none',
        [theme.breakpoints.down('md')]: { 
            display: 'block'
        },     
    } 
}));

export default function Sidebar() {

    const classes = useStyles();
    const history = useHistory();

    const data = ["Groups", "Summary"];
    const dataMobile = ["G", "S"];
    const endpoints = ["/groups", "/summary"];
    
    const logoClick = () => {
        history.push("/");
    }

    return (
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div className={classes.logo}>
                <img src={logo} alt="logo" onClick={logoClick}/>
            </div>
            <div className={classes.logoMobile}>
                <img src={logoMobile} alt="logo" onClick={logoClick}/>
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
            <div className={classes.drawerContainerMobile}>
                <List>
                    {dataMobile.map((text, index) => (
                        <ListItem component={Link} to={endpoints[index]} button key={text}>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </div>
        </Drawer>

    );
}