import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 800,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
}));

export default function MyProfile() {
    
    const classes = useStyles();
    const history = useHistory();
    const url = "http://localhost:8080/";
    const token = localStorage.getItem("token");
    
    const [user, setUser] = useState({});
    const [open, setOpen] = useState(false);

    useEffect(() => {
        axios.get(`${url}api/me`, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then(response => {
            if(response.status === 401) {
                history.push("/login");
            }
            setUser(response.data);
        }, error => console.error(error));
    }, []);

    const ChangePasswordForm = () => {
        const [password, setPassword] = useState();
        const [passwordConfirm, setPasswordConfirm] = useState();

        const submit = () => {
            if(password !== passwordConfirm || password.length < 8) {
                return;
            }

            axios.post(`${url}api/changePassword`, {
                password: password,
            }, { 
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            .then(response => {
                if(response.status === 401) {
                    localStorage.removeItem("token")
                    history.push("/login");
                }
            }, error => console.error(error));
            
            setOpen(false);
        };

        return (
            <>
                <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Change password</DialogTitle>
                    <DialogContent>
                        <TextField
							autoFocus
                            type="password"
							margin="dense"
							id="password"
							label="New password"
							onChange={(event) => setPassword(event.target.value)}
							fullWidth
						/>
                        <TextField
							autoFocus
                            type="password"
							margin="dense"
							id="confirmPassword"
							label="Confirm new password"
							onChange={(event) => setPasswordConfirm(event.target.value)}
							fullWidth
						/>
                    </DialogContent>	
                    <DialogActions>
						<Button 
                            onClick={() => setOpen(false)} 
                            color="primary"
                        >
							Cancel
						</Button>
						<Button onClick={submit} color="primary">
							Submit
						</Button>
					</DialogActions>
                </Dialog>
            </>
        );
    }

    return (
        <main className={classes.layout}>
            <Paper className={classes.paper}>
                <Grid container spacing={3} align="right">
                    <Grid item xs={12}>    
                        <Typography variant="h6">
                            Username
                        </Typography>
                        <Typography variant="subtitle1">
                            {user.username}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Name
                        </Typography>
                        <Typography variant="subtitle1">
                            {user.firstname}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>    
                        <Typography variant="h6">
                            Last name
                        </Typography>
                        <Typography variant="subtitle1">
                            {user.lastname}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>    
                        <Typography variant="h6">
                            Email
                        </Typography>
                        <Typography variant="subtitle1">
                            {user.email}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setOpen(true)}
                        >
                            Change password
                        </Button>
                        <ChangePasswordForm />
                    </Grid>
                    
                </Grid>
            </Paper>
        </main>
    );
}