import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";
import {Button, Container, Grid, Typography} from "@material-ui/core";
import AuthService from "../Services/AuthService";
import TopBarComponent from "./TopBarComponent";
import socketIOClient from "socket.io-client";

class WelcomeComponent extends React.Component {
    state = {
        jwtToken: "",
        username: "",
        errorMessage: ""
    }

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state.jwtToken = cookies.get('JWT-TOKEN')
    }

    CreateLobby = (event) => {
        const socket = socketIOClient("http://127.0.0.1:5000");
        socket.emit('message', "Hi");
    }

    componentDidMount() {
        AuthService.user(this.state.jwtToken).then((res) => {
            this.setState({username: res.data.username})
        })
    }

    logout = (event) => {
        const {cookies} = this.props;
        cookies.remove('JWT-TOKEN');
        this.props.history.push('/login')
    }

    render() {
        return (
            <div>
                <TopBarComponent/>

                <Container fixed>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <h4 align={"center"}>Tutorial</h4>
                        </Grid>
                        <Grid item xs={6}/>
                        <Grid item xs={6}>
                            <Typography paragraph={true} align={"justify"}>
                                At the start of a game of Liar’s Dice, each player is given between 1 and 5
                                dice.<br/><br/>
                                Now each game of Liar’s Dice consists of multiple rounds.<br/><br/>
                                A round starts with each player rolling their dice and concealing them from the other
                                players. One of the
                                players is chosen at random to start the first round.<br/><br/>
                                The player who goes first must set an initial bid. The bid must consist of a face
                                value (between 2 and 6) and a
                                quantity (greater than or equal to 1).<br/><br/>
                                The game proceeds in a clockwise direction.<br/><br/>
                                During a player’s turn they can either raise the previous bid or doubt the previous
                                bid. If the player chooses to raise the previous bid by choosing a face value and
                                quantity.<br/><br/>
                                For a raise to be valid the face value must be greater than the previous
                                bid’s face value and with equal quantity or a greater quantity.<br/><br/>
                                If the player doubts
                                the previous then all players reveal their dice. The number of dice with the face
                                value equal to the previous bid are added up. <br/><br/>
                                Additionally, any dice that rolls a 1 are included since 1 are wild. If there are
                                more than or exactly the number of dice
                                in play as the quantity then the player who doubted the bid losses a die.<br/><br/>
                                If there are less dice in play than the quantity of the previous bid then the player
                                who made the
                                previous bid loses a die.<br/><br/>
                                previous bid loses a die.<br/><br/>
                                The next round starts with the player who lost the die. If
                                the player who lost the die was eliminated then the next player starts the
                                bidding.
                            </Typography>
                        </Grid>
                        <Grid item xs={6} alignContent={"center"}>
                            <Button onClick={this.CreateLobby} variant="contained" color="primary" href={"/lobby"}>
                                Create Lobby
                            </Button>
                            <br/><br/>
                            <Button variant="contained" color="secondary" href={"/joingame"}>
                                Join Game
                            </Button>
                            <br/><br/>
                            <Button variant="contained" color="default" href={"/profile"}>
                                View Statistics
                            </Button>
                        </Grid>
                    </Grid>
                </Container>

                {/*<Container fixed>*/}
                {/*    <Grid container spacing={2}>*/}
                {/*        <Grid item xs={12}>*/}
                {/*            <h4 align={"center"}>Tutorial</h4>*/}
                {/*        </Grid>*/}
                {/*        <Grid item xs={6}>*/}
                {/*            <Typography paragraph={true} align={"center"}>*/}
                {/*                At the start of a game of Liar’s Dice, each player is given between 1 and 5 dice.*/}
                {/*                Now each game of Liar’s Dice consists of multiple rounds. A round starts with each*/}
                {/*                player rolling their dice and concealing them from the other players. One of the*/}
                {/*                players is chosen at random to start the first round. The player who goes first must*/}
                {/*                set an initial bid. The bid must consist of a face value (between 2 and 6) and a*/}
                {/*                quantity (greater than or equal to 1). The game proceeds in a clockwise direction.*/}
                {/*                During a player’s turn they can either raise the previous bid or doubt the previous*/}
                {/*                bid. If the player chooses to raise the previous bid by choosing a face value and*/}
                {/*                quantity. For a raise to be valid the face value must be greater than the previous*/}
                {/*                bid’s face value and with equal quantity or a greater quantity. If the player doubts*/}
                {/*                the previous then all players reveal their dice. The number of dice with the face*/}
                {/*                value equal to the previous bid are added up. Additionally, any dice that rolls a 1*/}
                {/*                are included since 1 are wild. If there are more than or exactly the number of dice*/}
                {/*                in play as the quantity then the player who doubted the bid losses a die. If there are*/}
                {/*                less dice in play than the quantity of the previous bid then the player who made the*/}
                {/*                previous bid loses a die. The next round starts with the player who lost the die. If*/}
                {/*                the player who lost the die was eliminated then the next player starts the bidding.*/}
                {/*            </Typography>*/}
                {/*        </Grid>*/}
                {/*        <Grid item xs={6}>*/}
                {/*            <Container maxWidth={"xs"}>*/}
                {/*                    <button>Create Lobby</button> <br/>*/}
                {/*                    <button>Join Lobby</button> <br/>*/}
                {/*                    <button>View Statistics</button>*/}
                {/*            </Container>*/}
                {/*        </Grid>*/}
                {/*    </Grid>*/}
                {/*</Container>*/}


            </div>
        );
    }
}

export default withCookies(withRouter(WelcomeComponent))