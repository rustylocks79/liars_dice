import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";


class SignupComponent extends React.Component {
    render() {
        return (
            <div>
                <p>Signup Component</p>
            </div>
        );
    }
}

export default withCookies(withRouter(SignupComponent))