import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";
import {Button, Container, FormControl, Grid, MenuItem, Select} from "@material-ui/core";
import TopBarComponent from "./TopBarComponent";
import {connect} from "react-redux";
import AuthService from "../Services/AuthService";


//Reference for layout: https://stackoverflow.com/questions/50766693/how-to-center-a-component-in-material-ui-and-make-it-responsive

//Reference for clicking + and - on number of dice: https://medium.com/@aghh1504/2-increment-and-decrease-number-onclick-react-5767b765103c

//Rendering array in React.js: https://www.youtube.com/watch?v=ke1pkMV44iU
class LobbyComponent extends React.Component {
    state = {
        jwtToken: "",
        username: "",
        errorMessage: "",
        numDice: 0,
        host: '',
        players: [], // player = {name: string}
        bots: [],
        botNames: ["BOT_Aaron", "BOT_Ace", "BOT_Bailee", "BOT_Buddy", "BOT_Chad", "BOT_Charles",
            "BOT_James", "BOT_Robert", "BOT_Patricia", "BOT_Barbara", "BOT_Jeremy"],
        usedNames: []
    }

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state.jwtToken = cookies.get('JWT-TOKEN')

        //redux stuff
        this.state.players = this.props.playersStore
        this.state.numDice = this.props.numDiceStore
        this.state.bots = this.props.botsStore
        this.state.host = this.props.hostStore

        this.props.socket.on('joined_game', data => {
            console.log('received event joined_game from server: ' + JSON.stringify(data))
            this.setState({
                players: data.players,
                bots: data.bots,
                numDice: data.numDice
            })
        })
        this.props.socket.on('updated_game', data => {
            console.log('received event updated_game from server: ' + JSON.stringify(data))
            this.setState({
                bots: data.bots,
                numDice: data.numDice
            })
        })
        this.props.socket.on('left_game', data => {
            console.log('received event left_game from server: ' + JSON.stringify(data))
            this.setState({
                players: data.players,
                host: data.host
            })
            if (data.lostPlayer === this.state.username) {
                this.props.history.push('/welcome')
            }
        })
        this.props.socket.on('started_game', data => {
            console.log('received event started_game from server: ' + JSON.stringify(data))
            this.props.dispatch({
                type: 'START_GAME',
                payload: {
                    index: data.index,
                    activeDice: data.activeDice,
                    currentPlayer: data.currentPlayer,
                    players: this.state.players,
                    bots: this.state.bots,
                    hand: data.hand
                }
            })
            this.props.history.push('/game')
        })
        this.props.socket.on('error', data => {
            console.log('received event error from server ' + JSON.stringify(data))
            this.setState({errorMessage: data['reason']})
        })
    }

    componentDidMount() {
        AuthService.user(this.state.jwtToken).then((res) => {
            this.setState({username: res.data.username})
        })
    }

    onStartGame = (event) => {
        this.props.socket.emit('start_game', {
            lobbyId: this.props.lobbyId,
            jwtToken: this.state.jwtToken
        });
    }

    onLeaveGame = (event) => {
        this.props.socket.emit('leave_game', {
            lobbyId: this.props.lobbyId,
            jwtToken: this.state.jwtToken
        })
    }

    updateGame = (numDice, bots) => {
        this.props.socket.emit('update_game', {
            lobbyId: this.props.lobbyId,
            jwtToken: this.state.jwtToken,
            bots: bots,
            numDice: numDice
        })
    }

    incrementDie = () => {
        this.updateGame(Math.min((this.state.numDice + 1), 5), this.state.bots)
    }

    decreaseDie = () => {
        this.updateGame(Math.max((this.state.numDice - 1), 1), this.state.bots)
    }

    addBot = () => {
        if ((this.state.players.length + this.state.bots.length) < 12) {
            let nameSelected = false
            while (!nameSelected) {
                let idx = Math.floor(Math.random() * this.state.botNames.length);
                if (!this.state.usedNames.includes(this.state.botNames[idx])) {
                    let bots = this.state.bots
                    let bot = {name: this.state.botNames[idx], level: "medium"}
                    bots.push(bot)
                    this.state.usedNames.push(this.state.botNames[idx])
                    nameSelected = true;
                    this.updateGame(this.state.numDice, bots)
                }
            }
        }
    }

    removeBot = (name) => {
        let bots = this.state.bots
        // remove bot
        for (let i = 0; i < bots.length; i++) {
            if (bots[i].name === name) {
                bots.splice(i, 1)
            }
        }

        //remove name from used list
        for (let i = 0; i < this.state.usedNames.length; i++) {
            if (this.state.usedNames[i] === name) {
                this.state.usedNames.splice(i, 1)
            }
        }
        this.updateGame(this.state.numDice, bots)
    }

    clearBots = () => {
        this.setState({usedNames: []})
        this.updateGame(this.state.numDice, [])
    }

    changeLevel = (event) => {
        let bots = this.state.bots
        for (let i = 0; i < bots.length; i++) {
            if (bots[i].name === event.target.name) {
                bots[i].level = event.target.value
            }
        }
        this.updateGame(this.state.numDice, bots)
    }

    displayPlayers = () => {
        return (
            <div>
                {this.state.errorMessage && <h1>{this.state.errorMessage}</h1>}
                {this.state.players.map(player => (
                    <div key={player}>
                        {player === this.state.host &&
                        <p style={{color: "maroon", fontWeight: "bold"}}>{player} (host)</p>
                        }

                        {player !== this.state.host &&
                        <p style={{color: "black"}}>{player}</p>
                        }
                    </div>
                ))}
                {this.state.bots.map(bot => (
                    <div key={bot.name}>

                            {this.state.username === this.state.host &&
                            <button onClick={() => this.removeBot(bot.name)} style={{marginRight: "10px"}}>x</button>
                            }

                            <p style={{display:"inline"}}>{bot.name}</p>

                            {this.state.username === this.state.host &&
                            <FormControl style={{marginLeft: "10px"}}>
                                <Select style={{width:"100px"}}
                                        value = {bot.level}
                                        name = {bot.name}
                                        onChange={this.changeLevel}
                                >
                                    <MenuItem value={"easy"}>Easy</MenuItem>
                                    <MenuItem value={"medium"}>Medium</MenuItem>
                                    <MenuItem value={"hard"}>Hard</MenuItem>
                                </Select>
                            </FormControl>
                            }

                            {this.state.username !== this.state.host &&
                            <b style={{display:"inline",marginLeft: "10px"}}>{bot.level}</b>
                            }

                    </div>
                ))}
            </div>
        )
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

                            {this.state.username === this.state.host &&
                            <div>
                                <br/>
                                <Button onClick={this.clearBots} variant="contained" color="default" size="small">
                                    CLear Bots
                                </Button>
                                <Button onClick={this.addBot} variant="contained" color="secondary" size="small">
                                    Add Bot
                                </Button>
                            </div>
                            }

                        </Grid>
                        <Grid item xs={2} container
                              spacing={0}
                              direction="column"
                              alignItems="center"
                              justify="flex-start"
                              style={{minHeight: '10vh'}}
                        >
                            <h4>Number of Dice</h4>

                            {this.state.username === this.state.host &&
                            <Button variant={"contained"} size="small" onClick={this.incrementDie}>
                                +
                            </Button>
                            }

                            <h3>{this.state.numDice}</h3>

                            {this.state.username === this.state.host &&
                            <Button variant={"contained"} size="small" onClick={this.decreaseDie}>
                                -
                            </Button>
                            }
                        </Grid>
                    </Grid>

                </Container>

                <br/>

                <div align={"center"}>
                    <Button variant="contained" color="default" onClick={this.onLeaveGame}>
                        Leave Lobby
                    </Button>
                    {this.state.username === this.state.host &&
                    <Button variant="contained" color="primary" onClick={this.onStartGame}>
                        Start Game
                    </Button>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        lobbyId: state.lobbyId,
        socket: state.socket,
        playersStore: state.players,
        botsStore: state.bots,
        numDiceStore: state.numDice,
        hostStore: state.host
    }
}

export default connect(mapStateToProps)(withCookies(withRouter(LobbyComponent)))