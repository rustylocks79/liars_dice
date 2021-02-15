import {withCookies} from "react-cookie";
import {withRouter} from "react-router-dom";
import React from "react";
import {Container, Grid, Typography} from "@material-ui/core";

class WelcomeComponent extends React.Component {
    render() {
        return (
            <div>
                <p>Welcome Component</p> <br/>

                <Container fixed>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <h4 align={"center"}>Tutorial</h4>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography paragraph={true} align={"center"}>
                                At the start of a game of Liar’s Dice, each player is given between 1 and 5 dice. Now
                                each
                                game
                                of
                                Liar’s Dice consists of multiple rounds. A round starts with each player rolling their
                                dice
                                and
                                concealing them from the other players. One of the players is chosen at random to start
                                the
                                first
                                round. The player who goes first must set an initial bid. The bid must consist of a face
                                value
                                (between 2 and 6) and a quantity (greater than or equal to 1). The game proceeds in a
                                clockwise
                                direction. During a player’s turn they can either raise the previous bid or doubt the
                                previous
                                bid.
                                If the player chooses to raise the previous bid by choosing a face value and quantity.
                                For a
                                raise
                                to be valid the face value must be greater than the previous bid’s face value and with
                                equal
                                quantity or a greater quantity. If the player doubts the previous then all players
                                reveal
                                their
                                dice. The number of dice with the face value equal to the previous bid are added up.
                                Additionally,
                                any dice that rolls a 1 are included since 1 are wild. If there are more than or exactly
                                the
                                number
                                of dice in play as the quantity then the player who doubted the bid losses a die. If
                                there
                                are
                                less
                                dice in play than the quantity of the previous bid then the player who made the previous
                                bid
                                loses a
                                die. The next round starts with the player who lost the die. If the player who lost the
                                die
                                was
                                eliminated then the next player starts the bidding.
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Container maxWidth={"xs"}>
                                    <button>Create Lobby</button> <br/>
                                    <button>Join Lobby</button> <br/>
                                    <button>View Statistics</button>
                            </Container>
                        </Grid>
                    </Grid>
                </Container>

                {/*<Container fixed>*/}
                {/*    <h4 align={"center"}>Tutorial</h4>*/}
                {/*    <Typography paragraph={true} align={"center"}>*/}
                {/*        At the start of a game of Liar’s Dice, each player is given between 1 and 5 dice. Now each game*/}
                {/*        of*/}
                {/*        Liar’s Dice consists of multiple rounds. A round starts with each player rolling their dice and*/}
                {/*        concealing them from the other players. One of the players is chosen at random to start the*/}
                {/*        first*/}
                {/*        round. The player who goes first must set an initial bid. The bid must consist of a face value*/}
                {/*        (between 2 and 6) and a quantity (greater than or equal to 1). The game proceeds in a clockwise*/}
                {/*        direction. During a player’s turn they can either raise the previous bid or doubt the previous*/}
                {/*        bid.*/}
                {/*        If the player chooses to raise the previous bid by choosing a face value and quantity. For a*/}
                {/*        raise*/}
                {/*        to be valid the face value must be greater than the previous bid’s face value and with equal*/}
                {/*        quantity or a greater quantity. If the player doubts the previous then all players reveal their*/}
                {/*        dice. The number of dice with the face value equal to the previous bid are added up.*/}
                {/*        Additionally,*/}
                {/*        any dice that rolls a 1 are included since 1 are wild. If there are more than or exactly the*/}
                {/*        number*/}
                {/*        of dice in play as the quantity then the player who doubted the bid losses a die. If there are*/}
                {/*        less*/}
                {/*        dice in play than the quantity of the previous bid then the player who made the previous bid*/}
                {/*        loses a*/}
                {/*        die. The next round starts with the player who lost the die. If the player who lost the die was*/}
                {/*        eliminated then the next player starts the bidding.*/}
                {/*    </Typography>*/}
                {/*</Container>*/}

                {/*<div>*/}
                {/*    <button>Create Lobby</button>*/}
                {/*    <button>Join Lobby</button>*/}
                {/*    <button>View Statistics</button>*/}
                {/*</div>*/}


            </div>
        );
    }
}

export default withCookies(withRouter(WelcomeComponent))