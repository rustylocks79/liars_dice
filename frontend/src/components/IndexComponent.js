import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";


class IndexComponent extends React.Component {
    render() {
        return (
            <div>
                <p>Hello World</p>
            </div>
        );
    }
}

export default withCookies(withRouter(IndexComponent))