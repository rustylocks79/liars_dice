import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";
import {TextField} from '@material-ui/core';
import {Button} from "@material-ui/core";


class JoinGameComponent extends React.Component {
    render() {
        return (
            <div>
                <h3 align={"center"} style={{color: 'red'}}>Join a game!</h3>
                <form align={"center"} noValidate autoComplete="off">
                    <TextField id="standard-basic" label="Lobby ID"/>
                </form>
                <p></p>
                <div align={"center"}>
                    <Button variant="contained" color="default" href="/welcome">
                        Cancel
                    </Button>
                    <Button variant="contained" color="secondary">
                        Join Game
                    </Button>
                </div>

            </div>
        )
            ;
    }
}

export default withCookies(withRouter(JoinGameComponent))