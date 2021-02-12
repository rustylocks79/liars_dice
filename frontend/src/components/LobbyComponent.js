import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";


class LobbyComponent extends React.Component {
    render() {
        return (
            <div>
                <p>Lobby Component</p>
            </div>
        );
    }
}

export default withCookies(withRouter(LobbyComponent))