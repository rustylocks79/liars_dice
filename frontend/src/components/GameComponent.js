import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";
import {connect} from "react-redux";
import {
    GiDiceSixFacesFive,
    GiDiceSixFacesFour,
    GiDiceSixFacesOne,
    GiDiceSixFacesSix,
    GiDiceSixFacesThree,
    GiDiceSixFacesTwo
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
        dice: [GiDiceSixFacesOne, GiDiceSixFacesTwo, GiDiceSixFacesThree,
            GiDiceSixFacesFour, GiDiceSixFacesFive, GiDiceSixFacesSix],
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

    /**
     * Displays the current players dice at the bottom of the game screen.
     * @returns {*[]}
     */
    displayHand = () => {
        let diceNum = 0;
        let handDisplay = []
        let colorTemp = this.props.players[this.props.index].color
        for (let i = 0; i < this.state.dice.length; i++) {
            for (let j = 0; j < this.props.hand[i]; j++) {
                handDisplay.push(React.createElement(this.state.dice[i], {
                    key: diceNum,
                    style: {
                        height: "6vmin",
                        width: "6vmin",
                        verticalAlign: "middle",
                        color: colorTemp
                    }
                }))
                diceNum++
            }
        }
        return handDisplay
    }

    hiddenHand = (colorIndex, diceNum) => {
        let handDisplay = []
        let colorTemp = this.props.players[colorIndex].color
        for (let i = 0; i < diceNum; i++) {
            handDisplay.push(<FaDiceD6 style={{
                height: "4vmin",
                width: "4vmin",
                verticalAlign: "middle",
                color: colorTemp
            }}key={i + 1}/>)
        }
        return handDisplay
    }

    revealHand = (index) => {
        let diceNum = 1;
        let handDisplay = []
        let colorTemp = this.props.players[this.props.index].color
        for (let i = 0; i < this.state.dice.length; i++) {
            for (let j = 0; j < this.props.hand[i]; j++) {
                diceNum++
                handDisplay.push(React.createElement(this.state.dice[i], {
                    key: diceNum,
                    style: {
                        height: "4vmin",
                        width: "4vmin",
                        verticalAlign: "middle",
                        color: colorTemp
                    }
                }))
            }
        }
        return handDisplay
    }

    displayOpponents = () => {
        let opponents = []
        for (let i = 0; i < this.props.players.length; i++) {
            let tempBool = i === this.props.currentPlayer

            if (tempBool) {
                opponents.push(<Grid
                    item
                    xs={4}
                    style={{marginBottom: "30px", border: "2px solid black", textAlign: "center"}}
                    key={i}
                >
                    {this.playerDisplay(i, tempBool)}
                </Grid>)
            } else {
                opponents.push(<Grid
                    item
                    xs={4}
                    style={{marginBottom: "30px", textAlign: "center"}}
                    key={i}
                >
                    {this.playerDisplay(i, tempBool)}
                </Grid>)
            }
        }
        return opponents
    }

    playerDisplay = (index, current) => {
        let temp = []
        let key = 0
        if (this.props.activeDice[index] > 0) {
            temp.push(
                <div style={{
                    color: this.props.players[index].color,
                    marginBottom: "10px",
                    height: "3vmin"
                }} key={key}>
                    {current && <AiFillStar style={{
                        color: "gold",
                        height: "3vmin",
                        width: "3vmin",
                        verticalAlign: "middle",
                    }}/>}
                    {this.props.players[index].username}
                </div>)
            key++

            if (!this.state.gameOver) {
                temp.push(<div key={key}>{this.hiddenHand(index, this.props.activeDice[index])}</div>)
            } else {
                temp.push(<div key={key}>{this.revealHand()}</div>)
            }
            key++
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
        activeDice: state.activeDice,
        index: state.index,
        currentPlayer: state.currentPlayer
    }
}

export default connect(mapStateToProps)(withCookies(withRouter(GameComponent)))