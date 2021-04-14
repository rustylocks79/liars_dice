import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";
import AuthService from "../Services/AuthService";
import {Container, Grid} from "@material-ui/core";
import TopBarComponent from "./TopBarComponent";


class ProfileComponent extends React.Component {
    state = {
        jwtToken: "",
        username: "",
        correctDoubts: 0,
        incorrectDoubts: 0,
        successfulRaises: 0,
        caughtRaises: 0,
        gamesPlayed: 0,
        gamesWon: 0,
        errorMessage: ""
    }

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state.jwtToken = cookies.get('JWT-TOKEN')
    }

    componentDidMount() {
        AuthService.user(this.state.jwtToken).then((res) => {
            this.setState({
                username: res.data.username,
                correctDoubts: res.data.correctDoubts,
                incorrectDoubts: res.data.incorrectDoubts,
                successfulRaises: res.data.successfulRaises,
                caughtRaises: res.data.caughtRaises,
                gamesPlayed: res.data.gamesPlayed,
                gamesWon: res.data.gamesWon
            })
        })
    }

    render() {
        return (
            <div>
                <TopBarComponent/>

                <Container fixed>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <h1 align={"center"}>Lifetime statistics of</h1>
                            <h2 align={"center"}>{this.state.username}</h2>
                        </Grid>

                        <Grid item xs={6}>
                            <h3 align={"left"}>Total Games Played</h3>
                        </Grid>
                        <Grid item xs={6}>
                            <h3 align={"right"}>{this.state.gamesPlayed}</h3>
                        </Grid>

                        <Grid item xs={6}>
                            <h3 align={"left"}>Win Percentage</h3>
                        </Grid>
                        <Grid item xs={6}>
                            {this.state.gamesPlayed === 0 && <h3 align={"right"}>---</h3>}
                            {this.state.gamesPlayed !== 0 && <h3 align={"right"}>{(this.state.gamesWon/this.state.gamesPlayed) * 100}%</h3>}
                        </Grid>

                        <Grid item xs={6}>
                            <h3 align={"left"}>Successful Doubts</h3>
                        </Grid>
                        <Grid item xs={6}>
                            <h3 align={"right"}>{this.state.correctDoubts}</h3>
                        </Grid>

                        <Grid item xs={6}>
                            <h3 align={"left"}>Unsuccessful Doubts</h3>
                        </Grid>
                        <Grid item xs={6}>
                            <h3 align={"right"}>{this.state.incorrectDoubts}</h3>
                        </Grid>

                        <Grid item xs={6}>
                            <h3 align={"left"}>Successful Raises</h3>
                        </Grid>
                        <Grid item xs={6}>
                            <h3 align={"right"}>{this.state.successfulRaises}</h3>
                        </Grid>

                        <Grid item xs={6}>
                            <h3 align={"left"}>Caught Raises</h3>
                        </Grid>
                        <Grid item xs={6}>
                            <h3 align={"right"}>{this.state.caughtRaises}</h3>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        );
    }
}

export default withCookies(withRouter(ProfileComponent))