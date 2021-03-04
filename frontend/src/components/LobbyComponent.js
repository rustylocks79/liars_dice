import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";
import {Button, Container, Grid} from "@material-ui/core";
import TopBarComponent from "./TopBarComponent";
import AuthService from "../Services/AuthService";
import {connect} from "react-redux";


//Reference for layout: https://stackoverflow.com/questions/50766693/how-to-center-a-component-in-material-ui-and-make-it-responsive

//Reference for clicking + and - on number of dice: https://medium.com/@aghh1504/2-increment-and-decrease-number-onclick-react-5767b765103c

//Rendering array in React.js: https://www.youtube.com/watch?v=ke1pkMV44iU
class LobbyComponent extends React.Component {
    state = {
        jwtToken: "",
        username: "",
        errorMessage: "",
        numOfDice: 1,
        bots: [], //storing the bots
        botID: 1,
        numOfPlayers: 1,
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

    incrementDie = () => {
        if (this.state.numOfDice < 5) {
            this.setState({numOfDice: this.state.numOfDice + 1});
        }

    }

    decreaseDie = () => {
        if (this.state.numOfDice > 1) {
            this.setState({numOfDice: this.state.numOfDice - 1});
        }
    }

    addBot = () => {
        if (this.state.numOfPlayers < 10) {
            //increase the number of player by 1
            this.setState({numOfPlayers: this.state.numOfPlayers + 1});
            this.setState({botID: this.state.botID + 1});
            let bot
            // when there are already existing bots
            if (this.state.bots.length > 0) {
                bot = {"name": "bot", "id": this.state.botID}
            }
            //when no bot exists in the game
            else {
                //We set the botID to 2 to use it for the next bot.
                this.setState({botID: 2});
                bot = {"name": "bot", "id": 1}
            }

            this.state.bots.push(bot)
        }
    }

    removeBot = (index, currentID) => {
        if (index == this.state.bots.length - 1) {
            this.setState({botID: currentID})
        }
        this.setState({numOfPlayers: this.state.numOfPlayers - 1})
        this.state.bots.splice(index, 1)
    }

    clearBots = () => {
        this.setState({numOfPlayers: 1});
        this.setState({botID: 1});
        this.setState({bots: []});
    }

    displayBots = () => {
        return (

            <div color={"red"}>
                {this.state.bots.map(bot => (
                    <div>
                        <p>
                            <button onClick={() => this.removeBot(this.state.bots.indexOf(bot), bot.id)}>x</button>
                            {bot.name} {bot.id}
                        </p>
                    </div>
                ))}
            </div>
        );
    }

    onCreateGame = (event) => {
        this.props.socket.emit('start_game', {
            lobbyId: this.props.lobbyId,
            numDice: 0
        });
    }


    render() {
        return (

            <div>
                <TopBarComponent/>
                <h3 align={"center"} style={{color: 'blue'}}>Lobby #{this.props.lobbyId}</h3>

                <Container>
                    <Grid container>
                        <Grid item xs={7} container
                              spacing={0}
                              direction="column"
                              alignItems="center"
                              justify="flex-start"
                              style={{minHeight: '10vh'}}
                        >
                            <h4>Players</h4>
                            {this.state.username} (host)
                            {this.displayBots()}
                            <div>
                                <br/>
                                <Button onClick={this.clearBots} variant="contained" color="default" size="small">
                                    CLear Bots
                                </Button>
                                <Button onClick={this.addBot} variant="contained" color="secondary" size="small">
                                    Add Bot
                                </Button>
                            </div>
                        </Grid>
                        <Grid item xs={2} container
                              spacing={0}
                              direction="column"
                              alignItems="center"
                              justify="flex-start"
                              style={{minHeight: '10vh'}}
                        >
                            <h4>Number of Dice</h4>

                            <Button variant={"contained"} size="small" onClick={this.incrementDie}>
                                +
                            </Button>
                            <h3>{this.state.numOfDice}</h3>
                            <Button variant={"contained"} size="small" onClick={this.decreaseDie}>
                                -
                            </Button>
                        </Grid>
                    </Grid>

                </Container>

                <div align={"center"}>
                    <Button variant="contained" color="default" href="/welcome">
                        Leave Lobby
                    </Button>
                    <Button variant="contained" color="primary" onClick={this.onCreateGame}>
                        Start Game
                    </Button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {lobbyId: state.lobbyId, socket: state.socket}
}

export default connect(mapStateToProps)(withCookies(withRouter(LobbyComponent)))