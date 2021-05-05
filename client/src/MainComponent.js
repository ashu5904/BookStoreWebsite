import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import Home from './Component/Home';

function Main(){

    return(
        <>
            <Route exact path="/" component={() => <Home />} />
            <Redirect to="/" />
        </>
    )
}

export default Main;