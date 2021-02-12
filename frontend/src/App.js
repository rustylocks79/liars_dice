import React from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {CookiesProvider} from "react-cookie"
import IndexComponent from "./components/IndexComponent"
import LoginComponent from "./components/LoginComponent"

function App() {
    return (
        <div className="App">
            <CookiesProvider>
                <BrowserRouter>
                    <Switch>
                        <Route path={"/"} exact component={IndexComponent}/>
                        <Route path={"/login"} exact component={LoginComponent}/>
                    </Switch>
                </BrowserRouter>
            </CookiesProvider>
        </div>
    );
}

export default App;
