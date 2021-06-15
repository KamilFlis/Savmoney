import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import ExpenseTable from './ExpenseTable';

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'fixed',
        bottom: 80,
        left: 440,
        width: '30%',
        [theme.breakpoints.down('md')]: {
            position: 'relative',
            width: '65%',
            top: 30,
            left: 30,
            height: '70%',
        },
    },
    container: {
        height: 600,
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

export default function MonthSummary(props) {
    
    const classes = useStyles();
    const data = props.data;
    
    const columns = [
        {
            id: 'date',
            label: 'Date', 
            minWidth: 80,
            align: "center",
        },
        {
            id: 'amount',
            label: 'Amount',
            minWidth: 80,
            align: "center",
        },
    ];

    let monthlyExpenses = [];
    for(const [key, value] of Object.entries(data)) {
        monthlyExpenses.push({
            date: key,
            amount: value,  
        });
    }

    return <ExpenseTable styles={classes} columns={columns} data={monthlyExpenses} delete={false} add={false} title={"Monthly expenses"}/>

}