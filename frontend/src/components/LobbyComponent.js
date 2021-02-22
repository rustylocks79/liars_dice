import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";
import {Button, TextField, Grid, Container, Typography} from "@material-ui/core";

//Reference for layout: https://stackoverflow.com/questions/50766693/how-to-center-a-component-in-material-ui-and-make-it-responsive

class LobbyComponent extends React.Component {
    render() {
        return (
            <div>
                <h3 align={"center"} style={{color: 'blue'}}>Lobby #1234</h3>

                <Container>
                    <Grid container>
                        <Grid item xs={7} container
                              spacing={0}
                              direction="column"
                              alignItems="center"
                              justify="center"
                              style={{minHeight: '10vh'}}
                        >
                            <h4>Players</h4>
                            <p>Player 1 (host)</p>
                            <p>Player 2</p>
                            <p>Player 3</p>
                            <p>Bot 1</p>
                            <Button variant="contained" color="secondary" size="small">
                                Add bot
                            </Button>
                        </Grid>
                        <Grid item xs={2} container
                              spacing={0}
                              direction="column"
                              alignItems="center"
                              justify="center"
                              style={{minHeight: '10vh'}}
                        >
                            <p>Number of Dice</p>

                            <button>
                                +
                            </button>
                            <p>4</p>
                            <button>
                                -
                            </button>
                        </Grid>
                    </Grid>

                </Container>

                <p></p>

                <div align={"center"}>
                    <Button variant="contained" color="default" href="/welcome">
                        Leave Lobby
                    </Button>
                    <Button variant="contained" color="primary">
                        Start Game
                    </Button>
                </div>

            </div>
        )
            ;
    }
}

export default withCookies(withRouter(LobbyComponent))