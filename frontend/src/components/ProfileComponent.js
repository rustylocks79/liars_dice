import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";


class ProfileComponent extends React.Component {
    render() {
        return (
            <div>
                <p>Profile Component</p>
            </div>
        );
    }
}

export default withCookies(withRouter(ProfileComponent))