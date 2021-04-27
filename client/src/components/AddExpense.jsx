import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 600,
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
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 240,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function AddExpense() {

    const classes = useStyles();

    const [amount, setAmount] = useState(0);
    const [comment, setComment] = useState('');
    const [currency, setCurrency] = useState('');
    const [category, setCategory] = useState('');
    
    const handleChangeCurrency = (event) => {
        setCurrency(event.target.value);
    };

    const handleChangeCategory = (event) => {
        setCategory(event.target.value);
    }

    const url = "http://localhost:8080/";

    const onSubmit = (event) => {
        let [month, day, year]    = new Date().toLocaleDateString().split("/")
        let [hour, minute, second] = new Date().toLocaleTimeString("pl-PL", { hour12: false }).split(/:| /)
        let date = `${day}/${month}/${year} ${hour}:${minute}:${second}`;

        axios.post(`${url}api/expenses/`, {
            amount: amount,
            comment: comment,
            currency: currency,
            category: category,
            date: date
        }, {
            headers: {
                Authorization: 'Bearer '
            }
        })
        .then((response) => {
            console.log(response);
        }, (error) => {
            console.log(error);
        });
    }

    return (
        <main className={classes.layout}>
            <Paper className={classes.paper}>
                <Typography variant="h6" gutterBottom>
                    Add expense
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="amount"
                            name="amount"
                            label="Amount"
                            fullWidth
                            autoComplete="amount"
                            onChange={(event) => setAmount(event.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="comment"
                            name="comment"
                            label="Comment"
                            fullWidth
                            autoComplete="comment"
                            onChange={(event) => setComment(event.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl required className={classes.formControl}>
                            <InputLabel id="currency">Currency</InputLabel>
                            <Select
                                required
                                labelId="currency-label"
                                id="currency"
                                value={currency}
                                onChange={handleChangeCurrency}
                            >
                                <MenuItem value={"USD"}>USD</MenuItem>
                                <MenuItem value={"CAD"}>CAD</MenuItem>
                                <MenuItem value={"PLN"}>PLN</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl required className={classes.formControl}>
                            <InputLabel id="category">Category</InputLabel>
                            <Select
                                labelId="category-label"
                                id="category"
                                value={category}
                                onChange={handleChangeCategory}
                            >
                                <MenuItem value={"Car"}>Car</MenuItem>
                                <MenuItem value={"Food"}>Food</MenuItem>
                                <MenuItem value={"Category3"}>Category 3</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <div className={classes.buttons}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onSubmit}
                        className={classes.button}
                    >
                        Submit
                    </Button>
                </div>
            </Paper>
        </main>
    );
}
