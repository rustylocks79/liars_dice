import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";


class JoinGameComponent extends React.Component {
    render() {
        return (
            <div>
                <p>Join a game Component</p>
            </div>
        );
    }
}

export default withCookies(withRouter(JoinGameComponent))