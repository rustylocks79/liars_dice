import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";
import {Button, Container, Grid, Typography} from "@material-ui/core";
import AuthService from "../Services/AuthService";
import TopBarComponent from "./TopBarComponent";
import socketIOClient from "socket.io-client";
import {connect} from "react-redux";

class WelcomeComponent extends React.Component {
    state = {
        jwtToken: "",
        username: "",
        errorMessage: "",
        socket: undefined, //storing the connection
        value: 'Welcome Component',
        postId: 2
    }

    constructor(props) {
        super(props);
        const {cookies} = props;
        try {
            if (process.env.NODE_ENV !== 'production') {
                this.state.socket = socketIOClient("http://127.0.0.1:5000")
            } else {
                this.state.socket = socketIOClient("http://146.186.64.130:8080")
            }
        } catch (e) {
            console.log(e)
        }
        this.state.jwtToken = cookies.get('JWT-TOKEN')
        this.state.socket.on("created_game", data => {
            console.log('Received created_game from server: ' + JSON.stringify(data))
            this.props.dispatch({
                type: 'CREATE_LOBBY',
                payload: {
                    lobbyId: data.lobbyId,
                    socket: this.state.socket,
                    players: data.players,
                    bots: [],
                    numDice: 5,
                    host: data.host
                }
            })
            this.props.history.push('/game/lobby');
        });
    }

    componentDidMount() {
        AuthService.user(this.state.jwtToken).then((res) => {
            this.setState({username: res.data.username})
        })
    }

    onCreateGame = (event) => {
        this.state.socket.emit('create_game', {'jwtToken': this.state.jwtToken});
    }

    onJoinGame = (event) => {
        this.props.dispatch({
            type: 'JOIN_LOBBY_SOCKET',
            payload: {socket: this.state.socket}
        })
        this.props.history.push('/game/join')
    }

    render() {
        return (
            <div>
                <TopBarComponent/>

                <Container fixed>
                    <Grid container spacing={2} style={{paddingTop: "5vh"}}>
                        <Grid item xs={6} style={{fontSize: "large"}}>
                            <h3 align={"center"}>Tutorial</h3>
                            <ul>
                                <li style={{marginBottom: "10px"}}>At the start of a game of Deceiver’s Dice, each
                                    player receives a number of between
                                    1 and 5
                                </li>
                                <li style={{marginBottom: "10px"}}>When a round begins, each player rolls their dice,
                                    resulting in a set of face values
                                    to be concealed from the other players
                                </li>
                                <li style={{marginBottom: "10px"}}>The player who goes first sets an initial bid: a
                                    guess consisting of a face value
                                    (between 2 and 6) and the quantity of that face value (greater than or equal to 1)
                                    that they think is present among all players’ hands
                                </li>
                                <li style={{marginBottom: "10px"}}>
                                    Turns proceed in a clockwise direction. On a player’s turn, they can either “raise”
                                    or “doubt” the bid
                                </li>
                                <li style={{marginBottom: "10px"}}>If the player chooses to raise the bid, they can
                                    either increase the quantity and
                                    set any face value or keep the same quantity and set a greater face value
                                </li>
                                <li style={{marginBottom: "10px"}}>If the player doubts the bid, all players reveal
                                    their dice; the number of dice that
                                    share the bid’s face value is counted. Any dice with a face value of 1 are also
                                    included in the count - 1s are wild. If this total equals or exceeds the bid’s
                                    quantity, the doubt is incorrect; the doubter loses a die. Otherwise, the doubt is
                                    correct; the player who set the bid loses a die. A player is eliminated if they lose
                                    their last die
                                </li>
                                <li style={{marginBottom: "10px"}}>Following a doubt, each player rolls again, obtaining
                                    a new set of face values and a
                                    new round begins, starting with the player who lost a die. If the player who lost
                                    the die was eliminated, then the next player starts the bidding
                                </li>
                                <li>The game continues until one player remains</li>
                            </ul>
                        </Grid>
                        <Grid container item xs={6}
                              direction="column"
                              justify="center"
                              alignItems="center"
                              spacing={10}>
                            <Grid item>
                                <Button onClick={this.onCreateGame} variant="contained" color="primary" size={"large"}
                                        style={{height: "10vh", width: "20vw"}}>
                                    Create Game
                                </Button>
                            </Grid>

                            <Grid item>
                                <Button onClick={this.onJoinGame} variant="contained" color="secondary" size={"large"}
                                        style={{height: "10vh", width: "20vw"}}>
                                    Join Game
                                </Button>
                            </Grid>

                            <Grid item>
                                <Button variant="contained" color="default" href={"/game/profile"} size={"large"}
                                        style={{height: "10vh", width: "20vw"}}>
                                    View Statistics
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {dispatch}
}

export default connect(mapDispatchToProps)(withCookies(withRouter(WelcomeComponent)))