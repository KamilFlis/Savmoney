import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: '30%',
      position: 'center',
      top: 150,
      left: '25%',
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
  }));


export default function GroupDetails(props) {
    
    const classes = useStyles();
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [group, setGroup] = useState({});

    const url = "http://localhost:8080/";
    const { id } = useParams();

    const token = localStorage.getItem("token");
   
    useEffect(() => {
        getGroupDetails();
        getGroupUsers();
    }, []);
  
    const getGroupDetails = () => {
        axios.get(`${url}api/groups/${id}`, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then(response => {
            if(response.status === 401) {
                localStorage.removeItem("token");
                history.push("/login");
            }
            setGroup(response.data);
        }, error => console.error(error)); 
    };

    const getGroupUsers = () => {
        axios.get(`${url}api/groups/${id}/users`, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then(response => {
            if(response.status === 401) {
                localStorage.removeItem("token");
                history.push("/login");
            }
            setUsers(response.data);
        }, error => console.error(error));
    };

    const AddUserForm = () => {
		const [username, setUsername] = useState();

		const submit = () => {
			axios.put(`${url}api/groups/${id}/users/add`, {
				username: username
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
		}

		return (
			<div>
				<Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">Add user</DialogTitle>
					<DialogContent>
						<TextField
							autoFocus
							margin="dense"
							id="username"
							label="User's username"
							onChange={(event) => setUsername(event.target.value)}
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
							Add user
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);  
	}

    return (
        <List className={classes.root}>
            <div className={classes.buttons}>
                <Button
                    variant="contained"
                    color="primary"
                    align="right"
                    onClick={() => setOpen(true)}
                    className={classes.button}
                >
                    Add user
                </Button>
                <AddUserForm />
            </div>
            <Typography component="h2" variant="h6" color="black" align="left" gutterBottom>
                {`Name: ${group.name}`}
            </Typography>
            <Typography component="h2" variant="h6" color="black" align="left" gutterBottom>
                {`Description: ${group.description}`}
            </Typography>
            <Typography component="h2" variant="h6" color="black" align="left" gutterBottom>
                Users:
            </Typography>
            { users.map((user) => {
                return (
					<div>
						<ListItem alignItems="flex-start">
							<ListItemAvatar>
								<Avatar alt="User" />
							</ListItemAvatar>
							<ListItemText
								primary={user.username}
								secondary={
									<React.Fragment>
										<Typography
											component="span"
											variant="body2"
											className={classes.inline}
											color="textPrimary"
										>
										</Typography>
									</React.Fragment>
								}
							/>
						</ListItem>
						<Divider variant="inset" component="li" />
					</div>
            	)
			})}
        </List>
    );
}