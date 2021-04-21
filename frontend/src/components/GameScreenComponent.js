import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";
import TopBarComponent from "./TopBarComponent";
import {Button, Grid, MenuItem, Paper, Select, TextField} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import GameComponent from "./GameComponent";
import {connect} from "react-redux";

import compose from 'recompose/compose'
import AuthService from "../Services/AuthService";

import {
    GiDiceSixFacesFive,
    GiDiceSixFacesFour,
    GiDiceSixFacesOne,
    GiDiceSixFacesSix,
    GiDiceSixFacesThree,
    GiDiceSixFacesTwo
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
        height: '70vh',
        maxHeight: '1000px',
        overflow: 'auto'
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
        height: '70vh'
    },
});


class GameScreenComponent extends React.Component {
    state = {
        jwtToken: "",
        username: "",
        errorMessage: "",
        numOfDice: 0,
        face: 2,
        round: 1,
        gameOver: false,
        winnerName: "",
        winnerIndex: 0,
        dice: [GiDiceSixFacesOne, GiDiceSixFacesTwo, GiDiceSixFacesThree,
            GiDiceSixFacesFour, GiDiceSixFacesFive, GiDiceSixFacesSix],
        doubtDisplay: false,
        doubter: 0,
        loser: 0,
        doubtQuantity: 0,
        lastBidQ: 0,
        lastBidF: 0
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
                    hand: data.hand,
                    oldHands: data.oldHands
                }
            })
            this.setState({
                round: this.state.round + 1,
                errorMessage: '',
                doubtDisplay: true,
                doubter: data.doubter,
                loser: data.loser,
                doubtQuantity: data.quantityOnBoard,
                lastBidQ: data.lastQuantity,
                lastBidF: data.lastFace
            })
            setTimeout(() => {
                this.setState({doubtDisplay: false})
            }, 6000)
        })
        this.props.socket.on('error', data => {
            console.log('received event error from server: ' + JSON.stringify(data))
            this.setState({errorMessage: data['reason']})
        })
        this.props.socket.on('terminal', data => {
            console.log('received event terminal from server: ' + JSON.stringify(data))
            this.setState({
                winnerName: this.props.players[data["winner"]].username,
                gameOver: true,
                winnerIndex: data["winner"]})
        })
    }

    componentDidMount() {
        AuthService.user(this.state.jwtToken).then((res) => {
            this.setState({username: res.data.username})
        })
    }

    /**
     * @returns the total number of dice in the game.
     */
    allDice = () => {
        let sum = 0;
        for (let i = 0; i < this.props.activeDice.length; i++) {
            sum += this.props.activeDice[i];
        }
        return sum
    }

    /**
     * Displays a list of players with the number of dice they have.
     * @returns {*[]}
     */
    displayPlayers = () => {
        let table = []
        for (let i = 0; i < this.props.players.length; i++) {
            let player = this.props.players[i]
            table.push(<p key={i} style={{color: player.color}} >{player.username} - {this.props.activeDice[i]}</p>)
        }
        return table
    }

    /**
     * Displays the round history.
     * @returns {*[]}
     */
    displayRoundHistory = () => {
        let table = []
        table.push(<h3>Current Bid</h3>)
        if (this.props.bidHistory.length > 0) {
            let bid = this.props.bidHistory[this.props.bidHistory.length - 1]
            let player = this.props.players[bid[3]]
            table.push(<b key={this.props.bidHistory.length - 1}
                         style={{
                             color: player.color,
                             fontSize: "large",
                             verticalAlign: "middle"
                         }}>
                {player.username} <br/>
                {bid[1]} X {this.displayDie(bid[2], 5)}
            </b>)
        }
        table.push(<h4>Recent Bids</h4>)
        for (let i = this.props.bidHistory.length - 2; i >= Math.max(this.props.bidHistory.length - 5, 0); i--) {
            let bid = this.props.bidHistory[i]
            let player = this.props.players[bid[3]]
            table.push(<p key={i} style={{color: player.color}}>{player.username}<br/>
                {bid[1]} X {this.displayDie(bid[2], 4)}
            </p>)

        }
        return table
    }

    /**
     * Returns a React component for a dice.
     * @param face the type of dice to display
     * @param size the width and height of the dice to display
     * @returns {React.FunctionComponentElement<IconBaseProps>}
     */
    displayDie = (face, size) => {
        return (React.createElement(this.state.dice[face - 1], {
                key: 0,
                style: {
                    height: size + "vmin",
                    width: size + "vmin",
                    verticalAlign: "middle",
                    color: "black",
                }
            }))
    }

    changeHandler = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({[name]: value})
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
        this.props.socket.emit('exit', {
            'lobbyId': this.props.lobbyId,
            'jwtToken': this.state.jwtToken
        })
        this.props.history.push('/game/welcome')
    }

    displayDoubtInfo = () => {
        let bidQuantity = this.state.lastBidQ
        let bidFace = this.state.lastBidF
        let doubter = this.props.players[this.state.doubter]
        let loser = this.props.players[this.state.loser]
        return (<h1 style={{textAlign: "center"}}>
            <b style={{color: doubter.color}}>{doubter.username}</b> doubted {bidQuantity} X {this.displayDie(bidFace, true)}.
            The board had {this.state.doubtQuantity}. <b style={{color: loser.color}}>{loser.username}</b> lost a die.
                </h1>)
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
                            <b style={{fontSize:"x-large"}}>{this.state.round}</b>
                            {/*<h3>Round History</h3>*/}
                            <div style={{alignContent: "center"}}>{this.displayRoundHistory()}</div>
                        </Paper>

                    </Grid>

                    <Grid item xs={7}>
                        {/*<Paper className={classes.paper1}>xs</Paper>*/}
                        {!this.state.gameOver && <GameComponent doubtDisplay={this.state.doubtDisplay}/>}
                        {this.state.gameOver &&
                        <div style={{
                            height: '60vh',
                            justifyContent: "center",
                            verticalAlign: "middle",
                            display: "flex",
                            alignItems: "center"
                        }}>
                            <b style={{textAlign: "center", fontSize: "xxx-large"}}>Game Over!
                                <br/>
                                <b style={{
                                    textAlign: "center",
                                    fontSize: "xxx-large",
                                    color: this.props.players[this.state.winnerIndex].color
                                }}>{this.state.winnerName}</b> Wins!
                                <br/> <br/>
                                <Button variant="contained" color="default" onClick={this.leaveGame}>
                                    Leave Game
                                </Button>
                            </b>
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

                    {!this.state.gameOver && !this.state.doubtDisplay &&
                    <Grid item xs={4} style={{alignContent: "left", textAlign: "left"}}>
                        <Button variant="contained" color="default" onClick={this.leaveGame}>
                            Exit
                        </Button>
                    </Grid>}

                    {!this.state.doubtDisplay &&
                    <Grid container item xs={3} alignItems={'flex-start'} justify={'center'}>
                        {!this.state.gameOver && <Grid item>
                            <Button variant="contained"
                                    color="secondary"
                                    size="large"
                                    onClick={this.onDoubted}
                                    disabled={!(this.props.index === this.props.currentPlayer) || this.props.bidHistory.length === 0}>
                                Doubt</Button>
                        </Grid>}
                        {!this.state.gameOver && <Grid item>
                            <Button variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={this.onRaised}
                                    style={{marginLeft: "20px"}}
                                    disabled={!(this.props.index === this.props.currentPlayer)}>
                                Raise</Button>
                        </Grid>}
                    </Grid>}

                    {!this.state.doubtDisplay &&
                    <Grid container item xs={4} alignItems={'flex-start'} justify={'flex-start'}>

                        {!this.state.gameOver && <form noValidate autoComplete="off" onSubmit={this.submitHandler}>
                            <TextField
                                disabled={!(this.props.index === this.props.currentPlayer)}
                                type={"number"}
                                name={"numOfDice"}
                                onChange={this.changeHandler}
                                style={{marginRight: "10px", verticalAlign: "middle"}}
                                placeholder={"Dice Quantity"}
                                InputProps={{inputProps: {min: 1}}}
                                variant={"outlined"}
                            /> X
                            <Select
                                disabled={!(this.props.index === this.props.currentPlayer)}
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
                        </form>}
                    </Grid>}

                    {this.state.doubtDisplay &&
                    <Grid item xs={12}>
                        {this.displayDoubtInfo()}
                    </Grid>}

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
        bidHistory: state.bidHistory,
        hand: state.hand
    }
}

export default compose(
    withStyles(styles, {withTheme: true}),
    connect(mapStateToProps)
)(withCookies(withRouter(GameScreenComponent)))