import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Navigation from './Navigation';
import Expenses from "./ExpensesTable";
import Login from "./Login";
import Register from "./Register";
import AddExpense from "./AddExpense";

export default function App() {
    return (
        <div>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/login">
                        <Login />
                    </Route>
                    <Route exact path="/register">
                        <Register />
                    </Route>
                    <Route exact path="/" >
                        <Navigation />
                        <Expenses />
                    </Route>
                    <Route exact path="/add-expense">
                        <Navigation />
                        <AddExpense />
                    </Route>
                </Switch>
            </BrowserRouter>
        </div>
    )
}
