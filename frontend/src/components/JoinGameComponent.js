import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";
import {Button, TextField} from '@material-ui/core';
import TopBarComponent from "./TopBarComponent";
import {connect} from "react-redux";


class JoinGameComponent extends React.Component {


    onJoinGame = (event) => {
        this.props.socket.emit('join_game', {
            lobbyId: this.props.lobbyId
        });
    }


    render() {
        return (
            <div>
                <TopBarComponent/>

                <h3 align={"center"} style={{color: 'red'}}>Join a game!</h3>
                <form align={"center"} noValidate autoComplete="off">
                    <TextField id="standard-basic" label="Lobby ID"/>
                </form>
                <div align={"center"}>
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

export default connect(mapStateToProps) (withCookies(withRouter(JoinGameComponent)))