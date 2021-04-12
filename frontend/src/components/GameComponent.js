import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";
import {connect} from "react-redux";
import {
    GiDiceSixFacesOne, GiDiceSixFacesTwo, GiDiceSixFacesThree,
    GiDiceSixFacesFour, GiDiceSixFacesFive, GiDiceSixFacesSix
} from "react-icons/gi";
import {Grid} from "@material-ui/core";
import AuthService from "../Services/AuthService";

class GameComponent extends React.Component {
    state = {
        jwtToken: "",
        username: "",
        errorMessage: "",
        playerColors: ['Red', 'RebeccaPurple', 'Blue', 'MediumAquaMarine', 'Green',
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
                                                    color: "Turquoise"
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

    render() {
        return (
            <div style={{height: '500px'}}>
                <div style={{height: '70%'}}>
                    <Grid
                        container
                        direction="row"
                        justify="space-evenly"
                        alignItems="flex-start"
                        spacing={1}
                    >
                        <Grid item xs={2}>
                            <p>Hello</p>
                        </Grid>
                        <Grid item xs={2}>
                            <p>World</p>
                        </Grid>
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
        index: state.index
    }
}

export default connect(mapStateToProps)(withCookies(withRouter(GameComponent)))