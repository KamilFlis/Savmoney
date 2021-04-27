import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import axios from 'axios';

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

const useStyles = makeStyles({
    root: {
        position: 'fixed',
        bottom: 80,
        right: 80,
        width: '75%',
    },
    container: {
        height: 600,
    },
});

export default function ExpensesTable() {
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [expenses, setExpenses] = useState([]);
    const url = "http://localhost:8080/";

    useEffect(() => {
        getAllExpenses();
    }, []);
    
    const getAllExpenses = () => {
        axios.get(`${url}api/expenses/`, {
            headers: {
                Authorization: 'Bearer '
            }
        })
        .then((response) => {
            console.log(response)
            setExpenses(response.data);
        })
        .catch(error => console.error(`Error ${error}`));
    };

    console.log(expenses);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper className={classes.root}>
            <Typography component="h2" variant="h6" color="black" align="right" gutterBottom>
                Your expenses
            </Typography>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {expenses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format && typeof value === 'number' ? column.format(value) : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10]}
                component="div"
                count={expenses.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    );
}