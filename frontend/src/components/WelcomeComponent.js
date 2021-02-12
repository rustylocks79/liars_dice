import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";


class WelcomeComponent extends React.Component {
    render() {
        return (
            <div>
                <p>Welcome Component</p>
            </div>
        );
    }
}

export default withCookies(withRouter(WelcomeComponent))