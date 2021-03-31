import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";
import {connect} from "react-redux";

class GameComponent extends React.Component {
    state = {
        errorMessage: "",

        username: "",

        //TODO: I am really confused on how long is going to access this state in GameScreen. Perhaps it would be better to keep all of these in the store.

        //TODO: players and bots lists, or combine into one?
        //TODO: I really don't know. Do we want all players clumped together.
        players: [],

        //TODO: are these necessary, or would the store be enough
        currentPlayer: "",
        diceCounts: [],
        hand: [],

        //TODO: how are we storing bid?
        // [count, quantity]? two separate variables? custom class/struct?
        currentBid: "",
        bidOwner: ""
    }

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div style={{height: '500px'}}>
                <p>Game Component</p>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {dispatch}
}

const mapStateToProps = state => {
    return {
        socket: state.socket,
    }
}

export default connect(mapDispatchToProps, mapStateToProps)(withCookies(withRouter(GameComponent)))