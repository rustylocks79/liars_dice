import React from "react";
import {withRouter} from "react-router-dom";
import YouTubePlayer from "react-player/youtube";
import PromotionalTopBarComponent from "./PromotionalTopBarComponent";

function PromotionalMainComponent() {
    return (
        <div>
            <PromotionalTopBarComponent/>
            <h1>PromotionalMainComponent</h1> <br/>
            <YouTubePlayer
                url={'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
                controls={true}
            />
        </div>
    )
}

export default withRouter(PromotionalMainComponent)