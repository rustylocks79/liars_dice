import React from "react";
import {withRouter} from "react-router-dom";
import PromotionalTopBarComponent from "./PromotionalTopBarComponent";

function PromotionalAboutComponent() {
    return (
        <div>
            <PromotionalTopBarComponent/>
            <h1>PromotionalAboutComponent</h1>
        </div>
    )
}

export default withRouter(PromotionalAboutComponent)