import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";
import {connect} from "react-redux";

class GameComponent extends React.Component {
    state = {
        errorMessage: ""
    }

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div style={{height: '500px'}}>
                <p>Game Component</p>
                <p>Hand: {JSON.stringify(this.props.hand)}</p>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        socket: state.socket,
        hand: state.hand
    }
}

export default connect(mapStateToProps)(withCookies(withRouter(GameComponent)))