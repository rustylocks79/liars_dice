import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";
import TopBarComponent from "./TopBarComponent";
import {Button, Grid, Paper, TextField, Select, MenuItem} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import GameComponent from "./GameComponent";
import {connect} from "react-redux";

import compose from 'recompose/compose'


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.primary,
        bgcolor: theme.palette.text.secondary,
        height: '100px'

    },
    paper1: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.primary,
        bgcolor: theme.palette.text.secondary,
        height: '700px'
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
        errorMessage: "",
        numOfDiceRaise: 0,
        face: 1
    }

    constructor(props, context) {
        super(props, context);
        console.log(this.props.index)
        console.log(this.props.activeDice)
        console.log(this.props.currentPlayer)
        console.log(this.props.players)
        console.log(this.props.bots)
    }

    allDice = () => {
        var i;
        var sum = 0;
        for (i = 0; i < this.props.activeDice.length; i++) {
            sum += this.props.activeDice[i];
        }
        return sum;
    }

    createTable = () => {
        let table = []

        // Outer loop to create parent
        for (let i = 0; i < this.props.players.length; i++) {
            let children = []
            //Inner loop to create children
            children.push(<td>{this.props.players[i]} - {this.props.activeDice[i]} </td>)
            //Create the parent and add the children
            table.push(<tr>{children}</tr>)
        }

        for (let i = 0; i < this.props.bots.length; i++) {
            let children = []
            //Inner loop to create children
            children.push(
                <td>{this.props.bots[i].name} - {this.props.activeDice[i + this.props.players.length - 1]} </td>)
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
    changeFaceValue = (event) =>
    {
        let value = event.target.value;
        this.setState({face: value});
    }

    onClickRaised = () => {
        console.log(this.state.numOfDiceRaise)
        console.log(this.state.face)
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
                        <Paper className={classes.paper}>
                            <b>Round</b>
                        </Paper>
                        <Paper className={classes.paper}>
                            <b>Recent Bid</b>
                        </Paper>
                        <Paper className={classes.paper}>
                            <b>Round History</b>
                        </Paper>
                    </Grid>

                    <Grid item xs={7}>
                        {/*<Paper className={classes.paper1}>xs</Paper>*/}
                        <GameComponent/>
                    </Grid>

                    <Grid item xs={2}>
                        <Paper className={classes.paper5}>
                            <b>Game State</b>

                            <p>{this.allDice()} Dice</p>
                            <table>{this.createTable()}</table>
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
        index: state.index,
        activeDice: state.activeDice,
        currentPlayer: state.currentPlayer,
        players: state.players,
        bots: state.bots
    }
}

export default compose(
    withStyles(styles, {withTheme: true}),
    connect(mapStateToProps)
)(withCookies(withRouter(GameScreenComponent)))