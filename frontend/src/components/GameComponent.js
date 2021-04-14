import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";
import {connect} from "react-redux";
import {
    GiDiceSixFacesOne, GiDiceSixFacesTwo, GiDiceSixFacesThree,
    GiDiceSixFacesFour, GiDiceSixFacesFive, GiDiceSixFacesSix
} from "react-icons/gi";
import {FaDiceD6} from "react-icons/fa";
import {AiFillStar} from "react-icons/ai";
import {Grid} from "@material-ui/core";
import AuthService from "../Services/AuthService";

class GameComponent extends React.Component {
    state = {
        jwtToken: "",
        username: "",
        errorMessage: "",
        playerColors: ['Red', 'RebeccaPurple', 'Blue', 'DarkRed', 'DarkSeaGreen',
            'DarkGoldenRod', 'DarkSlateGray', 'Tomato', 'SaddleBrown', 'Turquoise'],
        myColor: ""
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

    displayHand = () => {
        let diceNum = 0;
        let handDisplay = []
        let colorTemp = this.state.playerColors[this.props.index]

        for (let i = 0; i < this.props.hand[0]; i++) {
            diceNum++
            handDisplay.push(<GiDiceSixFacesOne key={diceNum}
                                                style={{
                                                    height: "6vmin",
                                                    width: "6vmin",
                                                    verticalAlign: "middle",
                                                    color: colorTemp
                                                }}/>)
        }
        for (let i = 0; i < this.props.hand[1]; i++) {
            diceNum++
            handDisplay.push(<GiDiceSixFacesTwo key={diceNum}
                                                style={{
                                                    height: "6vmin",
                                                    width: "6vmin",
                                                    verticalAlign: "middle",
                                                    color: colorTemp
                                                }}/>)
        }
        for (let i = 0; i < this.props.hand[2]; i++) {
            diceNum++
            handDisplay.push(<GiDiceSixFacesThree key={diceNum}
                                                  style={{
                                                      height: "6vmin",
                                                      width: "6vmin",
                                                      verticalAlign: "middle",
                                                      color: colorTemp
                                                  }}/>)
        }
        for (let i = 0; i < this.props.hand[3]; i++) {
            diceNum++
            handDisplay.push(<GiDiceSixFacesFour key={diceNum}
                                                 style={{
                                                     height: "6vmin",
                                                     width: "6vmin",
                                                     verticalAlign: "middle",
                                                     color: colorTemp
                                                 }}/>)
        }
        for (let i = 0; i < this.props.hand[4]; i++) {
            diceNum++
            handDisplay.push(<GiDiceSixFacesFive key={diceNum}
                                                 style={{
                                                     height: "6vmin",
                                                     width: "6vmin",
                                                     verticalAlign: "middle",
                                                     color: colorTemp
                                                 }}/>)
        }
        for (let i = 0; i < this.props.hand[5]; i++) {
            diceNum++
            handDisplay.push(<GiDiceSixFacesSix key={diceNum}
                                                style={{
                                                    height: "6vmin",
                                                    width: "6vmin",
                                                    verticalAlign: "middle",
                                                    color: colorTemp
                                                }}/>)
        }

        return handDisplay
    }

    displayOpponents = () => {
        let opponents = []

        for (let i = 0; i < this.props.players.length; i++) {
            let tempBool = i === this.props.currentPlayer

            if (this.props.players[i] !== this.state.username) {
                opponents.push(<Grid
                    container
                    item
                    direction="column"
                    justify="center"
                    alignItems="center"
                    xs={3}
                    style={{marginBottom: "30px"}}
                    key={i}
                >
                    {this.playerDisplay(i, tempBool)}
                </Grid>)
            }
        }

        for (let i = 0; i < this.props.bots.length; i++) {
            let tempBool = i + this.props.players.length === this.props.currentPlayer

            opponents.push(<Grid
                container
                item
                direction="column"
                justify="center"
                alignItems="center"
                xs={3}
                style={{marginBottom: "30px"}}
                key={i + this.props.players.length}
            >
                {this.botDisplay(i, tempBool)}
            </Grid>)
        }

        return opponents
    }

    playerDisplay = (index, current) => {
        let temp = []
        let key = 0

        console.log("Index: " + index + ", Current: " + current)

        if (this.props.activeDice[index] > 0) {

            temp.push(
                <Grid item style={{
                    color: this.state.playerColors[index],
                    marginBottom: "10px"
                }} key={key}>
                    {current && <AiFillStar style={{
                        color: "gold",
                        height: "4vmin",
                        width: "4vmin",
                        verticalAlign: "middle"
                    }}/>}
                    {this.props.players[index]}
                </Grid>)
            key++


            for (let i = 0; i < this.props.activeDice[index]; i++) {
                temp.push(<Grid item key={key}><FaDiceD6 style={{
                    height: "3vmin",
                    width: "3vmin",
                    verticalAlign: "middle",
                    color: this.state.playerColors[index]
                }}/></Grid>)
                key++
            }
        }

        return temp
    }

    botDisplay = (index, current) => {
        let temp = []
        let offset = this.props.players.length
        let key = 0

        if (this.props.activeDice[index + offset] > 0) {
            temp.push(
                <Grid item
                      style={{color: this.state.playerColors[index + offset], marginBottom: "10px"}}
                      key={key}>
                    {this.props.bots[index].name}
                </Grid>)
            key++

            if (current) {
                temp.push(<Grid item style={{
                    color: "gold",
                    marginBottom: "10px"
                }} key={key}>
                </Grid>)
                key++
            }

            for (let i = 0; i < this.props.activeDice[index + offset]; i++) {
                temp.push(<Grid item key={key}><FaDiceD6 style={{
                    height: "3vmin",
                    width: "3vmin",
                    verticalAlign: "middle",
                    color: this.state.playerColors[index + offset]
                }}/></Grid>)
                key++
            }
        }

        return temp
    }

    render() {
        return (
            <div style={{height: '75vh'}}>
                <div style={{height: '70%'}}>
                    <Grid
                        container
                        direction="row"
                        justify="space-evenly"
                        alignItems="flex-start"
                        spacing={1}
                    >
                        {this.displayOpponents()}
                    </Grid>
                </div>
                <div style={{textAlign: "center"}}>
                    <h3>My Hand</h3>
                    <div>
                        {this.displayHand()}
                    </div>

                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        socket: state.socket,
        hand: state.hand,
        players: state.players,
        bots: state.bots,
        activeDice: state.activeDice,
        index: state.index,
        currentPlayer: state.currentPlayer
    }
}

export default connect(mapStateToProps)(withCookies(withRouter(GameComponent)))