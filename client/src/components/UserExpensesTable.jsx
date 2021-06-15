import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import ExpenseTable from './ExpenseTable';

import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'fixed',
        bottom: 80,
        right: 80,
        width: '75%',
        [theme.breakpoints.down('md')]: {
            width: '65%',
            right: 30,
            height: '75%',
        },
    },
    container: {
        height: 600,
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginRight: theme.spacing(2),
    },
    deleteButton: {
        marginTop: theme.spacing(2),
    }
}));


export default function UserExpensesTable() {

    const classes = useStyles();
    const [expenses, setExpenses] = useState([]);
    const url = "http://localhost:8080/";
    const token = localStorage.getItem("token");

    const history = useHistory();

    if(!token) {
        history.push("/login");
    }

    useEffect(() => {
        getAllExpenses();
    }, []);

    const getAllExpenses = () => {
        axios.get(`${url}api/expenses`, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then((response) => {
            if(response.status === 401) {
                localStorage.removeItem("token");
                history.push("/login");
            }
            setExpenses(response.data);
        })
        .catch(error =>  {
            console.error(error);
        });
    }

    const columns = [
        {
            id: 'amount',
            label: 'Amount', minWidth: 170,
            align: "center",
        },
        {
            id: 'currency',
            label: 'Currency',
            minWidth: 100,
            align: "center",
        },
        {
            id: 'comment',
            label: 'Comment',
            minWidth: 170,
            align: 'center',
        },
        {
            id: 'category',
            label: 'Category',
            minWidth: 170,
            align: 'center',
        },
        {
            id: 'date',
            label: 'Date',
            minWidth: 170,
            align: 'center',
        },
    ];


        return <ExpenseTable styles={classes} columns={columns} data={expenses} delete={true} add={true} title={"Your expenses"}/>

}