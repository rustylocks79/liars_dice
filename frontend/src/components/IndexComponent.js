import {withCookies} from "react-cookie";
import {Link, withRouter} from "react-router-dom";
import React from "react";

class IndexComponent extends React.Component {
    render() {
        return (
            <div>
                <p>Index Component</p>


                <Link to={"/login"}>Login Screen</Link> <br/>
                <Link to={"/signup"}>Signup Screen</Link> <br/>
                <Link to={"/welcome"}>Welcome Screen</Link> <br/>
                <Link to={"/profile"}>Profile Screen</Link> <br/>
                <Link to={"/joingame"}>Join Game Screen</Link> <br/>
                <Link to={"/lobby"}>Lobby Screen</Link> <br/>
                <Link to={"/game"}>Game Screen</Link> <br/>
            </div>
        );
    }
}

export default withCookies(withRouter(IndexComponent))