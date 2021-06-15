import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import axios from 'axios';

export default function ExpenseTable(props) {
    
    const classes = props.styles;
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);

    const url = "http://localhost:8080/";
    const token = localStorage.getItem("token");

    const history = useHistory();
    const columns = props.columns;
    const expenses = props.data;

    let { id } = useParams();
    if(id === undefined) {
        id = 0;
    }

    if(!token) {
        history.push("/login");
    }

    const deleteExpense = row => {        
        axios.delete(`${url}api/expenses/${id}`, {
            headers: {
                Authorization: "Bearer " + token
            }, data: {
                amount: row.amount,
                comment: row.comment,
                currency: row.currency,
                category: row.category,
                date: row.date,
            }
        })
        .then(response => {
            if(response.status === 401) {
                localStorage.removeItem("token");
                history.push("/login");
            }
        }, error => console.error(error));
    };
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper className={classes.root}>
            <div className={classes.buttons}>
                { props.group && <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    align="right"
                    onClick={() => {
                        history.push(`${id}/details`)
                    }}
                >
                    Group details
                </Button> }

                { props.add && <Button
                    variant="contained"
                    color="primary"
                    align="right"
                    onClick={() => {
                        console.log(id);
                        if(id) {
                            history.push(`${id}/add-expense`);
                        } else {
                            history.push(`/add-expense`);
                        }
                    }}
                >
                    New expense
                </Button> }
            </div>
            <Typography component="h2" variant="h6" color="black" align="right" gutterBottom>
                {props.title}
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
                                    { props.delete && 
                                    <DeleteForeverIcon
                                        className={classes.deleteButton}
                                        onClick={() => deleteExpense(row)}
                                    /> }
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>  
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[8]}
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