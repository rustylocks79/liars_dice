import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";
import {Button, TextField} from '@material-ui/core';
import TopBarComponent from "./TopBarComponent";
import {connect} from "react-redux";
import AuthService from "../Services/AuthService";


class JoinGameComponent extends React.Component {
    state = {
        jwtToken: "",
        username: "",
        errorMessage: "",
        targetLobby: ""
    }

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state.jwtToken = cookies.get('JWT-TOKEN')
    }

    componentDidMount() {
        AuthService.user(this.state.jwtToken).then((res) => {
            this.setState({username: res.data.username})
        })
    }

    handleInput = event => {
        this.setState({targetLobby: event.target.value});
    };

    onJoinGame = (event) => {
        console.log(this.state.targetLobby)
        // this.props.socket.emit('join_game', {
        //     lobbyId: this.props.lobbyId
        // });
    }


    render() {
        return (
            <div>
                <TopBarComponent/>

                <h3 align={"center"} style={{color: 'red'}}>Join a game!</h3>
                <div align={"center"}>
                    <form noValidate autoComplete="off" onChange={this.handleInput}>
                        <TextField id="lobbyField" label="Lobby ID"/>
                    </form>
                    <Button variant="contained" color="default" href="/welcome">
                        Cancel
                    </Button>
                    <Button variant="contained" color="secondary" onClick={this.onJoinGame}>
                        Join Game
                    </Button>
                </div>

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {lobbyId: state.lobbyId, socket: state.socket}
}

export default connect(mapStateToProps)(withCookies(withRouter(JoinGameComponent)))