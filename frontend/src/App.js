import React from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {CookiesProvider} from "react-cookie"
import LoginComponent from "./components/LoginComponent"
import SignupComponent from "./components/SignupComponent"
import WelcomeComponent from "./components/WelcomeComponent"
import ProfileComponent from "./components/ProfileComponent"
import LobbyComponent from "./components/LobbyComponent"
import JoinGameComponent from "./components/JoinGameComponent"
import {connect} from 'react-redux'

import 'fontsource-roboto';
import GameScreenComponent from "./components/GameScreenComponent";
import PromotionalMainComponent from "./components/PromotionalWebsite/PromotionalMainComponent";
import PromotionalAboutComponent from "./components/PromotionalWebsite/PromotionalAboutComponent";
import PromotionalDocumentationComponent from "./components/PromotionalWebsite/PromotionalDocumentationComponent";
import PromotionalSupportComponent from "./components/PromotionalWebsite/PromotionalSupportComponent";

function App() {
    return (
        <div className="App">
            <CookiesProvider>
                <BrowserRouter>
                    <Switch>
                        {/*<Route path={"/"} exact component={IndexComponent}/>*/}
                        {/*<Route path={"/login"} exact component={LoginComponent}/>*/}

                        {/*<Route path={"/"} exact component={LoginComponent}/>*/}

                        {/*<Route path={"/signup"} exact component={SignupComponent}/>*/}
                        {/*<Route path={"/profile"} exact component={ProfileComponent}/>*/}
                        {/*<Route path={"/welcome"} exact component={WelcomeComponent}/>*/}
                        {/*<Route path={"/lobby"} exact component={LobbyComponent}/>*/}
                        {/*<Route path={"/joingame"} exact component={JoinGameComponent}/>*/}
                        {/*<Route path={"/game"} exact component={GameScreenComponent}/>*/}


                        <Route path={"/"} exact component={PromotionalMainComponent}/>
                        <Route path={"/about"} exact component={PromotionalAboutComponent}/>
                        <Route path={"/documentation"} exact component={PromotionalDocumentationComponent}/>
                        <Route path={"/support"} exact component={PromotionalSupportComponent}/>

                        <Route path={"/game/login"} exact component={LoginComponent}/>
                        <Route path={"/game/signup"} exact component={SignupComponent}/>
                        <Route path={"/game/profile"} exact component={ProfileComponent}/>
                        <Route path={"/game/welcome"} exact component={WelcomeComponent}/>
                        <Route path={"/game/lobby"} exact component={LobbyComponent}/>
                        <Route path={"/game/join"} exact component={JoinGameComponent}/>
                        <Route path={"/game/play"} exact component={GameScreenComponent}/>
                    </Switch>
                </BrowserRouter>
            </CookiesProvider>
        </div>
    );
}

const mapStateToProps = state => {
    return {testStrings: state.testStrings}
}

export default connect(mapStateToProps)(App)

//export default App;