import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";


class LoginComponent extends React.Component {
    render() {
        return (
            <div>
                <p>Login Component</p>
            </div>
        );
    }
}

export default withCookies(withRouter(LoginComponent))