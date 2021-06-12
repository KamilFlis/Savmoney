import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
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


export default function Group() {
    
    const classes = useStyles();
    const history = useHistory();
    const [groups, setGroups] = useState([]);
    const [open, setOpen] = useState(false);
    const url = "http://localhost:8080/";
    const token = localStorage.getItem("token");

    if(!token) {
        history.push("/login");
    }

    useEffect(() => {
        axios.get(`${url}api/groups/`, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then((response => {
            if(response.status === 401) {
                localStorage.removeItem("token");
                history.push("/login");
            }
            setGroups(response.data);
        }))
        .catch(error => console.error(`Error ${error}`));
    }, []);


	const NewGroupForm = () => {

		const [name, setName] = useState();
		const [description, setDescription] = useState();

		const handleClose = () => {
			setOpen(false);
		}

		const submit = () => {
			axios.post(`${url}api/groups/`, {
				name: name,
				description: description
			}, {
				headers: {
					Authorization: "Bearer " + token
				}	
			})

			handleClose();
		}

		return (
			<div>
				<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
					<DialogTitle id="form-dialog-title">Create new group</DialogTitle>
					<DialogContent>
						<TextField
							autoFocus
							margin="dense"
							id="name"
							label="Group name"
							onChange={(event) => setName(event.target.value)}
							fullWidth
						/>
						<TextField
							autoFocus
							margin="dense"
							id="description"
							label="Group description"
							onChange={(event) => setDescription(event.target.value)}
							fullWidth
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose} color="primary">
							Cancel
						</Button>
						<Button onClick={submit} color="primary">
							Create
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
                    New group
                </Button>
                <NewGroupForm />
            </div>
            <Typography component="h2" variant="h6" color="black" align="left" gutterBottom>
                Your groups
            </Typography>
            { groups.map((group) => {
                return (
					<div>
						<ListItem component={Link} to={`/groups/${group.id}`}
							alignImtex="flex-start">
							<ListItemAvatar>
								<Avatar alt="Group" src="/static/images/avatar/1.jpg" />
							</ListItemAvatar>
							<ListItemText
								primary={group.name}
								secondary={
									<React.Fragment>
										<Typography
											component="span"
											variant="body2"
											className={classes.inline}
											color="textPrimary"
										>
											{group.description}
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