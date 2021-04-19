import React from "react";
import {withRouter} from "react-router-dom";
import PromotionalTopBarComponent from "./PromotionalTopBarComponent";

function PromotionalAboutComponent() {
    return (
        <div>
            <PromotionalTopBarComponent/>
            <div style={{textAlign: "left", width: "80%", margin: "auto"}}>
                <h4>See: <a
                    href={'https://github.com/CTOverton/CMPSC_488/blob/master/promotional-website/about.html'}>here</a> for
                    title and description examples</h4>
                <br/>

                <h2>Jeremy Dellock</h2>
                <h3>ENTER TITLE</h3>
                <p>ENTER BRIEF PERSONAL PARAGRAPH</p>
                <br/>

                <h2>Nathaniel Netznik</h2>
                <h3>ENTER TITLE</h3>
                <p>ENTER BRIEF PERSONAL PARAGRAPH</p>
                <br/>

                <h2>Long Nguyen</h2>
                <h3>ENTER TITLE</h3>
                <p>ENTER BRIEF PERSONAL PARAGRAPH</p>
                <br/>

                <h2>Ben Warner</h2>
                <h3>ENTER TITLE</h3>
                <p>ENTER BRIEF PERSONAL PARAGRAPH</p>
                <br/>

                <p style={{textAlign: "center", fontSize: "xx-large"}}>Check out the
                    <a href={'https://github.com/rustylocks79/liars_dice'}>Project Github!</a></p>
            </div>
        </div>
    )
}

export default withRouter(PromotionalAboutComponent)