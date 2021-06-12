import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import CategorySummary from './CategorySummary';
import MonthSummary from './MonthSummary';

export default function Summary() {

    const history = useHistory();
    const token = localStorage.getItem("token");
    const url = "http://localhost:8080/";
    
    const [categories, setCategories] = useState();
    const [months, setMonths] = useState();

    useEffect(() => {
        getCategoriesAmount();
        getMonthlyAmount();
    }, []);
    
    const getCategoriesAmount = () => {
        axios.get(`${url}api/expenses/category`, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then((response) => {
            if(response.status === 401) {
                localStorage.removeItem("token");
                history.push("/login");
            }
            setCategories(response.data);
        }, error => console.error(error));
    };

    const getMonthlyAmount = () => {
        axios.get(`${url}api/expenses/monthly`, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then((response) => {
            if(response.status === 401) {
                localStorage.removeItem("token");
                history.push("/login");
            }
            setMonths(response.data);
        }, error => console.error(error));
    };


    if(categories === undefined || months === undefined) {
        return <></>
    }

    return (
        <>
            <MonthSummary data={months}/>
            <CategorySummary data={categories}/>;
        </>
    );
    
}
