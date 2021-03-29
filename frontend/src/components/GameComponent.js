import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";

class GameComponent extends React.Component {
    render() {
        return (
            <div style={{height: '500px'}}>
                <p>Game Component</p>
            </div>
        );
    }
}

export default withCookies(withRouter(GameComponent))