import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";
import TopBarComponent from "./TopBarComponent";
import {Grid, Paper, Button, TextField} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import GameComponent from "./GameComponent";
import {connect} from "react-redux";


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
        errorMessage: ""
    }

    constructor(props, context) {
        super(props, context);
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

                            <p>12 Dice</p>
                            <p>Orange - 4</p>
                            <p>Blue - 3</p>
                            <p>Purple - 2</p>
                            <p>Red - 3</p>

                        </Paper>
                    </Grid>

                    <Grid container item xs={4} alignItems={'flex-start'} justify={'flex-start'}>
                        <Button variant="contained" color="default">Exit</Button>
                    </Grid>

                    <Grid container item xs={3} alignItems={'flex-start'} justify={'center'}>
                        <Button variant="contained" color="secondary" size="large">Doubt</Button>
                        <Button variant="contained" color="Primary" size="large">Raise</Button>

                    </Grid>

                    <Grid container item xs={4} alignItems={'flex-start'} justify={'flex-start'}>
                        2 x 3
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
    }
}

export default  connect(mapDispatchToProps, mapStateToProps)
                (withStyles(styles, {withTheme: true}))
                (withCookies(withRouter(GameScreenComponent)))