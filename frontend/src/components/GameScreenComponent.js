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

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.primary,
        bgcolor: theme.palette.text.secondary,
        height: '300px',
        maxHeight: '1000px',
        overflow: 'auto'

    },
    paper1: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.primary,
        bgcolor: theme.palette.text.secondary,
        height: '100px'
    },
    paper2: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.primary,
        bgcolor: theme.palette.text.primary
    },
    paper4: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.primary,
        bgcolor: theme.palette.text.secondary,
        height: '200px'
    },
    paper5: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.primary,
        bgcolor: theme.palette.text.secondary,
        height: '400px'
    },
});


class GameScreenComponent extends React.Component {
    state = {
        jwtToken: "",
        username: "",
        errorMessage: "",
        numOfDiceRaise: 0,
        face: 2,
        playerColors: [],
        round: 1
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
            this.setState({round: this.state.round + 1})
        })
        this.props.socket.on('error', data => {
            console.log('received event error from server: ' + JSON.stringify(data))
        })
        this.setPlayerColors();
    }

    componentDidMount() {
        AuthService.user(this.state.jwtToken).then((res) => {
            this.setState({username: res.data.username})
        })
    }

    setPlayerColors = () => {
        this.state.playerColors.push({color: 'Red'});
        this.state.playerColors.push({color: 'RebeccaPurple'});
        this.state.playerColors.push({color: 'LightSalmon'});
        this.state.playerColors.push({color: 'DarkCyan'});
        this.state.playerColors.push({color: 'Green'});
        this.state.playerColors.push({color: 'DarkGoldenRod'});
        this.state.playerColors.push({color: 'YellowGreen'});
        this.state.playerColors.push({color: 'Tomato'});
        this.state.playerColors.push({color: 'Silver'});
        this.state.playerColors.push({color: 'SkyBlue'});
    }

    allDice = () => {
        var i;
        var sum = 0;
        for (i = 0; i < this.props.activeDice.length; i++) {
            sum += this.props.activeDice[i];
        }
        return sum;
    }

    displayPlayers = () => {
        let table = []

        for (let i = 0; i < this.props.players.length; i++) {
            table.push(<p key={i}
                          style={this.state.playerColors[i]}
            >{this.props.players[i]} - {this.props.activeDice[i]}</p>)
        }

        for (let i = 0; i < this.props.bots.length; i++) {
            table.push(<p key={i + this.props.players.length}
                          style={this.state.playerColors[i + this.props.players.length]}
            >{this.props.bots[i].name} - {this.props.activeDice[i + this.props.players.length]}</p>)
        }

        return table
    }

    changeNumOfDiceRaise = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({numOfDiceRaise: value});
    }
    changeFaceValue = (event) => {
        let value = event.target.value;
        this.setState({face: value});
    }

    displayRoundHistory = (event) => {
        let temp = []

        for (let i = this.props.bidHistory.length - 1; i >= 0; i--) {
            temp.push(<p key={i}>Quantity: {this.props.bidHistory[i][1]}, Face: {this.props.bidHistory[i][2]} </p>)
        }

        return temp
    }

    onRaised = () => {
        this.props.socket.emit('raise', {
            'lobbyId': this.props.lobbyId,
            'jwtToken': this.state.jwtToken,
            'quantity': this.state.numOfDiceRaise,
            'face': this.state.face
        })
    }

    onDoubted = () => {
        this.props.socket.emit('doubt', {
            'lobbyId': this.props.lobbyId,
            'jwtToken': this.state.jwtToken
        })
    }


    render() {
        const {classes} = this.props;
        return (
            <div>
                <TopBarComponent/>

                <br/>

                <Grid
                    container
                    direction="row"
                    justify="space-evenly"
                    alignItems="flex-start"
                    spacing={1}
                >
                    <Grid item xs={2}>
                        <Paper className={classes.paper1}>
                            <h3>Round</h3>
                            {this.state.round}
                        </Paper>
                        <Paper className={classes.paper}>
                            <h3>Round History</h3>
                            <div style={{alignContent:"center"}}>{this.displayRoundHistory()}</div>
                        </Paper>

                    </Grid>

                    <Grid item xs={7}>
                        {/*<Paper className={classes.paper1}>xs</Paper>*/}
                        <GameComponent/>
                    </Grid>

                    <Grid item xs={2}>
                        <Paper className={classes.paper5}>
                            <h3>Game State</h3>
                            <div style={{alignContent:"center"}}>{this.displayPlayers()}</div>
                            <br/>
                            <b>{this.allDice()} Dice Total</b>
                        </Paper>
                    </Grid>

                    <Grid container item xs={4} alignItems={'flex-start'} justify={'flex-start'}>
                        <Button variant="contained" color="default">
                            <Link to={'/'}>
                                {/*TODO: remove from game. */}
                                Exit
                            </Link>
                        </Button>
                    </Grid>

                    {/* TODO: Only display when it turn*/}
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
                            name={"num"}
                            onChange={this.changeNumOfDiceRaise}
                            /> x
                        <Select
                            value={this.state.face}
                            onChange={this.changeFaceValue}>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={6}>6</MenuItem>
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