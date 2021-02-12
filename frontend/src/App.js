import React from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {CookiesProvider} from "react-cookie"
import IndexComponent from "./components/IndexComponent"

function App() {
    return (
        <div className="App">
            <CookiesProvider>
                <BrowserRouter>
                    <Switch>
                        <Route path={"/"} exact component={IndexComponent}/>
                    </Switch>
                </BrowserRouter>
            </CookiesProvider>
        </div>
    );
}

export default App;
