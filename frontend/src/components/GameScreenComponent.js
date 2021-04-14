import {withCookies} from "react-cookie";
import {Link, withRouter} from "react-router-dom";
import React from "react";
import TopBarComponent from "./TopBarComponent";
import {Button, Grid, MenuItem, Paper, Select, TextField} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import GameComponent from "./GameComponent";
import {connect} from "react-redux";

import compose from 'recompose/compose'
import AuthService from "../Services/AuthService";

import {
    GiDiceSixFacesOne, GiDiceSixFacesTwo, GiDiceSixFacesThree,
    GiDiceSixFacesFour, GiDiceSixFacesFive, GiDiceSixFacesSix
} from "react-icons/gi";

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    roundHistory: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.primary,
        bgcolor: theme.palette.text.secondary,
        height: '60vh',
        // maxHeight: '1000px',
        // overflow: 'auto'

    },
    roundNum: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.primary,
        bgcolor: theme.palette.text.secondary,
        height: '10vh'
    },
    gameState: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.primary,
        bgcolor: theme.palette.text.secondary,
        height: '60vh'
    },
});


class GameScreenComponent extends React.Component {
    state = {
        jwtToken: "",
        username: "",
        errorMessage: "",
        numOfDice: 0,
        face: 2,
        playerColors: ['Red', 'RebeccaPurple', 'Blue', 'DarkRed', 'DarkSeaGreen',
            'DarkGoldenRod', 'DarkSlateGray', 'Tomato', 'SaddleBrown', 'Turquoise', 'Green', 'DimGray'],
        round: 1,
        winnerIndex: 0,
        gameOver: false

    }

    constructor(props, context) {
        super(props, context);
        const {cookies} = props;
        this.state.jwtToken = cookies.get('JWT-TOKEN')
        this.props.socket.on('raised', data => {
            console.log('received event raised from server: ' + JSON.stringify(data))
            this.props.dispatch({
                type: 'RAISE',
                payload: {
                    bidHistory: data.bidHistory,
                    currentPlayer: data.currentPlayer,
                    hand: data.hand
                }
            })
            this.setState({errorMessage: ''})
        })
        this.props.socket.on('doubted', data => {
            console.log('received event doubted from server: ' + JSON.stringify(data))
            this.props.dispatch({
                type: 'DOUBT',
                payload: {
                    currentPlayer: data.currentPlayer,
                    activeDice: data.activeDice,
                    hand: data.hand
                }
            })
            this.setState({round: this.state.round + 1, errorMessage: ''})
        })
        this.props.socket.on('error', data => {
            console.log('received event error from server: ' + JSON.stringify(data))
            this.setState({errorMessage: data['reason']})
        })
        this.props.socket.on('terminal', data => {
            console.log('received event terminal from server: ' + JSON.stringify(data))
            // let winner = ""
            //
            // if (data["winner"] < this.props.players.length) {
            //     winner = this.props.players[data["winner"]]
            // } else {
            //     winner = this.props.bots[data["winner"] - this.props.players.length].name
            // }
            //
            // alert(winner + " wins!");
            this.setState({winnerIndex: data["winner"]})
            this.setState({gameOver: true})
        })
    }

    componentDidMount() {
        AuthService.user(this.state.jwtToken).then((res) => {
            this.setState({username: res.data.username})
        })
    }

    allDice = () => {
        let sum = 0;
        for (let i = 0; i < this.props.activeDice.length; i++) {
            sum += this.props.activeDice[i];
        }
        return sum
    }

    displayPlayers = () => {
        let table = []
        for (let i = 0; i < this.props.players.length; i++) {
            table.push(<p key={i}
                          style={{color: this.state.playerColors[i]}}
            >{this.props.players[i]} - {this.props.activeDice[i]}</p>)
        }

        for (let i = 0; i < this.props.bots.length; i++) {
            table.push(<p key={i + this.props.players.length}
                          style={{color: this.state.playerColors[i + this.props.players.length]}}
            >{this.props.bots[i].name} - {this.props.activeDice[i + this.props.players.length]}</p>)
        }

        return table
    }

    changeHandler = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({[name]: value})
    }

    displayRoundHistory = () => {
        let temp = []
        for (let i = this.props.bidHistory.length - 1; i >= 0; i--) {
            if (i === this.props.bidHistory.length - 1) {
                temp.push(<b key={i}
                             style={{
                                 color: this.state.playerColors[this.props.bidHistory[i][3]],
                                 fontSize: "large"
                             }}>Quantity: {this.props.bidHistory[i][1]},
                    Face: {this.props.bidHistory[i][2]} </b>)
            } else {
                temp.push(<p key={i}
                             style={{color: this.state.playerColors[this.props.bidHistory[i][3]]}}>Quantity: {this.props.bidHistory[i][1]},
                    Face: {this.props.bidHistory[i][2]} </p>)
            }
        }

        return temp
    }

    onRaised = () => {
        this.props.socket.emit('raise', {
            'lobbyId': this.props.lobbyId,
            'jwtToken': this.state.jwtToken,
            'quantity': this.state.numOfDice,
            'face': this.state.face
        })
    }

    onDoubted = () => {
        this.props.socket.emit('doubt', {
            'lobbyId': this.props.lobbyId,
            'jwtToken': this.state.jwtToken
        })
    }

    leaveGame = () => {
        this.props.history.push('/welcome')
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                <TopBarComponent/>

                <br/>
                {this.state.errorMessage && <h1>{this.state.errorMessage}</h1>}

                <Grid
                    container
                    direction="row"
                    justify="space-evenly"
                    alignItems="flex-start"
                    spacing={1}
                >
                    <Grid item xs={2}>
                        {/*<Paper className={classes.roundNum}>*/}
                        {/*    <h3>Round</h3>*/}
                        {/*    {this.state.round}*/}
                        {/*</Paper>*/}
                        <Paper className={classes.roundHistory}>
                            <h3>Round</h3>
                            {this.state.round}
                            <h3>Round History</h3>
                            <div style={{alignContent: "center"}}>{this.displayRoundHistory()}</div>
                        </Paper>

                    </Grid>

                    <Grid item xs={7}>
                        {/*<Paper className={classes.paper1}>xs</Paper>*/}
                        {!this.state.gameOver && <GameComponent/>}
                        {this.state.gameOver &&
                        <div style={{
                            height: '60vh',
                            justifyContent: "center",
                            verticalAlign: "middle",
                            display: "flex",
                            alignItems: "center"
                        }}>
                            <p style={{textAlign:"center"}}>Game Over! Winner: {this.state.winnerIndex}
                                <br/> <br/>
                                <Button variant="contained" color="default" onClick={this.leaveGame}>
                                    Leave Game
                                </Button>
                            </p>
                        </div>
                        }
                    </Grid>

                    <Grid item xs={2}>
                        <Paper className={classes.gameState}>
                            <h3>Game State</h3>
                            <div style={{alignContent: "center"}}>{this.displayPlayers()}</div>
                            <br/>
                            <b>{this.allDice()} Dice Total</b>
                        </Paper>
                    </Grid>

                    <Grid container item xs={4} alignItems={'flex-start'} justify={'flex-start'}>
                        <Button variant="contained" color="default" onClick={this.leaveGame}>
                            Exit
                        </Button>
                    </Grid>

                    {this.props.index === this.props.currentPlayer &&
                    <Grid container item xs={3} alignItems={'flex-start'} justify={'center'}>
                        <Button variant="contained"
                                color="secondary"
                                size="large"
                                onClick={this.onDoubted}>Doubt</Button>
                        <Button variant="contained"
                                color="primary"
                                size="large"
                                type={"submit"}
                                onClick={this.onRaised}>Raise</Button>
                    </Grid>}

                    {this.props.index === this.props.currentPlayer &&
                    <Grid container item xs={4} alignItems={'flex-start'} justify={'flex-start'}>

                        <form noValidate autoComplete="off" onSubmit={this.submitHandler}>
                            <TextField
                                type={"number"}
                                name={"numOfDice"}
                                onChange={this.changeHandler}
                                style={{marginRight: "10px", verticalAlign: "middle"}}
                                placeholder={"Dice Quantity"}
                                InputProps={{inputProps: {min: 1}}}
                                variant={"outlined"}
                            /> X
                            <Select
                                value={this.state.face}
                                name={"face"}
                                onChange={this.changeHandler}
                                style={{marginLeft: "10px", verticalAlign: "middle"}}>
                                <MenuItem value={2}>
                                    <GiDiceSixFacesTwo style={{
                                        height: "3vmin",
                                        width: "3vmin",
                                        verticalAlign: "middle",
                                    }}/>
                                </MenuItem>
                                <MenuItem value={3}>
                                    <GiDiceSixFacesThree style={{
                                        height: "3vmin",
                                        width: "3vmin",
                                        verticalAlign: "middle",
                                    }}/>
                                </MenuItem>
                                <MenuItem value={4}>
                                    <GiDiceSixFacesFour style={{
                                        height: "3vmin",
                                        width: "3vmin",
                                        verticalAlign: "middle",
                                    }}/>
                                </MenuItem>
                                <MenuItem value={5}>
                                    <GiDiceSixFacesFive style={{
                                        height: "3vmin",
                                        width: "3vmin",
                                        verticalAlign: "middle",
                                    }}/>
                                </MenuItem>
                                <MenuItem value={6}>
                                    <GiDiceSixFacesSix style={{
                                        height: "3vmin",
                                        width: "3vmin",
                                        verticalAlign: "middle",
                                    }}/>
                                </MenuItem>
                            </Select>
                        </form>
                    </Grid>
                    }
                </Grid>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {dispatch}
}

const mapStateToProps = state => {
    return {
        socket: state.socket,
        lobbyId: state.lobbyId,
        index: state.index,
        activeDice: state.activeDice,
        currentPlayer: state.currentPlayer,
        players: state.players,
        bots: state.bots,
        bidHistory: state.bidHistory,
        hand: state.hand
    }
}

export default compose(
    withStyles(styles, {withTheme: true}),
    connect(mapStateToProps)
)(withCookies(withRouter(GameScreenComponent)))