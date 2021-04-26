import {withCookies} from "react-cookie";
import {Link, withRouter} from "react-router-dom";
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
        this.props.socket.on("joined_game", data => {
            console.log('Received joined_game from server: ' + JSON.stringify(data))
            this.props.dispatch({
                type: 'JOIN_LOBBY_ID',
                payload: {
                    lobbyId: data.lobbyId,
                    players: data.players,
                    numDice: data.numDice,
                    host: data.host
                }
            })
            this.props.history.push('/game/lobby');
        });
        this.props.socket.on('error', data => {
            console.log('Received error from server: ' + JSON.stringify(data))
            this.setState({errorMessage: data.reason})
        })
    }

    componentDidMount() {
        AuthService.user(this.state.jwtToken).then((res) => {
            this.setState({username: res.data.username})
        })
    }

    handleInput = (event) => {
        this.setState({targetLobby: event.target.value});
    };

    onJoinGame = (event) => {
        this.props.socket.emit('join_game', {
            lobbyId: this.state.targetLobby,
            jwtToken: this.state.jwtToken
        });
    }

    render() {
        return (
            <div>
                <TopBarComponent/>

                {this.state.errorMessage && <h1>{this.state.errorMessage}</h1>}

                <h2 align={"center"}>Join a game!</h2>
                <div align={"center"}>
                    {/*<form noValidate autoComplete="off" onChange={this.handleInput} onSubmit={this.onJoinGame}>*/}
                    {/*    <TextField id="lobbyField" label="Lobby ID"/>*/}
                    {/*</form>*/}
                    <TextField id="lobbyField" label="Lobby ID" onChange={this.handleInput}
                               style={{marginBottom: "10px"}}/> <br/>

                    <Link to={"/game/welcome"} style={{textDecoration: 'none'}}>
                        <Button variant="contained" color="default" style={{marginRight: "5px"}}>
                            Cancel
                        </Button>
                    </Link>

                    <Button variant="contained" color="secondary" onClick={this.onJoinGame} style={{marginLeft: "5px"}}>
                        Join Game
                    </Button>
                </div>

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {socket: state.socket}
}

export default connect(mapStateToProps)(withCookies(withRouter(JoinGameComponent)))