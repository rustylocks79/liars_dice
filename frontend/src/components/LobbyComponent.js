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
        players: [], // player = {name: string}
        bots: [],
        botNames: ["BOT_Aarron", "BOT_Ace", "BOT_Bailee", "BOT_Buddy", "BOT_Chad", "BOT_Charles",
            "BOT_James", "BOT_Robert", "BOT_Patricia", "BOT_Barbara"],
        usedNames: []
    }

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state.jwtToken = cookies.get('JWT-TOKEN')
        this.props.socket.on('joined_game', data => {
            console.log('received event joined_game from server' + JSON.stringify(data))
            this.setState({players: data.players})
        })
    }

    componentDidMount() {
        AuthService.user(this.state.jwtToken).then((res) => {
            this.setState({username: res.data.username})

            //let player = name: res.data.username
            this.state.players.push(res.data.username)
            this.setState({})
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
        if ((this.state.players.length + this.state.bots.length) < 10) {
            let nameSelected = false
            while (!nameSelected) {
                let idx = Math.floor(Math.random() * this.state.botNames.length);
                if (!this.state.usedNames.includes(this.state.botNames[idx])) {
                    let bot = {name: this.state.botNames[idx]}
                    this.state.bots.push(bot)
                    this.state.usedNames.push(this.state.botNames[idx])
                    nameSelected = true;
                    this.setState({})
                }
            }
        }
    }

    removeBot = (name) => {
        // remove bot
        for (let i = 0; i < this.state.bots.length; i++) {
            if (this.state.bots[i].name === name) {
                this.state.bots.splice(i, 1)
            }
        }

        //remove name from used list
        for (let i = 0; i < this.state.usedNames.length; i++) {
            if (this.state.usedNames[i] === name) {
                this.state.usedNames.splice(i, 1)
            }
        }

        this.setState({})
    }

    clearBots = () => {
        //let newPlayerList = this.state.players.filter(function (player) {return !player.bot})
        this.setState({bots: []})
        this.setState({usedNames: []})
    }

    displayPlayers = () => {
        return (
            <div>
                {this.state.players.map(player => (
                    <div key={player}>
                        <p>
                            {player}
                        </p>
                    </div>
                ))}
                {this.state.bots.map(bot => (
                    <div key={bot.name}>
                        <p>
                            <button onClick={() => this.removeBot(bot.name)}>x</button>
                            {bot.name}
                        </p>
                    </div>
                ))}
            </div>
        )
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
                            {this.displayPlayers()}
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

                <br/>

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