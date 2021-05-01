import React from "react";
import {Link, withRouter} from "react-router-dom";
import YouTubePlayer from "react-player/youtube";
import PromotionalTopBarComponent from "./PromotionalTopBarComponent";
import {Button} from "@material-ui/core";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

function PromotionalMainComponent() {
    return (
        <div>
            <PromotionalTopBarComponent/>
            <div style={{textAlign: "center", width: "80%", margin: "auto", paddingTop: "50px", paddingBottom: "50px"}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <YouTubePlayer
                        url={'https://www.youtube.com/watch?v=b1Q75xrv2PQ'}
                        controls={true}
                    />
                </div>
                <br/>
                <h4>Promotional Video by Long Nguyen</h4>
                <br/>
                <Link to={'/game/login'} style={{textDecoration: 'none'}}>
                    <Button variant={'outlined'} color={'primary'} endIcon={<PlayArrowIcon/>}>Check
                        out the game!</Button>
                </Link>
            </div>
        </div>
    )
}

export default withRouter(PromotionalMainComponent)