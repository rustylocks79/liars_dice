import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";


class GameComponent extends React.Component {
    render() {
        return (
            <div>
                <p>Game Component</p>
            </div>
        );
    }
}

export default withCookies(withRouter(GameComponent))