import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";
import {Button, TextField, Grid, Container, Typography, Menu, MenuItem} from "@material-ui/core";
import TopBarComponent from "./TopBarComponent";
import AuthService from "../Services/AuthService";

//Reference for layout: https://stackoverflow.com/questions/50766693/how-to-center-a-component-in-material-ui-and-make-it-responsive

//Reference for clicking + and - on number of dice: https://medium.com/@aghh1504/2-increment-and-decrease-number-onclick-react-5767b765103c
class LobbyComponent extends React.Component {

    state = {
        jwtToken: "",
        username: "",
        errorMessage: "",
        numOfDice: 1,
        bots: [],
        botID: 1,
        numOfBots: 0,
        show: true
    }

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state.jwtToken = cookies.get('JWT-TOKEN')
    }

    componentDidMount() {
        AuthService.user(this.state.jwtToken).then((res) => {
            this.setState({username: res.data.username})
        })
    }

    logout = (event) => {
        const {cookies} = this.props;
        cookies.remove('JWT-TOKEN');
        this.props.history.push('/login')
    }

    IncrementDie = () => {
        if (this.state.numOfDice < 5) {
            this.setState({numOfDice: this.state.numOfDice + 1});
        }

    }
    DecreaseDie = () => {
        if (this.state.numOfDice > 1) {
            this.setState({numOfDice: this.state.numOfDice - 1});
        }
    }

    AddBot = () => {
        this.setState({numOfBots: this.state.numOfBots + 1});
        this.setState({botID: this.state.botID + 1});
        let bot
        if(this.state.bots.length > 0)
        {
            bot = {"name": "bot", "id": this.state.botID}
        }
        else
        {
            this.setState({botID: 2});
            bot = {"name": "bot", "id": 1}
        }

        this.state.bots.push(bot)
    }

    RemoveBot = (index, currentID) => {

        if (index == this.state.bots.length - 1)
        {
            this.setState({botID: currentID})
        }
        this.setState({numOfBots: this.state.numOfBots - 1})
        this.state.bots.splice(index, 1)
    }
    ClearBots = () => {
        this.setState({numOfBots: 0});
        this.setState({botID: 1});
        this.setState({bots: []});
    }

    DisplayBots = () => {
        return (

            <div color={"red"}>
                {this.state.bots.map(bot => (
                    <div>
                        <p>
                            <button onClick={() => this.RemoveBot(this.state.bots.indexOf(bot), bot.id)}>x</button> {bot.name} {bot.id}
                        </p>
                    </div>
                ))}
            </div>
        );
    }


    render() {
        return (

            <div>
                <TopBarComponent/>
                <h3 align={"center"} style={{color: 'blue'}}>Lobby #1234</h3>

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
                            {this.state.username} (host)
                            {this.DisplayBots()}
                            <div>
                                <br></br>
                                <Button onClick={this.ClearBots} variant="contained" color="default" size="small">
                                    CLear Bots
                                </Button>
                                <Button onClick={this.AddBot} variant="contained" color="secondary" size="small">
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

                            <Button variant={"contained"} size="small" onClick={this.IncrementDie}>
                                +
                            </Button>
                            <h3>{this.state.numOfDice}</h3>
                            <Button variant={"contained"} size="small" onClick={this.DecreaseDie}>
                                -
                            </Button>
                        </Grid>
                    </Grid>

                </Container>

                <p></p>
                <div align={"center"}>
                    <Button variant="contained" color="default" href="/welcome">
                        Leave Lobby
                    </Button>
                    <Button variant="contained" color="primary">
                        Start Game
                    </Button>
                </div>

            </div>
        )
            ;
    }
}

export default withCookies(withRouter(LobbyComponent))