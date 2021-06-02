import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Navigation from './Navigation';
import Expenses from "./ExpensesTable";
import Login from "./Login";
import Register from "./Register";
import AddExpense from "./AddExpense";
import Group from "./Group";
import GroupDetails from './GroupDetails';
import GroupExpensesTable from './GroupExpensesTable';
import Summary from './Summary';
import MyProfile from './MyProfile';

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
                    <Route exact path="/summary">
                        <Navigation />
                        <Summary />
                    </Route>
                    <Route exact path="/groups">
                        <Navigation />
                        <Group />
                    </Route>
                    <Route exact path="/groups/:id">
                        <Navigation />
                        <GroupExpensesTable />
                    </Route>
                    <Route exact path="/groups/:id/add-expense">
                        <Navigation />
                        <AddExpense />
                    </Route>
                    <Route exact path="/groups/:id/details">
                        <Navigation />
                        <GroupDetails />
                    </Route>
                    <Route exact path='/my-profile'>
                        <Navigation />
                        <MyProfile />
                    </Route>
                </Switch>
            </BrowserRouter>
        </div>
    )
}
