import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";
import TopBarComponent from "./TopBarComponent";
import {Grid, Paper} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import GameComponent from "./GameComponent";


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.text.secondary
    },
    paper1: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.text.secondary,
        height: '700px'
    },
    paper2: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.text.secondary
    },
    paper4: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.text.secondary,
        height: '200px'
    },
    paper5: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.text.secondary,
        height: '400px'
    },
});


class GameScreenComponent extends React.Component {
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
                        <Paper className={classes.paper4}>xs</Paper>
                        <Paper className={classes.paper4}>xs</Paper>
                    </Grid>
                    <Grid item xs={7}>
                        {/*<Paper className={classes.paper1}>xs</Paper>*/}
                        <GameComponent/>
                    </Grid>
                    <Grid item xs={2}>
                        <Paper className={classes.paper5}>xs</Paper>
                    </Grid>
                    <Grid item xs={2}>
                        <Paper className={classes.paper}>xs</Paper>
                    </Grid>
                    <Grid item xs={7}>
                        <Paper className={classes.paper2}>xs</Paper>
                    </Grid>
                    <Grid item xs={2}>
                        <Paper className={classes.paper}>xs</Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles, {withTheme: true})(withCookies(withRouter(GameScreenComponent)))