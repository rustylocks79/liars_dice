import React from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {CookiesProvider} from "react-cookie"
import IndexComponent from "./components/IndexComponent"
import LoginComponent from "./components/LoginComponent"
import SignupComponent from "./components/SignupComponent"
import WelcomeComponent from "./components/WelcomeComponent"
import ProfileComponent from "./components/ProfileComponent"
import LobbyComponent from "./components/LobbyComponent"
import JoinGameComponent from "./components/JoinGameComponent"
import GameComponent from "./components/GameComponent"

function App() {
    return (
        <div className="App">
            <CookiesProvider>
                <BrowserRouter>
                    <Switch>
                        <Route path={"/"} exact component={IndexComponent}/>
                        <Route path={"/login"} exact component={LoginComponent}/>
                        <Route path={"/signup"} exact component={SignupComponent}/>
                        <Route path={"/profile"} exact component={ProfileComponent}/>
                        <Route path={"/welcome"} exact component={WelcomeComponent}/>
                        <Route path={"/lobby"} exact component={LobbyComponent}/>
                        <Route path={"/joingame"} exact component={JoinGameComponent}/>
                        <Route path={"/game"} exact component={GameComponent}/>
                    </Switch>
                </BrowserRouter>
            </CookiesProvider>
        </div>
    );
}

export default App;
