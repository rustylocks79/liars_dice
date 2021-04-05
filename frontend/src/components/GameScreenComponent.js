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
                    currentPlayer: data.currentPlayer
                }
            })
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
        console.log(this.props.lobbyId)
        var i;
        var sum = 0;
        for (i = 0; i < this.props.activeDice.length; i++) {
            sum += this.props.activeDice[i];
        }
        return sum;
    }

    displayPlayers = () => {
        let table = []

        // Outer loop to create parent
        for (let i = 0; i < this.props.players.length; i++) {
            let children = []
            //Inner loop to create children
            if (this.state.username === this.props.players[i]) {
                children.push(<td
                    style={this.state.playerColors[i]}>(Me) {this.props.players[i]} - {this.props.activeDice[i]}</td>)

            } else {
                children.push(<td
                    style={this.state.playerColors[i]}>{this.props.players[i]} - {this.props.activeDice[i]} </td>)
            }
            //Create the parent and add the children
            table.push(<tr>{children}</tr>)
        }

        for (let i = 0; i < this.props.bots.length; i++) {
            let children = []
            //Inner loop to create children
            children.push(
                <td style={this.state.playerColors[i + this.props.players.length]}>{this.props.bots[i].name} - {this.props.activeDice[i + this.props.players.length - 1]} </td>)
            //Create the parent and add the children
            table.push(<tr>{children}</tr>)
        }
        return table
    }

    // playersWithNumOfDice = () => {
    //     return (
    //         <div>
    //             {this.props.players.map(player => (
    //                 <div key={player}>
    //                     <p style={{color: "black"}}>{player} - {this.props.activeDice[this.props.index]}</p>
    //                 </div>
    //             ))}
    //
    //             {this.props.bots.map(bot => (
    //                 <div key={bot.name}>
    //                     <p>
    //                         {bot.name}
    //                     </p>
    //                 </div>
    //             ))}
    //         </div>
    //     )
    // }

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
        let table = []

        for (let i = this.props.bidHistory.length - 1; i >= 0; i--) {
            let children = []
            //Inner loop to create children
            if (i === this.props.bidHistory.length - 1) {
                children.push(<td><b>Quantity: {this.props.bidHistory[i][1]}, Face: {this.props.bidHistory[i][2]}</b>
                </td>)

            } else {
                children.push(<td>Quantity: {this.props.bidHistory[i][1]}, Face: {this.props.bidHistory[i][2]} </td>)
            }
            //Create the parent and add the children
            table.push(<tr>{children}</tr>)
        }

        return table
    }

    onClickRaised = () => {
        this.props.socket.emit('raise', {
            'lobbyId': this.props.lobbyId,
            'jwtToken': this.state.jwtToken,
            'quantity': this.state.numOfDiceRaise,
            'face': this.state.face
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
                            <table align={"center"}>{this.displayRoundHistory()}</table>
                        </Paper>

                    </Grid>

                    <Grid item xs={7}>
                        {/*<Paper className={classes.paper1}>xs</Paper>*/}
                        <GameComponent/>
                    </Grid>

                    <Grid item xs={2}>
                        <Paper className={classes.paper5}>
                            <h3>Game State</h3>
                            <table align={"center"}>{this.displayPlayers()}</table>
                            <br></br>
                            <b>{this.allDice()} Dice Total</b>
                        </Paper>
                    </Grid>

                    <Grid container item xs={4} alignItems={'flex-start'} justify={'flex-start'}>
                        <Button variant="contained" color="default">Exit</Button>
                    </Grid>

                    <Grid container item xs={3} alignItems={'flex-start'} justify={'center'}>
                        <Button variant="contained" color="secondary" size="large">Doubt</Button>
                        <Button variant="contained"
                                color="Primary"
                                size="large"
                                type={"submit"}
                                onClick={this.onClickRaised}>Raise</Button>
                    </Grid>

                    <Grid container item xs={4} alignItems={'flex-start'} justify={'flex-start'}>

                        <form noValidate autoComplete="off" onSubmit={this.submitHandler}>
                            <TextField
                                type={"number"}
                                name={"num"}
                                onChange={this.changeNumOfDiceRaise}
                            /> x
                            {/*<select>*/}
                            {/*    <option value="2">2</option>*/}
                            {/*    <option value="3">3</option>*/}
                            {/*    <option value="4">4</option>*/}
                            {/*    <option value="5">5</option>*/}
                            {/*    <option value="6">6</option>*/}
                            {/*</select>*/}
                            <Select
                                // labelId="demo-simple-select-label"
                                // id="demo-simple-select"
                                value={this.state.face}
                                onChange={this.changeFaceValue}
                            >
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={6}>6</MenuItem>
                            </Select>
                        </form>


                    </Grid>
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
        bidHistory: state.bidHistory
    }
}

export default compose(
    withStyles(styles, {withTheme: true}),
    connect(mapStateToProps)
)(withCookies(withRouter(GameScreenComponent)))